import { ImageManifest } from '@/lib/image-manifest';
import BrewButton from './BrewButton';

interface IngredientHUDProps {
  ingredients: ImageManifest[];
  selectedIngredients: string[];
  onToggleIngredient: (ingredient: string) => void;
  onBrewPotion: () => void;
  maxIngredients?: number;
}

export default function IngredientHUD({
  ingredients,
  selectedIngredients,
  onToggleIngredient,
  onBrewPotion,
  maxIngredients = 6
}: IngredientHUDProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50" data-hud>
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Left side - Header and Instructions */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="text-center sm:text-left">
              <h2 className="font-serif text-xl font-medium text-foreground mb-1">
                Select your ingredients ({selectedIngredients.length}/{maxIngredients})
              </h2>
            </div>
          </div>

          {/* Right side - Selected Ingredients and Brew Button */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Selected Ingredients */}

            {selectedIngredients.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
                {selectedIngredients.map(ingredientName => {
                  return (
                    <span
                      key={ingredientName}
                      className="px-3 py-2 bg-gray-1100 text-gray-200 text-sm font-medium flex items-center gap-2 rounded-lg hover:bg-gray-700 transition-all duration-300 cursor-pointer border border-gray-600/30 hover:border-gray-500/50"
                      onClick={() => onToggleIngredient(ingredientName)}
                    >
                      {ingredientName}
                    </span>
                  );
                })}
              </div>
            )}

            {/* Brew Button */}
            <div className="flex-shrink-0">
              <BrewButton
                onClick={onBrewPotion}
                selectedCount={selectedIngredients.length}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
