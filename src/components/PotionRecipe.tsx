interface PotionRecipeData {
  name: string;
  effects: string[];
  ingredients: string[];
  instructions: string[];
  sideEffects: string[];
  warnings: string[];
  rawResponse?: string;
}

interface PotionRecipeProps {
  recipe: PotionRecipeData | null;
}

export default function PotionRecipe({ recipe }: PotionRecipeProps) {
  if (!recipe) return null;

  return (
    <article className="p-8 potion-recipe-reveal">
      <header className="mb-12 text-center">
        <h2 className="font-serif text-4xl font-semibold text-foreground font-caudex-italic">
          {recipe.name}
        </h2>
      </header>

      <div className="grid gap-12">
        <section>
          <h3 className="font-serif text-xl font-semibold text-foreground mb-6">
            Ingredients
          </h3>
          <ul className="space-y-2">
            {recipe.ingredients.map((ingredient, i) => (
              <li
                key={i}
                className="font-serif text-foreground/80 pl-4"
              >
                {ingredient}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="font-serif text-xl font-semibold text-foreground mb-6">
            Instructions
          </h3>
          <ol className="space-y-3">
            {recipe.instructions.map((step, i) => (
              <li key={i} className="font-serif text-foreground/80 pl-6 relative">
                <span className="absolute left-0 font-medium text-foreground">
                  {i + 1}.
                </span>
                {step}
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h3 className="font-serif text-xl font-semibold text-foreground mb-6">
            Effects
          </h3>
          <ul className="space-y-2">
            {recipe.effects.map((effect, i) => (
              <li
                key={i}
                className="font-serif text-foreground/80 pl-4"
              >
                {effect}
              </li>
            ))}
          </ul>
        </section>

        {recipe.sideEffects.length > 0 && (
          <section>
            <h3 className="font-serif text-xl font-semibold text-foreground mb-6">
              Side Effects
            </h3>
            <ul className="space-y-2">
              {recipe.sideEffects.map((effect, i) => (
                <li
                  key={i}
                  className="font-serif text-foreground/80 pl-4"
                >
                  {effect}
              </li>
              ))}
            </ul>
          </section>
        )}

        {recipe.warnings.length > 0 && (
          <section>
            <h3 className="font-serif text-xl font-semibold text-foreground-700 mb-6">
              Warnings
            </h3>
            <ul className="space-y-2">
              {recipe.warnings.map((warning, i) => (
                <li
                  key={i}
                  className="font-serif text-foreground-600 pl-4"
                >
                  {warning}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </article>
  );
}
