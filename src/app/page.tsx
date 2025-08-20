'use client';

import { useState } from 'react';
import IngredientSelector from '@/components/IngredientSelector';
import BrewButton from '@/components/BrewButton';
import LoadingIndicator from '@/components/LoadingIndicator';
import ErrorDisplay from '@/components/ErrorDisplay';
import PotionRecipe from '@/components/PotionRecipe';
import { images } from '@/lib/image-manifest';

interface PotionRecipeData {
  name: string;
  ingredients: string[];
  instructions: string[];
  effects: string[];
  sideEffects: string[];
  warnings: string[];
  rawResponse?: string;
}

export default function Home() {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [recipe, setRecipe] = useState<PotionRecipeData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleIngredient = (ingredient: string) => {
    setSelectedIngredients((prev) => {
      if (prev.includes(ingredient)) {
        return prev.filter((item) => item !== ingredient);
      } else if (prev.length < 6) {
        return [...prev, ingredient];
      }
      return prev;
    });
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
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <header className="mb-16 text-center">
          <h1 className="font-serif text-5xl font-semibold text-foreground mb-4">
            Potion Brewer
          </h1>
        </header>

        {!isLoading && !recipe && (
          <>
            <IngredientSelector
              ingredients={images}
              selectedIngredients={selectedIngredients}
              onToggleIngredient={toggleIngredient}
            />

            <BrewButton
              onClick={brewPotion}
              isLoading={isLoading}
              selectedCount={selectedIngredients.length}
            />
          </>
        )}

        <LoadingIndicator isVisible={isLoading} />

        <ErrorDisplay error={error} />

        <PotionRecipe recipe={recipe} />
      </div>
    </div>
  );
}
