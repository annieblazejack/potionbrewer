import fs from 'fs';
import path from 'path';

export interface Ingredient {
  name: string;
  isFalse: boolean;
  bodyPart?: string;
  associationA?: string;
  associationB?: string;
  potionUseA?: string;
  potionUseB?: string;
  pairing?: string;
  category?: string;
}

export interface IngredientCategory {
  name: string;
  ingredients: Ingredient[];
  color: string;
  icon: string;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

export function loadIngredientsDetailed(): IngredientCategory[] {
  try {
    const csvPath = path.join(process.cwd(), 'ingredients.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = csvContent.split('\n').filter(line => line.trim());
    
    const categories: { [key: string]: Ingredient[] } = {};
    let currentCategory = 'Unknown';
    
    for (let i = 1; i < lines.length; i++) { // Skip header
      const line = lines[i];
      const columns = parseCSVLine(line);
      const name = columns[0]?.trim();
      
      if (!name) continue;
      
      // Check if this is a category header (like "PLANTS", "ANIMALS", etc.)
      if (columns[1] === 'FALSE' && !columns[2] && !columns[3] && !columns[4]) {
        currentCategory = name;
        categories[currentCategory] = categories[currentCategory] || [];
        continue;
      }
      
      if (name !== 'INGREDIENT') {
        const ingredient: Ingredient = {
          name: name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(),
          isFalse: columns[1] === 'FALSE',
          bodyPart: columns[2]?.trim() || undefined,
          associationA: columns[3]?.trim() || undefined,
          associationB: columns[4]?.trim() || undefined,
          potionUseA: columns[5]?.trim() || undefined,
          potionUseB: columns[6]?.trim() || undefined,
          pairing: columns[7]?.trim() || undefined,
          category: currentCategory
        };
        
        categories[currentCategory] = categories[currentCategory] || [];
        categories[currentCategory].push(ingredient);
      }
    }
    
    // Redistribute all ingredients into 3 mystical categories
    const allIngredients = Object.values(categories).flat();
    
    // Deduplicate ingredients by name, keeping the first occurrence
    const uniqueIngredients = allIngredients.filter((ingredient, index, array) => 
      array.findIndex(item => item.name === ingredient.name) === index
    );
    
    const mysticalCategories: IngredientCategory[] = [
      {
        name: 'Essence of the Ancient Grove',
        color: 'emerald',
        icon: '🌲',
        ingredients: []
      },
      {
        name: 'Whispers of the Living Realm',
        color: 'amber', 
        icon: '🦋',
        ingredients: []
      },
      {
        name: 'Fragments of the Ethereal Veil',
        color: 'purple',
        icon: '🌙',
        ingredients: []
      }
    ];
    
    // Distribute unique ingredients across the 3 categories in a mystical pattern
    uniqueIngredients.forEach((ingredient, index) => {
      const categoryIndex = index % 3;
      mysticalCategories[categoryIndex].ingredients.push(ingredient);
    });
    
    return mysticalCategories.filter(cat => cat.ingredients.length > 0);
    
  } catch (error) {
    console.error('Error loading ingredients from CSV:', error);
    
    // Fallback data
    return [{
      name: 'Mystical Ingredients',
      color: 'purple',
      icon: '🧪',
      ingredients: [
        'Dragon Scale', 'Phoenix Feather', 'Moonstone Dust', 'Unicorn Hair',
        'Troll Blood', 'Fairy Wings', 'Vampire Fang', 'Mermaid Tears',
        'Griffin Claw', 'Basilisk Venom', 'Angel Dust', 'Demon Horn',
        'Witch Hazel', 'Mandrake Root', 'Eye of Newt', 'Bat Wing'
      ].map(name => ({ name, isFalse: false, category: 'Mystical Ingredients' }))
    }];
  }
}

// Simple function for backward compatibility
export function loadIngredients(): string[] {
  const categories = loadIngredientsDetailed();
  return categories
    .flatMap(cat => cat.ingredients)
    .map(ing => ing.name)
    .slice(0, 100); // Reasonable limit for the UI
}