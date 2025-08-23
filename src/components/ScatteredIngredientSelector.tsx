import { ImageManifest } from '@/lib/image-manifest';
import { useMemo, useRef, useEffect } from 'react';

interface IngredientPosition {
  x: number;
  y: number;
  width: number;
  height: number;
  size: 'small' | 'medium' | 'large';
}

interface IngredientWithPosition extends ImageManifest {
  position: IngredientPosition;
}

interface ScatteredIngredientSelectorProps {
  ingredients: ImageManifest[];
  selectedIngredients: string[];
  onToggleIngredient: (ingredient: string) => void;
  maxIngredients?: number;
}

// Size configurations for different ingredient card sizes
const SIZE_CONFIGS = {
  small: { width: 80, height: 80 },
  medium: { width: 120, height: 120 },
  large: { width: 160, height: 160 }
} as const;

// Container dimensions - wide enough for 100 ingredients
const CONTAINER_WIDTH = 4000;
const CONTAINER_HEIGHT = 600;
const PADDING = 20;

// Collision detection function
function checkCollision(pos1: IngredientPosition, pos2: IngredientPosition, buffer = 10): boolean {
  return !(
    pos1.x + pos1.width + buffer < pos2.x ||
    pos2.x + pos2.width + buffer < pos1.x ||
    pos1.y + pos1.height + buffer < pos2.y ||
    pos2.y + pos2.height + buffer < pos1.y
  );
}

// Generate random positions with collision detection
function generateScatteredPositions(ingredients: ImageManifest[]): IngredientWithPosition[] {
  const positions: IngredientPosition[] = [];
  const ingredientsWithPositions: IngredientWithPosition[] = [];
  
  // Create a seeded random function that changes on each page load
  const seed = Date.now();
  let random = (() => {
    let s = seed;
    return () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
  })();

  for (const ingredient of ingredients) {
    // Randomly assign size
    const sizeOptions: (keyof typeof SIZE_CONFIGS)[] = ['small', 'medium', 'large'];
    const sizeWeights = [0.5, 0.3, 0.2]; // 50% small, 30% medium, 20% large
    
    let size: keyof typeof SIZE_CONFIGS = 'medium';
    const sizeRand = random();
    if (sizeRand < sizeWeights[0]) size = 'small';
    else if (sizeRand < sizeWeights[0] + sizeWeights[1]) size = 'medium';
    else size = 'large';

    const { width, height } = SIZE_CONFIGS[size];

    // Try to find a non-overlapping position (max 50 attempts)
    let attempts = 0;
    let position: IngredientPosition | null = null;

    while (attempts < 50 && !position) {
      const x = PADDING + random() * (CONTAINER_WIDTH - width - PADDING * 2);
      const y = PADDING + random() * (CONTAINER_HEIGHT - height - PADDING * 2);

      const candidatePosition: IngredientPosition = { x, y, width, height, size };

      // Check for collisions with existing positions
      const hasCollision = positions.some(pos => checkCollision(candidatePosition, pos));

      if (!hasCollision) {
        position = candidatePosition;
        positions.push(position);
      }

      attempts++;
    }

    // If we couldn't find a spot after 50 attempts, place it anyway but try to minimize overlap
    if (!position) {
      const x = PADDING + random() * (CONTAINER_WIDTH - width - PADDING * 2);
      const y = PADDING + random() * (CONTAINER_HEIGHT - height - PADDING * 2);
      position = { x, y, width, height, size };
      positions.push(position);
    }

    ingredientsWithPositions.push({
      ...ingredient,
      position
    });
  }

  return ingredientsWithPositions;
}

export default function ScatteredIngredientSelector({
  ingredients,
  selectedIngredients,
  onToggleIngredient,
  maxIngredients = 6
}: ScatteredIngredientSelectorProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Generate positions once and memoize them
  const ingredientsWithPositions = useMemo(() => {
    return generateScatteredPositions(ingredients);
  }, [ingredients]);

  // Infinite scroll implementation
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const scrollLeft = scrollContainer.scrollLeft;
      const scrollWidth = scrollContainer.scrollWidth;
      const clientWidth = scrollContainer.clientWidth;
      
      // Since we duplicate content, the actual content width is half of scrollWidth
      const contentWidth = CONTAINER_WIDTH;
      
      // If scrolled past the original content, wrap to beginning
      if (scrollLeft >= contentWidth) {
        scrollContainer.scrollLeft = scrollLeft - contentWidth;
      }
      // If scrolled before the beginning (negative), wrap to end
      else if (scrollLeft <= 0) {
        scrollContainer.scrollLeft = contentWidth;
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    
    // Set initial scroll position to middle to allow scrolling both directions
    scrollContainer.scrollLeft = CONTAINER_WIDTH / 2;

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Function to generate random colors for the pulsing effect
  const getRandomColor = () => {
    const colors = [
      '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57',
      '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43',
      '#10ac84', '#ee5a24', '#2f3542', '#3742fa', '#ff6348'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Render ingredient at given position
  const renderIngredient = (ingredient: IngredientWithPosition, offsetX = 0) => {
    const isSelected = selectedIngredients.includes(ingredient.name);
    const randomColor = isSelected ? getRandomColor() : '';
    const { position } = ingredient;
    
    return (
      <button
        key={`${ingredient.name}-${offsetX}`}
        onClick={() => onToggleIngredient(ingredient.name)}
        disabled={!isSelected && selectedIngredients.length >= maxIngredients}
        className={`absolute p-3 transition-all font-medium flex flex-col items-center gap-2 justify-center bg-background text-foreground hover:bg-foreground/10 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg border border-gray-600/20`}
        style={{
          left: `${position.x + offsetX}px`,
          top: `${position.y}px`,
          width: `${position.width}px`,
          height: `${position.height}px`,
          ...(isSelected ? { boxShadow: `0 0 20px ${randomColor}` } : {})
        }}
      >
        <img
          src={`/${ingredient.thumbnails.large}`}
          alt={ingredient.name}
          className={`max-w-full max-h-full object-contain rounded ${
            isSelected ? 'opacity-90' : 'opacity-70'
          }`}
          style={{ 
            maxWidth: `${position.width - 24}px`, 
            maxHeight: `${position.height - 24}px` 
          }}
        />
      </button>
    );
  };

  return (
    <div className="w-full">
      {/* Horizontal scrolling container */}
      <div 
        ref={scrollContainerRef}
        className="overflow-x-auto overflow-y-hidden"
        style={{ height: `${CONTAINER_HEIGHT}px` }}
      >
        {/* Double-wide container with duplicated content for infinite scroll */}
        <div 
          className="relative"
          style={{ 
            width: `${CONTAINER_WIDTH * 2}px`, 
            height: `${CONTAINER_HEIGHT}px`,
            minWidth: `${CONTAINER_WIDTH * 2}px`
          }}
        >
          {/* Original content */}
          {ingredientsWithPositions.map(ingredient => renderIngredient(ingredient, 0))}
          
          {/* Duplicated content offset by CONTAINER_WIDTH */}
          {ingredientsWithPositions.map(ingredient => renderIngredient(ingredient, CONTAINER_WIDTH))}
        </div>
      </div>
      
      {/* Scroll hint */}
      <div className="text-center text-gray-400 text-sm mt-4">
        ← Scroll horizontally to forage endlessly →
      </div>
    </div>
  );
}