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
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-8">
        {ingredients.map(ingredient => {
          const imageSrc = getIngredientImage(ingredient);
          const isSelected = selectedIngredients.includes(ingredient);
          const isDisabled = !isSelected && selectedIngredients.length >= maxIngredients;
          const isHovered = hoveredIngredient === ingredient;
          
          return (
            <div key={ingredient} className="relative">
              <button
                onClick={() => onToggleIngredient(ingredient)}
                disabled={isDisabled}
                onMouseEnter={() => setHoveredIngredient(ingredient)}
                onMouseLeave={() => setHoveredIngredient(null)}
                className={`relative w-full p-4 rounded-xl transition-all duration-300 transform group ${
                  isSelected
                    ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-300 shadow-lg shadow-yellow-200/50 scale-105'
                    : 'bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 shadow-md hover:shadow-lg hover:scale-105 hover:border-gray-300'
                } ${isDisabled ? 'opacity-50 cursor-not-allowed hover:scale-100 hover:shadow-md' : 'cursor-pointer'}`}
              >
                {imageSrc ? (
                  <div className="flex flex-col items-center">
                    {/* Image Container */}
                    <div className={`relative mb-3 overflow-hidden transition-all duration-300 ${
                      isSelected ? 'w-20 h-20' : 'w-18 h-18 group-hover:w-20 group-hover:h-20'
                    }`}>
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent rounded-lg"></div>
                      <img
                        src={imageSrc}
                        alt={ingredient}
                        className="w-full h-full object-cover rounded-lg transition-all duration-300"
                        style={{
                          filter: isSelected 
                            ? 'brightness(1.1) contrast(1.1) saturate(1.2)' 
                            : isHovered 
                              ? 'brightness(1.05) contrast(1.05)'
                              : 'brightness(0.95)'
                        }}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const parent = e.currentTarget.parentElement?.parentElement;
                          if (parent) {
                            parent.innerHTML = `<div class="w-18 h-18 bg-gray-200 rounded-lg flex items-center justify-center text-xs font-bold text-gray-600">${ingredient.substring(0, 3)}</div>`;
                          }
                        }}
                      />
                      {/* Subtle inner shadow for depth */}
                      <div className="absolute inset-0 shadow-inner rounded-lg pointer-events-none"></div>
                    </div>
                    
                    {/* Ingredient Name */}
                    <span className={`text-xs font-medium text-center leading-tight transition-all duration-300 ${
                      isSelected ? 'text-yellow-800' : 'text-gray-700 group-hover:text-gray-900'
                    }`}>
                      {ingredient}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-24">
                    <span className="text-sm font-medium text-center text-gray-700">
                      {ingredient}
                    </span>
                  </div>
                )}
                
                {/* Selection Badge */}
                {isSelected && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg transform rotate-12">
                    <span className="text-xs text-yellow-900 font-bold">✓</span>
                  </div>
                )}
                
                {/* Hover glow effect */}
                {isHovered && !isSelected && (
                  <div className="absolute inset-0 bg-blue-400/10 rounded-xl pointer-events-none"></div>
                )}
              </button>

              {/* Detailed Hover Tooltip */}
              {isHovered && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 z-50 pointer-events-none">
                  <div className="bg-gray-900/95 backdrop-blur-sm text-white text-sm rounded-lg p-4 shadow-2xl max-w-64 min-w-48">
                    {/* Ingredient Name */}
                    <div className="font-semibold text-base mb-2 text-center">{ingredient}</div>
                    
                    {/* Details */}
                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-blue-300">Type:</span>
                        <span className="text-gray-300">Natural Material</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-300">Rarity:</span>
                        <span className="text-gray-300">
                          {ingredient.length > 10 ? 'Uncommon' : ingredient.length > 6 ? 'Common' : 'Rare'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-purple-300">Effect:</span>
                        <span className="text-gray-300">
                          {isSelected ? 'Selected for brewing' : 'Click to add to recipe'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Tooltip Arrow */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                      <div className="w-3 h-3 bg-gray-900/95 rotate-45"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
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