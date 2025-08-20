import potpack from 'potpack';
import { getIngredientDimensions } from './ingredientImages';

// Layout item interface
export interface LayoutItem {
  ingredient: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

// Layout strategy interface
export interface LayoutStrategy {
  generateLayout(
    ingredients: string[], 
    containerWidth: number, 
    containerHeight: number
  ): LayoutItem[];
}

// Masonry layout strategy (existing implementation)
export class MasonryLayoutStrategy implements LayoutStrategy {
  generateLayout(
    ingredients: string[], 
    containerWidth: number = 300, 
    containerHeight: number = 100
  ): LayoutItem[] {
    const items: LayoutItem[] = [];
    
    // Get dimensions for all ingredients with deterministic seeding
    const ingredientData = ingredients.map((ingredient, index) => {
      const dims = getIngredientDimensions(ingredient);
      
      // Create deterministic seed from ingredient name for consistent layout
      let seed = 0;
      for (let i = 0; i < ingredient.length; i++) {
        seed = ((seed << 5) - seed + ingredient.charCodeAt(i)) & 0xffffffff;
      }
      seed = Math.abs(seed) / 0xffffffff;
      
      return {
        ingredient,
        aspectRatio: dims?.aspectRatio || 1.0,
        area: dims ? dims.width * dims.height : 1000000,
        seed,
        originalWidth: dims?.width || 1000,
        originalHeight: dims?.height || 1000
      };
    });
    
    // Sort by visual interest: mix of area, aspect ratio uniqueness, and seed
    ingredientData.sort((a, b) => {
      const aInterest = a.area * 0.4 + Math.abs(a.aspectRatio - 1.3) * 1000000 * 0.3 + a.seed * 0.3;
      const bInterest = b.area * 0.4 + Math.abs(b.aspectRatio - 1.3) * 1000000 * 0.3 + b.seed * 0.3;
      return bInterest - aInterest;
    });
    
    // Masonry algorithm: track column heights and place in shortest column
    const numColumns = 8; // More columns for finer control
    const columnWidth = containerWidth / numColumns;
    const columnHeights = new Array(numColumns).fill(0);
    const gap = 1; // Small gap between items
    
    ingredientData.forEach(({ ingredient, aspectRatio, seed, area }) => {
      // Determine size based on ingredient characteristics and image area
      const sizeCategory = Math.floor(seed * 4); // 4 size categories
      let sizeFactor;
      
      switch (sizeCategory) {
        case 0: // Small items (1 column)
          sizeFactor = 0.8 + (seed * 0.4); // 0.8 to 1.2
          break;
        case 1: // Medium items (1-2 columns)
          sizeFactor = 1.2 + (seed * 0.6); // 1.2 to 1.8
          break;
        case 2: // Large items (2-3 columns)
          sizeFactor = 1.8 + (seed * 0.8); // 1.8 to 2.6
          break;
        case 3: // Extra large items (3-4 columns)
          sizeFactor = 2.4 + (seed * 1.2); // 2.4 to 3.6
          break;
        default:
          sizeFactor = 1.0;
      }
      
      // Calculate dimensions
      const baseSize = containerHeight * 0.25; // Base size relative to container
      const height = baseSize * sizeFactor;
      const width = height * aspectRatio;
      
      // Determine how many columns this item will span
      const columnsNeeded = Math.min(Math.ceil(width / columnWidth), numColumns);
      
      // Find the best starting column (where the max height in the span is minimized)
      let bestColumn = 0;
      let bestMaxHeight = Infinity;
      
      for (let col = 0; col <= numColumns - columnsNeeded; col++) {
        const maxHeightInSpan = Math.max(...columnHeights.slice(col, col + columnsNeeded));
        if (maxHeightInSpan < bestMaxHeight) {
          bestMaxHeight = maxHeightInSpan;
          bestColumn = col;
        }
      }
      
      // Position the item
      const x = bestColumn * columnWidth + (gap / 2);
      const y = bestMaxHeight + gap;
      
      // Adjust width to fit exactly in the columns (with gaps)
      const actualWidth = (columnsNeeded * columnWidth) - gap;
      const actualHeight = actualWidth / aspectRatio;
      
      items.push({
        ingredient,
        x,
        y,
        width: actualWidth,
        height: actualHeight
      });
      
      // Update column heights for all spanned columns
      for (let col = bestColumn; col < bestColumn + columnsNeeded; col++) {
        columnHeights[col] = y + actualHeight;
      }
    });
    
    return items;
  }
}

// Potpack bin-packing layout strategy
export class PotpackLayoutStrategy implements LayoutStrategy {
  generateLayout(
    ingredients: string[], 
    containerWidth: number = 300, 
    containerHeight: number = 100
  ): LayoutItem[] {
    // Prepare items for potpack with realistic sizes based on image dimensions
    const itemsForPacking = ingredients.map((ingredient, index) => {
      const dims = getIngredientDimensions(ingredient);
      
      // Create deterministic seed from ingredient name
      let seed = 0;
      for (let i = 0; i < ingredient.length; i++) {
        seed = ((seed << 5) - seed + ingredient.charCodeAt(i)) & 0xffffffff;
      }
      seed = Math.abs(seed) / 0xffffffff;
      
      // Calculate target size based on image area and aesthetic considerations
      const aspectRatio = dims?.aspectRatio || 1.0;
      const area = dims ? dims.width * dims.height : 1000000;
      
      // Size based on area ranking and some randomness for variety
      const areaRank = ingredients.length - index; // Larger areas get higher rank
      const baseSizeFactor = 0.6 + (areaRank / ingredients.length) * 0.8; // 0.6 to 1.4
      const randomVariation = 0.8 + (seed * 0.4); // 0.8 to 1.2
      const finalSizeFactor = baseSizeFactor * randomVariation;
      
      // Target dimensions that will fit nicely in the container
      const targetHeight = containerHeight * 0.15 * finalSizeFactor; // 15% of container height as base
      const targetWidth = targetHeight * aspectRatio;
      
      return {
        w: Math.round(targetWidth),
        h: Math.round(targetHeight),
        ingredient,
        aspectRatio,
        seed
      };
    });
    
    // Sort by area for better packing (larger items first generally works better)
    itemsForPacking.sort((a, b) => (b.w * b.h) - (a.w * a.h));
    
    // Use potpack to efficiently pack the items
    const { w: packedWidth, h: packedHeight } = potpack(itemsForPacking);
    
    // Convert potpack results to our layout format
    const items: LayoutItem[] = itemsForPacking.map(item => ({
      ingredient: item.ingredient,
      x: (item.x / packedWidth) * containerWidth,
      y: (item.y / packedHeight) * containerHeight,
      width: (item.w / packedWidth) * containerWidth,
      height: (item.h / packedHeight) * containerHeight
    }));
    
    return items;
  }
}

// Circle packing layout strategy inspired by Tyler Hobbs' approach
export class CirclePackingLayoutStrategy implements LayoutStrategy {
  generateLayout(
    ingredients: string[], 
    containerWidth: number = 300, 
    containerHeight: number = 100
  ): LayoutItem[] {
    const items: LayoutItem[] = [];
    
    // Prepare ingredient data with sizes based on actual dimensions
    const ingredientData = ingredients.map((ingredient, index) => {
      const dims = getIngredientDimensions(ingredient);
      
      // Create deterministic seed from ingredient name for consistent layout
      let seed = 0;
      for (let i = 0; i < ingredient.length; i++) {
        seed = ((seed << 5) - seed + ingredient.charCodeAt(i)) & 0xffffffff;
      }
      seed = Math.abs(seed) / 0xffffffff;
      
      // Calculate size based on image area and some randomness
      const area = dims ? dims.width * dims.height : 1000000;
      const aspectRatio = dims?.aspectRatio || 1.0;
      
      // Size factor based on area ranking and deterministic randomness
      const areaRank = ingredients.length - index;
      const baseSizeFactor = 0.4 + (areaRank / ingredients.length) * 0.6; // 0.4 to 1.0
      const randomVariation = 0.7 + (seed * 0.6); // 0.7 to 1.3
      const sizeFactor = baseSizeFactor * randomVariation;
      
      // Calculate radius for collision detection (treat as circle)
      const baseRadius = Math.min(containerWidth, containerHeight) * 0.08 * sizeFactor;
      
      return {
        ingredient,
        aspectRatio,
        seed,
        area,
        radius: baseRadius,
        // Calculate final rectangular dimensions
        width: baseRadius * 2 * Math.sqrt(aspectRatio),
        height: baseRadius * 2 / Math.sqrt(aspectRatio),
        placed: false
      };
    });
    
    // Sort by radius (largest first, like Tyler Hobbs' approach)
    ingredientData.sort((a, b) => b.radius - a.radius);
    
    // Place circles using randomized approach with collision detection
    const maxAttempts = 2000;
    const placedCircles: Array<{ x: number; y: number; radius: number }> = [];
    
    for (const ingredientInfo of ingredientData) {
      let placed = false;
      
      for (let attempt = 0; attempt < maxAttempts && !placed; attempt++) {
        // Generate random position using deterministic seed mixed with attempt
        const randomSeed = (ingredientInfo.seed + attempt * 0.001) % 1;
        const randomSeed2 = (ingredientInfo.seed + attempt * 0.0013) % 1;
        
        // Try position with some margin from edges
        const margin = ingredientInfo.radius;
        const x = margin + randomSeed * (containerWidth - 2 * margin);
        const y = margin + randomSeed2 * (containerHeight - 2 * margin);
        
        // Check collision with existing circles
        let hasCollision = false;
        for (const existingCircle of placedCircles) {
          const dx = x - existingCircle.x;
          const dy = y - existingCircle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const minDistance = ingredientInfo.radius + existingCircle.radius + 2; // Small gap
          
          if (distance < minDistance) {
            hasCollision = true;
            break; // Check largest circles first for efficiency
          }
        }
        
        if (!hasCollision) {
          // Successfully placed!
          placedCircles.push({ x, y, radius: ingredientInfo.radius });
          
          items.push({
            ingredient: ingredientInfo.ingredient,
            x: ((x - ingredientInfo.width / 2) / containerWidth) * 100,
            y: ((y - ingredientInfo.height / 2) / containerHeight) * 100,
            width: (ingredientInfo.width / containerWidth) * 100,
            height: (ingredientInfo.height / containerHeight) * 100
          });
          
          placed = true;
        }
      }
      
      // If we couldn't place after max attempts, try a fallback position
      if (!placed) {
        // Find a less crowded area using deterministic positioning
        const fallbackX = (ingredientInfo.seed * containerWidth) % containerWidth;
        const fallbackY = ((ingredientInfo.seed * 1.3) % 1) * containerHeight;
        
        const clampedX = Math.max(0, Math.min(containerWidth - ingredientInfo.width, fallbackX - ingredientInfo.width / 2));
        const clampedY = Math.max(0, Math.min(containerHeight - ingredientInfo.height, fallbackY - ingredientInfo.height / 2));
        
        items.push({
          ingredient: ingredientInfo.ingredient,
          x: (clampedX / containerWidth) * 100,
          y: (clampedY / containerHeight) * 100,
          width: (ingredientInfo.width / containerWidth) * 100,
          height: (ingredientInfo.height / containerHeight) * 100
        });
      }
    }
    
    return items;
  }
}

// Poisson disc sampling layout strategy inspired by Jason Davies' implementation
export class PoissonDiscLayoutStrategy implements LayoutStrategy {
  generateLayout(
    ingredients: string[], 
    containerWidth: number = 300, 
    containerHeight: number = 100
  ): LayoutItem[] {
    const items: LayoutItem[] = [];
    
    // Prepare ingredient data with sizes
    const ingredientData = ingredients.map((ingredient, index) => {
      const dims = getIngredientDimensions(ingredient);
      
      // Create deterministic seed from ingredient name
      let seed = 0;
      for (let i = 0; i < ingredient.length; i++) {
        seed = ((seed << 5) - seed + ingredient.charCodeAt(i)) & 0xffffffff;
      }
      seed = Math.abs(seed) / 0xffffffff;
      
      const area = dims ? dims.width * dims.height : 1000000;
      const aspectRatio = dims?.aspectRatio || 1.0;
      
      // Calculate size based on area and deterministic randomness
      const areaRank = ingredients.length - index;
      const baseSizeFactor = 0.5 + (areaRank / ingredients.length) * 0.5; // 0.5 to 1.0
      const randomVariation = 0.8 + (seed * 0.4); // 0.8 to 1.2
      const sizeFactor = baseSizeFactor * randomVariation;
      
      // Base size for this ingredient
      const baseSize = Math.min(containerWidth, containerHeight) * 0.12 * sizeFactor;
      
      return {
        ingredient,
        aspectRatio,
        seed,
        area,
        width: baseSize * Math.sqrt(aspectRatio),
        height: baseSize / Math.sqrt(aspectRatio),
        radius: baseSize * 0.5 // For minimum distance calculation
      };
    });
    
    // Sort by area for better placement
    ingredientData.sort((a, b) => b.area - a.area);
    
    // Poisson disc sampling parameters
    const minDistance = Math.min(containerWidth, containerHeight) * 0.08;
    const maxAttempts = 30;
    const gridSize = minDistance / Math.sqrt(2);
    
    // Grid for efficient spatial queries
    const gridWidth = Math.ceil(containerWidth / gridSize);
    const gridHeight = Math.ceil(containerHeight / gridSize);
    const grid: (number | null)[][] = Array(gridWidth).fill(null).map(() => Array(gridHeight).fill(null));
    
    // Points and active list for Bridson's algorithm
    const points: { x: number; y: number; ingredientIndex: number }[] = [];
    const activeList: number[] = [];
    
    // Helper function to get grid coordinates
    const getGridCoords = (x: number, y: number) => ({
      gridX: Math.floor(x / gridSize),
      gridY: Math.floor(y / gridSize)
    });
    
    // Check if point is valid (far enough from existing points)
    const isValidPoint = (x: number, y: number, ingredientIndex: number) => {
      if (x < 0 || y < 0 || x >= containerWidth || y >= containerHeight) return false;
      
      const currentIngredient = ingredientData[ingredientIndex];
      const { gridX, gridY } = getGridCoords(x, y);
      
      // Check surrounding grid cells
      const searchRadius = 2;
      for (let dx = -searchRadius; dx <= searchRadius; dx++) {
        for (let dy = -searchRadius; dy <= searchRadius; dy++) {
          const checkX = gridX + dx;
          const checkY = gridY + dy;
          
          if (checkX >= 0 && checkX < gridWidth && checkY >= 0 && checkY < gridHeight) {
            const pointIndex = grid[checkX][checkY];
            if (pointIndex !== null) {
              const existingPoint = points[pointIndex];
              const existingIngredient = ingredientData[existingPoint.ingredientIndex];
              
              const dx = x - existingPoint.x;
              const dy = y - existingPoint.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              
              // Minimum distance based on both ingredients' sizes
              const requiredDistance = (currentIngredient.radius + existingIngredient.radius) * 0.8;
              
              if (distance < requiredDistance) {
                return false;
              }
            }
          }
        }
      }
      
      return true;
    };
    
    // Add point to grid and lists
    const addPoint = (x: number, y: number, ingredientIndex: number) => {
      const pointIndex = points.length;
      points.push({ x, y, ingredientIndex });
      activeList.push(pointIndex);
      
      const { gridX, gridY } = getGridCoords(x, y);
      grid[gridX][gridY] = pointIndex;
      
      return pointIndex;
    };
    
    // Place initial point using first ingredient's seed
    const firstIngredient = ingredientData[0];
    const initialX = containerWidth * 0.3 + (firstIngredient.seed * containerWidth * 0.4);
    const initialY = containerHeight * 0.3 + (firstIngredient.seed * containerHeight * 0.4);
    addPoint(initialX, initialY, 0);
    
    let ingredientIndex = 1;
    
    // Poisson disc sampling main loop - using deterministic randomness
    while (activeList.length > 0 && ingredientIndex < ingredientData.length) {
      // Pick point from active list using deterministic approach
      const currentIngredient = ingredientData[ingredientIndex];
      const randomSeed = (currentIngredient.seed * 1000) % 1;
      const randomIndex = Math.floor(randomSeed * activeList.length);
      const activePointIndex = activeList[randomIndex];
      const activePoint = points[activePointIndex];
      
      let found = false;
      
      // Try to generate new points around this active point
      for (let attempt = 0; attempt < maxAttempts && !found; attempt++) {
        // Generate point in annulus (ring) around active point using deterministic randomness
        const seedForAngle = (currentIngredient.seed + attempt * 0.1) % 1;
        const seedForDistance = (currentIngredient.seed + attempt * 0.13) % 1;
        
        const angle = seedForAngle * 2 * Math.PI;
        const minDist = minDistance + currentIngredient.radius;
        const maxDist = minDist * 2;
        const distance = minDist + seedForDistance * (maxDist - minDist);
        
        const newX = activePoint.x + Math.cos(angle) * distance;
        const newY = activePoint.y + Math.sin(angle) * distance;
        
        if (isValidPoint(newX, newY, ingredientIndex)) {
          addPoint(newX, newY, ingredientIndex);
          ingredientIndex++;
          found = true;
        }
      }
      
      // Remove from active list if no valid point found
      if (!found) {
        activeList.splice(randomIndex, 1);
      }
    }
    
    // Convert points to layout items with proper percentage conversion
    points.forEach(point => {
      const ingredient = ingredientData[point.ingredientIndex];
      items.push({
        ingredient: ingredient.ingredient,
        x: ((point.x - ingredient.width / 2) / containerWidth) * 100,
        y: ((point.y - ingredient.height / 2) / containerHeight) * 100,
        width: (ingredient.width / containerWidth) * 100,
        height: (ingredient.height / containerHeight) * 100
      });
    });
    
    return items;
  }
}

// Available layout strategies
export const layoutStrategies = {
  masonry: new MasonryLayoutStrategy(),
  potpack: new PotpackLayoutStrategy(),
  circlepacking: new CirclePackingLayoutStrategy(),
  poisson: new PoissonDiscLayoutStrategy()
} as const;

export type LayoutStrategyName = keyof typeof layoutStrategies;