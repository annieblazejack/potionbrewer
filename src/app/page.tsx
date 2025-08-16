'use client';

import { useState } from 'react';

const INGREDIENTS = [
  'Dragon Scale', 'Phoenix Feather', 'Moonstone Dust', 'Unicorn Hair',
  'Troll Blood', 'Fairy Wings', 'Vampire Fang', 'Mermaid Tears',
  'Griffin Claw', 'Basilisk Venom', 'Angel Dust', 'Demon Horn',
  'Witch Hazel', 'Mandrake Root', 'Eye of Newt', 'Bat Wing'
];

export default function Home() {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);

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

        {selectedIngredients.length > 0 && (
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Generated Prompt
            </h2>
            <div className="bg-black/20 rounded-lg p-4">
              <pre className="text-green-300 whitespace-pre-wrap font-mono text-sm">
                {generatePrompt()}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
