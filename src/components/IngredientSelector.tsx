import { useState } from 'react';
import { getIngredientImage, hasIngredientImage } from '@/lib/ingredientImages';

interface IngredientSelectorProps {
  ingredients: string[];
  selectedIngredients: string[];
  onToggleIngredient: (ingredient: string) => void;
  maxIngredients?: number;
}

// Generate consistent scattered positions based on ingredient names (deterministic)
function generateScatteredPositions(ingredients: string[]) {
  const positions: Array<{ x: number; y: number }> = [];
  
  ingredients.forEach((ingredient, index) => {
    // Use ingredient name as seed for consistent positioning
    let hash = 0;
    for (let i = 0; i < ingredient.length; i++) {
      hash = ((hash << 5) - hash + ingredient.charCodeAt(i)) & 0xffffffff;
    }
    
    // Use index to add more variation
    const seed1 = Math.abs(hash + index * 1234567) / 0xffffffff;
    const seed2 = Math.abs(hash + index * 7654321) / 0xffffffff;
    
    const position = {
      x: seed1 * 80 + 10, // 10% to 90% of container width
      y: seed2 * 80 + 10  // 10% to 90% of container height
    };
    
    positions.push(position);
  });
  
  return positions;
}

export default function IngredientSelector({
  ingredients,
  selectedIngredients,
  onToggleIngredient,
  maxIngredients = 6
}: IngredientSelectorProps) {
  const [hoveredIngredient, setHoveredIngredient] = useState<string | null>(null);
  
  // Generate consistent positions based on ingredient names (for stability across renders)
  const positions = generateScatteredPositions(ingredients);
  
  return (
    <section className="border border-border bg-accent/30 p-8 mb-12">
      <h2 className="font-serif text-2xl font-semibold text-foreground mb-6">
        Select Ingredients ({selectedIngredients.length}/{maxIngredients})
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
        {ingredients.map(ingredient => {
          const imageSrc = getIngredientImage(ingredient);
          const isSelected = selectedIngredients.includes(ingredient);
          const isDisabled = !isSelected && selectedIngredients.length >= maxIngredients;
          
          return (
            <button
              key={ingredient}
              onClick={() => onToggleIngredient(ingredient)}
              disabled={isDisabled}
              className={`relative p-3 border-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                isSelected
                  ? 'border-yellow-400 bg-yellow-50 shadow-lg shadow-yellow-200'
                  : 'border-border bg-background hover:bg-accent hover:border-accent-foreground'
              } ${isDisabled ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''}`}
            >
              {imageSrc ? (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 mb-2 relative overflow-hidden rounded-md">
                    <img
                      src={imageSrc}
                      alt={ingredient}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to text if image fails to load
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement?.parentElement;
                        if (parent) {
                          parent.innerHTML = `<span class="text-sm font-medium text-center">${ingredient}</span>`;
                        }
                      }}
                    />
                  </div>
                  <span className="text-xs font-medium text-center leading-tight">
                    {ingredient}
                  </span>
                </div>
              ) : (
                <span className="text-sm font-medium text-center block">
                  {ingredient}
                </span>
              )}
              
              {isSelected && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-xs text-yellow-900">✓</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
      
      {selectedIngredients.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-foreground mb-4">Selected:</h3>
          <div className="flex flex-wrap gap-3">
            {selectedIngredients.map(ingredient => (
              <span
                key={ingredient}
                className="px-4 py-2 bg-foreground text-background text-sm font-medium"
              >
                {ingredient}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}