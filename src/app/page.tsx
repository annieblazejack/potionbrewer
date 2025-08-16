'use client';

import { useState } from 'react';

interface PotionRecipe {
  name: string;
  ingredients: string[];
  instructions: string[];
  effects: string[];
  sideEffects: string[];
  warnings: string[];
  rawResponse?: string;
}

const INGREDIENTS = [
  'Dragon Scale', 'Phoenix Feather', 'Moonstone Dust', 'Unicorn Hair',
  'Troll Blood', 'Fairy Wings', 'Vampire Fang', 'Mermaid Tears',
  'Griffin Claw', 'Basilisk Venom', 'Angel Dust', 'Demon Horn',
  'Witch Hazel', 'Mandrake Root', 'Eye of Newt', 'Bat Wing'
];

export default function Home() {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [recipe, setRecipe] = useState<PotionRecipe | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleIngredient = (ingredient: string) => {
    setSelectedIngredients(prev => {
      if (prev.includes(ingredient)) {
        return prev.filter(item => item !== ingredient);
      } else if (prev.length < 6) {
        return [...prev, ingredient];
      }
      return prev;
    });
  };

  const generatePrompt = () => {
    if (selectedIngredients.length === 0) return '';
    
    return `Create a magical potion recipe using these ingredients: ${selectedIngredients.join(', ')}.

Please provide:
- Potion Name
- Ingredients list with quantities
- Step-by-step brewing instructions
- Magical effects the potion provides
- Potential side effects
- Important warnings for the brewer

Make it creative and fantastical!`;
  };

  const brewPotion = async () => {
    if (selectedIngredients.length < 2) return;

    setIsLoading(true);
    setError(null);
    setRecipe(null);

    try {
      const response = await fetch('/api/brew', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients: selectedIngredients }),
      });

      if (!response.ok) {
        throw new Error('Failed to brew potion');
      }

      const potionRecipe = await response.json();
      setRecipe(potionRecipe);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-white mb-8">
          🧙‍♀️ Potion Brewer
        </h1>
        
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Select Ingredients ({selectedIngredients.length}/6)
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {INGREDIENTS.map(ingredient => (
              <button
                key={ingredient}
                onClick={() => toggleIngredient(ingredient)}
                disabled={!selectedIngredients.includes(ingredient) && selectedIngredients.length >= 6}
                className={`p-3 rounded-lg border-2 transition-all ${
                  selectedIngredients.includes(ingredient)
                    ? 'bg-purple-600 border-purple-400 text-white'
                    : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {ingredient}
              </button>
            ))}
          </div>
          
          {selectedIngredients.length > 0 && (
            <div className="mb-4">
              <h3 className="text-lg font-medium text-white mb-2">Selected:</h3>
              <div className="flex flex-wrap gap-2">
                {selectedIngredients.map(ingredient => (
                  <span
                    key={ingredient}
                    className="px-3 py-1 bg-purple-600 text-white rounded-full text-sm"
                  >
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {selectedIngredients.length >= 2 && (
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 mb-8">
            <button
              onClick={brewPotion}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-lg text-xl transition-all transform hover:scale-105"
            >
              {isLoading ? '🧙‍♀️ Brewing...' : '🔮 BREW POTION'}
            </button>
          </div>
        )}

        {error && (
          <div className="bg-red-900/50 backdrop-blur-md rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-red-300 mb-2">
              ⚠️ Brewing Failed
            </h3>
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {recipe && (
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
            <h2 className="text-3xl font-bold text-center text-yellow-300 mb-6">
              ✨ {recipe.name} ✨
            </h2>
            
            <div className="grid gap-6">
              <div>
                <h3 className="text-xl font-semibold text-purple-300 mb-3">📋 Ingredients</h3>
                <ul className="list-disc list-inside text-white space-y-1">
                  {recipe.ingredients.map((ingredient, i) => (
                    <li key={i}>{ingredient}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-blue-300 mb-3">🧪 Instructions</h3>
                <ol className="list-decimal list-inside text-white space-y-2">
                  {recipe.instructions.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-green-300 mb-3">✨ Effects</h3>
                <ul className="list-disc list-inside text-white space-y-1">
                  {recipe.effects.map((effect, i) => (
                    <li key={i}>{effect}</li>
                  ))}
                </ul>
              </div>

              {recipe.sideEffects.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-orange-300 mb-3">⚡ Side Effects</h3>
                  <ul className="list-disc list-inside text-white space-y-1">
                    {recipe.sideEffects.map((effect, i) => (
                      <li key={i}>{effect}</li>
                    ))}
                  </ul>
                </div>
              )}

              {recipe.warnings.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-red-300 mb-3">⚠️ Warnings</h3>
                  <ul className="list-disc list-inside text-white space-y-1">
                    {recipe.warnings.map((warning, i) => (
                      <li key={i}>{warning}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
