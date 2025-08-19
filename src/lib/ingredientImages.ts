// Image dimensions and aspect ratios for ingredients
const INGREDIENT_DIMENSIONS: { [key: string]: { width: number; height: number; aspectRatio: number } } = {
  'Brick.png': { width: 1846, height: 1195, aspectRatio: 1846/1195 }, // 1.54
  'Chanterelle.png': { width: 2940, height: 2115, aspectRatio: 2940/2115 }, // 1.39
  'Coins.png': { width: 2627, height: 1356, aspectRatio: 2627/1356 }, // 1.94
  'CornSnake.png': { width: 2423, height: 2340, aspectRatio: 2423/2340 }, // 1.04
  'Feather.png': { width: 2865, height: 1793, aspectRatio: 2865/1793 }, // 1.60
  'Fossil.png': { width: 3459, height: 1636, aspectRatio: 3459/1636 }, // 2.11
  'Icecream.png': { width: 948, height: 1125, aspectRatio: 948/1125 }, // 0.84
  'Moon.png': { width: 2198, height: 2233, aspectRatio: 2198/2233 }, // 0.98
  'Moths.png': { width: 1985, height: 2032, aspectRatio: 1985/2032 }, // 0.98
  'Parking.png': { width: 2855, height: 2080, aspectRatio: 2855/2080 }, // 1.37
  'Pawpaw.png': { width: 2657, height: 1608, aspectRatio: 2657/1608 }, // 1.65
  'Shoelace.png': { width: 1394, height: 1117, aspectRatio: 1394/1117 }, // 1.25
  'Sunscreen.png': { width: 1282, height: 2626, aspectRatio: 1282/2626 }, // 0.49
  'Teeth.png': { width: 2326, height: 2342, aspectRatio: 2326/2342 }, // 0.99
  'Water.png': { width: 2644, height: 1920, aspectRatio: 2644/1920 }, // 1.38
  'Wren.png': { width: 1827, height: 2555, aspectRatio: 1827/2555 }, // 0.72
};

// Mapping of ingredient names to image filenames
const INGREDIENT_IMAGES: { [key: string]: string } = {
  // Direct matches
  'Brick': 'Brick.png',
  'Chanterelle': 'Chanterelle.png', 
  'Coins': 'Coins.png',
  'Corn Snake': 'CornSnake.png',
  'Feather': 'Feather.png',
  'Fossil': 'Fossil.png',
  'Ice Cream': 'Icecream.png',
  'Icecream': 'Icecream.png',
  'Moon': 'Moon.png',
  'Moths': 'Moths.png',
  'Parking': 'Parking.png',
  'Pawpaw': 'Pawpaw.png',
  'Shoelace': 'Shoelace.png',
  'Sunscreen': 'Sunscreen.png',
  'Teeth': 'Teeth.png',
  'Water': 'Water.png',
  'Wren': 'Wren.png',
  
  // Common variations and aliases
  'Red brick': 'Brick.png',
  'Red brick (radio style)': 'Brick.png',
  'Carolina wren': 'Wren.png',
  'Two roosters ice cream': 'Icecream.png',
  'Shoelace from a college athlete': 'Shoelace.png',
  'Water discarded at the tsa airport line': 'Water.png',
  'Fossil from the lemur center': 'Fossil.png',
  'Change from the weaver street coop': 'Coins.png',
  'Parking validation from city council meeting': 'Parking.png',
};

export function getIngredientImage(ingredientName: string): string | null {
  // Try exact match first
  if (INGREDIENT_IMAGES[ingredientName]) {
    return `/ingredients/${INGREDIENT_IMAGES[ingredientName]}`;
  }
  
  // Try case-insensitive match
  const normalizedName = ingredientName.toLowerCase();
  for (const [key, value] of Object.entries(INGREDIENT_IMAGES)) {
    if (key.toLowerCase() === normalizedName) {
      return `/ingredients/${value}`;
    }
  }
  
  // Try partial matches for complex ingredient names
  for (const [key, value] of Object.entries(INGREDIENT_IMAGES)) {
    if (ingredientName.toLowerCase().includes(key.toLowerCase()) || 
        key.toLowerCase().includes(ingredientName.toLowerCase())) {
      return `/ingredients/${value}`;
    }
  }
  
  return null; // No image found
}

