import { ImageManifest } from '@/lib/image-manifest';

interface IngredientHUDProps {
  ingredients: ImageManifest[];
  selectedIngredients: string[];
  onToggleIngredient: (ingredient: string) => void;
  maxIngredients?: number;
}

export default function IngredientHUD({
  ingredients,
  selectedIngredients,
  onToggleIngredient,
  maxIngredients = 6
}: IngredientHUDProps) {
  return (
    <div className="w-full mx-auto px-6 py-6 flex flex-col items-center justify-center gap-6 overflow-y-hidden overflow-x-auto" data-hud>
      {/* Centered Selected Ingredients or Choose Ingredients Text */}
      {selectedIngredients.length > 0 ? (
        <div className="flex gap-3 justify-center whitespace-nowrap w-full">
          {selectedIngredients.map(ingredientName => {
            return (
              <span
                key={ingredientName}
                className="px-4 py-2 bg-gray-1100 text-gray-200 text-sm font-medium flex items-center gap-2 rounded-lg hover:bg-gray-700 transition-all duration-300 cursor-pointer border border-gray-600/30 hover:border-gray-500/50 hover:scale-105 transform flex-shrink-0"
                onClick={() => onToggleIngredient(ingredientName)}
              >

                {ingredientName}
                <span className="text-gray-400 hover:text-red-400 transition-colors duration-200 text-lg leading-none">×</span>
              </span>
            );
          })}
        </div>
      ) : (
        <div className="text-gray-400 text-lg font-medium">
          Choose Your Ingredients
        </div>
      )}
    </div>
  );
}
