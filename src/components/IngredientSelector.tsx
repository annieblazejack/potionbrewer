import { ImageManifest } from '@/lib/image-manifest';

interface IngredientSelectorProps {
  ingredients: ImageManifest[];
  selectedIngredients: string[];
  onToggleIngredient: (ingredient: string) => void;
  maxIngredients?: number;
}

export default function IngredientSelector({
  ingredients,
  selectedIngredients,
  onToggleIngredient,
  maxIngredients = 6
}: IngredientSelectorProps) {
  return (
    <section className="border border-border bg-accent/30 p-8 mb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="font-serif text-2xl font-semibold text-foreground mb-4 sm:mb-0">
          Select Ingredients ({selectedIngredients.length}/{maxIngredients})
        </h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {ingredients.map(ingredient => (
          <button
            key={ingredient.name}
            onClick={() => onToggleIngredient(ingredient.name)}
            disabled={!selectedIngredients.includes(ingredient.name) && selectedIngredients.length >= maxIngredients}
            className={`p-3 border transition-all font-medium flex flex-col items-center gap-2 min-h-[100px] justify-center ${
              selectedIngredients.includes(ingredient.name)
                ? 'bg-foreground text-background border-foreground'
                : 'bg-background text-foreground border-border hover:bg-accent'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <img
              src={`/${ingredient.thumbnails.large}`}
              alt={ingredient.name}
              className={`max-w-full max-h-16 object-contain rounded ${
                selectedIngredients.includes(ingredient.name) ? 'opacity-90' : 'opacity-70'
              }`}
            />
            <span className="text-xs text-center leading-tight">{ingredient.name}</span>
          </button>
        ))}
      </div>
      
      {selectedIngredients.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-foreground mb-4">Selected:</h3>
          <div className="flex flex-wrap gap-3">
            {selectedIngredients.map(ingredientName => {
              const ingredient = ingredients.find(ing => ing.name === ingredientName);
              return (
                <span
                  key={ingredientName}
                  className="px-4 py-2 bg-foreground text-background text-sm font-medium flex items-center gap-2"
                >
                  {ingredient && (
                    <img
                      src={`/${ingredient.thumbnails.large}`}
                      alt={ingredient.name}
                      className="max-w-6 max-h-6 object-contain rounded"
                    />
                  )}
                  {ingredientName}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}