export function hasIngredientImage(ingredientName: string): boolean {
  return getIngredientImage(ingredientName) !== null;
}

export function getIngredientDimensions(ingredientName: string): { width: number; height: number; aspectRatio: number } | null {
  const imageName = INGREDIENT_IMAGES[ingredientName];
  if (!imageName) {
    // Try case-insensitive and partial matches
    for (const [key, value] of Object.entries(INGREDIENT_IMAGES)) {
      if (key.toLowerCase() === ingredientName.toLowerCase() ||
          ingredientName.toLowerCase().includes(key.toLowerCase()) || 
          key.toLowerCase().includes(ingredientName.toLowerCase())) {
        return INGREDIENT_DIMENSIONS[value];
      }
    }
    return null;
  }
  return INGREDIENT_DIMENSIONS[imageName];
}

// Creates a layout that efficiently partitions the viewport using actual image aspect ratios
export function generateViewportPartitionLayout(
  ingredients: string[], 
  viewportWidth: number = 100, 
  viewportHeight: number = 100
): Array<{ x: number; y: number; width: number; height: number; ingredient: string }> {
  const items: Array<{ x: number; y: number; width: number; height: number; ingredient: string }> = [];
  
  // Calculate total area and get aspect ratios for all ingredients
  const ingredientData = ingredients.map(ingredient => {
    const dims = getIngredientDimensions(ingredient);
    return {
      ingredient,
      aspectRatio: dims?.aspectRatio || 1.0,
      area: dims ? dims.width * dims.height : 1000000
    };
  });
  
  // Sort by area (larger images get more space) then by aspect ratio
  ingredientData.sort((a, b) => b.area - a.area);
  
  // Calculate how to partition the viewport efficiently
  const totalIngredients = ingredients.length;
  const totalAspectRatioSum = ingredientData.reduce((sum, item) => sum + item.aspectRatio, 0);
  
  // Use a flexible row-based packing approach
  const targetRowHeight = viewportHeight / Math.ceil(Math.sqrt(totalIngredients));
  let currentY = 0;
  let currentRowItems: typeof ingredientData = [];
  let rowStartIndex = 0;
  
  const processRow = (rowItems: typeof ingredientData, yPos: number, availableHeight: number) => {
    if (rowItems.length === 0) return yPos;
    
    // Calculate the total width needed if all items had the target height
    const totalAspectRatios = rowItems.reduce((sum, item) => sum + item.aspectRatio, 0);
    const scaleFactor = viewportWidth / (totalAspectRatios * availableHeight);
    const actualHeight = availableHeight * scaleFactor;
    
    let currentX = 0;
    rowItems.forEach(({ ingredient, aspectRatio }) => {
      const width = (aspectRatio * actualHeight);
      
      items.push({
        ingredient,
        x: currentX,
        y: yPos,
        width: Math.min(width, viewportWidth - currentX),
        height: Math.min(actualHeight, viewportHeight - yPos)
      });
      
      currentX += width;
    });
    
    return yPos + actualHeight;
  };
  
  // Pack ingredients into rows
  for (let i = 0; i < ingredientData.length; i++) {
    currentRowItems.push(ingredientData[i]);
    
    // Calculate if we should start a new row
    const remainingItems = totalIngredients - i - 1;
    const remainingHeight = viewportHeight - currentY;
    const itemsInCurrentRow = currentRowItems.length;
    
    // Start new row if:
    // 1. We have enough items for a good row (3-5 items)
    // 2. Or we're running out of vertical space
    // 3. Or this is the last item
    const shouldStartNewRow = (
      (itemsInCurrentRow >= 3 && remainingItems > 2) ||
      (remainingHeight < targetRowHeight * 1.5 && remainingItems > 0) ||
      (i === ingredientData.length - 1)
    );
    
    if (shouldStartNewRow) {
      const rowHeight = Math.min(targetRowHeight, remainingHeight);
      currentY = processRow(currentRowItems, currentY, rowHeight);
      currentRowItems = [];
    }
  }
  
  // Scale everything to fit perfectly in viewport if needed
  if (items.length > 0) {
    const maxY = Math.max(...items.map(item => item.y + item.height));
    if (maxY > viewportHeight) {
      const scaleY = viewportHeight / maxY;
      items.forEach(item => {
        item.y *= scaleY;
        item.height *= scaleY;
      });
    }
  }
  
  return items;
}