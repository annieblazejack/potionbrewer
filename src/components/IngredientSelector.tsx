interface IngredientSelectorProps {
  ingredients: string[];
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
      <h2 className="font-serif text-2xl font-semibold text-foreground mb-6">
        Select Ingredients ({selectedIngredients.length}/{maxIngredients})
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {ingredients.map(ingredient => (
          <button
            key={ingredient}
            onClick={() => onToggleIngredient(ingredient)}
            disabled={!selectedIngredients.includes(ingredient) && selectedIngredients.length >= maxIngredients}
            className={`p-4 border transition-all font-medium ${
              selectedIngredients.includes(ingredient)
                ? 'bg-foreground text-background border-foreground'
                : 'bg-background text-foreground border-border hover:bg-accent'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {ingredient}
          </button>
        ))}
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