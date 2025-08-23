import { ImageManifest } from '@/lib/image-manifest';
import { useMemo, useRef, useEffect, useState } from 'react';
import IngredientPreview from './IngredientPreview';

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
  const [previewingIngredient, setPreviewingIngredient] = useState<string | null>(null);
  const [previewAnchorRect, setPreviewAnchorRect] = useState<DOMRect | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  // Detect if device is mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

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

  // Handle preview interactions
  const handleMouseEnter = (ingredient: ImageManifest, event: React.MouseEvent<HTMLButtonElement>) => {
    if (isMobile) return; // Only for desktop
    
    if (hoverTimeout) clearTimeout(hoverTimeout);
    
    const timeout = setTimeout(() => {
      const rect = event.currentTarget.getBoundingClientRect();
      setPreviewAnchorRect(rect);
      setPreviewingIngredient(ingredient.name);
    }, 500); // 500ms delay for hover
    
    setHoverTimeout(timeout);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    
    // Add delay before closing to allow moving to preview
    setTimeout(() => {
      setPreviewingIngredient(null);
    }, 150);
  };

  const handlePreviewMouseEnter = () => {
    // Cancel any pending close when entering preview
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
  };

  const handlePreviewMouseLeave = () => {
    // Close preview when leaving it
    if (!isMobile) {
      setTimeout(() => {
        setPreviewingIngredient(null);
      }, 100);
    }
  };

  const handleClick = (ingredient: ImageManifest, event: React.MouseEvent<HTMLButtonElement>) => {
    if (isMobile) {
      // On mobile, first click shows preview
      if (previewingIngredient !== ingredient.name) {
        setPreviewingIngredient(ingredient.name);
        return;
      }
    } else {
      // On desktop, click makes preview sticky or selects if already showing
      if (previewingIngredient === ingredient.name) {
        // Second click selects
        onToggleIngredient(ingredient.name);
        setPreviewingIngredient(null);
        return;
      } else {
        // First click shows preview
        const rect = event.currentTarget.getBoundingClientRect();
        setPreviewAnchorRect(rect);
        setPreviewingIngredient(ingredient.name);
        return;
      }
    }
  };

  const handleKeyDown = (ingredient: ImageManifest, event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter') {
      // Enter shows preview
      if (previewingIngredient !== ingredient.name) {
        const rect = event.currentTarget.getBoundingClientRect();
        setPreviewAnchorRect(rect);
        setPreviewingIngredient(ingredient.name);
      }
    } else if (event.key === ' ') {
      // Space selects ingredient
      event.preventDefault();
      onToggleIngredient(ingredient.name);
    }
  };

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
    const isDisabled = !isSelected && selectedIngredients.length >= maxIngredients;
    const randomColor = isSelected ? getRandomColor() : '';
    const { position } = ingredient;
    
    return (
      <button
        key={`${ingredient.name}-${offsetX}`}
        onClick={(e) => handleClick(ingredient, e)}
        onMouseEnter={(e) => handleMouseEnter(ingredient, e)}
        onMouseLeave={handleMouseLeave}
        onKeyDown={(e) => handleKeyDown(ingredient, e)}
        disabled={false} // We handle disabled state in the preview now
        className={`absolute p-3 transition-all font-medium flex flex-col items-center gap-2 justify-center bg-background text-foreground hover:bg-foreground/10 rounded-lg border border-gray-600/20 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          isDisabled ? 'opacity-50' : ''
        } ${
          previewingIngredient === ingredient.name ? 'ring-2 ring-blue-400' : ''
        }`}
        style={{
          left: `${position.x + offsetX}px`,
          top: `${position.y}px`,
          width: `${position.width}px`,
          height: `${position.height}px`,
          ...(isSelected ? { boxShadow: `0 0 20px ${randomColor}` } : {})
        }}
        aria-label={`${ingredient.name} ingredient ${isSelected ? '(selected)' : ''}`}
      >
        <img
          src={`/${ingredient.thumbnails.large}`}
          alt=""
          className={`max-w-full max-h-full object-contain rounded pointer-events-none ${
            isSelected ? 'opacity-90' : 'opacity-70'
          }`}
          style={{ 
            maxWidth: `${position.width - 24}px`, 
            maxHeight: `${position.height - 24}px` 
          }}
        />
        
        {/* Visual indicator for preview state */}
        {previewingIngredient === ingredient.name && (
          <div className="absolute inset-0 border-2 border-blue-400 rounded-lg pointer-events-none" />
        )}
      </button>
    );
  };

  // Get the currently previewing ingredient data
  const previewIngredient = previewingIngredient 
    ? ingredients.find(ing => ing.name === previewingIngredient)
    : null;

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
      
      {/* Ingredient Preview */}
      {previewIngredient && (
        <IngredientPreview
          ingredient={previewIngredient}
          isVisible={!!previewingIngredient}
          onClose={() => setPreviewingIngredient(null)}
          onSelect={() => onToggleIngredient(previewIngredient.name)}
          isSelected={selectedIngredients.includes(previewIngredient.name)}
          isDisabled={!selectedIngredients.includes(previewIngredient.name) && selectedIngredients.length >= maxIngredients}
          anchorRect={previewAnchorRect}
          isMobile={isMobile}
          onMouseEnter={handlePreviewMouseEnter}
          onMouseLeave={handlePreviewMouseLeave}
          showSelectButton={isMobile} // Only show button on mobile
        />
      )}
      
    </div>
  );
}