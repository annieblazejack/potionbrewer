'use client';

import { useState, useEffect } from 'react';
import ScatteredIngredientSelector from '@/components/ScatteredIngredientSelector';
import IngredientHUD from '@/components/IngredientHUD';
import LoadingIndicator from '@/components/LoadingIndicator';
import ErrorDisplay from '@/components/ErrorDisplay';
import PotionRecipe from '@/components/PotionRecipe';
import OnboardingPopup from '@/components/OnboardingPopup';
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
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('hasSeenOnboarding', 'true');
  };

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
      <OnboardingPopup isVisible={showOnboarding} onClose={handleCloseOnboarding} />
      
      {!isLoading && !recipe && (
        <IngredientHUD
          ingredients={images}
          selectedIngredients={selectedIngredients}
          onToggleIngredient={toggleIngredient}
          onBrewPotion={brewPotion}
          isLoading={isLoading}
        />
      )}

      <div className="pt-24 px-6 py-12">
        {!isLoading && !recipe && (
          <ScatteredIngredientSelector
            ingredients={images}
            selectedIngredients={selectedIngredients}
            onToggleIngredient={toggleIngredient}
          />
        )}

        <LoadingIndicator isVisible={isLoading} />

        <ErrorDisplay error={error} />

        <PotionRecipe recipe={recipe} />
      </div>
    </div>
  );
}
