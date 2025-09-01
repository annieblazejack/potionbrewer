'use client';

import { useState, useEffect } from 'react';
import ScatteredIngredientSelector from '@/components/ScatteredIngredientSelector';
import IngredientHUD from '@/components/IngredientHUD';
import ErrorDisplay from '@/components/ErrorDisplay';
import PotionRecipe from '@/components/PotionRecipe';
import OnboardingPopup from '@/components/OnboardingPopup';
import InstructionTooltip from '@/components/InstructionTooltip';
import { images } from '@/lib/image-manifest';

export default function Home() {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [recipe, setRecipe] = useState<string>('');

  const [error, setError] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  // // Detect if device is mobile
  // useEffect(() => {
  //   const checkIsMobile = () => {
  //     setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
  //   };
    
  //   checkIsMobile();
  //   window.addEventListener('resize', checkIsMobile);
  //   return () => window.removeEventListener('resize', checkIsMobile);
  // }, []);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('hasSeenOnboarding', 'true');
    
    // Show instructions tooltip after onboarding closes
    setTimeout(() => {
      setShowInstructions(true);
    }, 500);
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

    setError(null);
    setRecipe('');

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

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
      let accumulatedRecipe = '';

              while (true) {
          const { done, value } = await reader.read();
        
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        accumulatedRecipe += chunk;
        setRecipe(accumulatedRecipe);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <OnboardingPopup isVisible={showOnboarding} onClose={handleCloseOnboarding} />
      
      <InstructionTooltip 
        isVisible={showInstructions} 
        onDismiss={() => setShowInstructions(false)}
        isMobile={isMobile}
      />
      
      { !recipe && (
        <IngredientHUD
          ingredients={images}
          selectedIngredients={selectedIngredients}
          onToggleIngredient={toggleIngredient}
          onBrewPotion={brewPotion}
        />
      )}

      <div className="pt-24 px-6 py-12">
        { !recipe && (
          <ScatteredIngredientSelector
            ingredients={images}
            selectedIngredients={selectedIngredients}
            onToggleIngredient={toggleIngredient}
          />
        )}

        <ErrorDisplay error={error} />

        <PotionRecipe recipe={recipe} />
      </div>
    </div>
  );
}
