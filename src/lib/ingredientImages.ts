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