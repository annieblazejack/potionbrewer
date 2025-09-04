"use client";

import { useState, useEffect } from "react";
import ScatteredIngredientSelector from "@/components/ScatteredIngredientSelector";
import IngredientHUD from "@/components/IngredientHUD";
import ErrorDisplay from "@/components/ErrorDisplay";
import PotionRecipe from "@/components/PotionRecipe";
import OnboardingPopup from "@/components/OnboardingPopup";
import { images } from "@/lib/image-manifest";
import BrewButton from "@/components/BrewButton";

export default function Home() {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [recipe, setRecipe] = useState<string>("");

  const [error, setError] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem("hasSeenOnboarding", "true");
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

  const [streaming, setStreaming] = useState(false);

  const brewPotion = async () => {
    if (selectedIngredients.length < 2) return;

    setError(null);
    setRecipe("");
    setStreaming(true);

    try {
      const response = await fetch("/api/brew", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ingredients: selectedIngredients }),
      });

      if (!response.ok) {
        throw new Error("Failed to brew potion");
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No response body");
      }

      const decoder = new TextDecoder();
      let accumulatedRecipe = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedRecipe += chunk;
        setRecipe(accumulatedRecipe);
      }

      setStreaming(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <OnboardingPopup
        isVisible={showOnboarding}
        onClose={handleCloseOnboarding}
      />

      {!recipe && (
        <IngredientHUD
          ingredients={images}
          selectedIngredients={selectedIngredients}
          onToggleIngredient={toggleIngredient}
        />
      )}

      {/* Footer with Brew Button */}
      {!recipe && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-background/98 via-background/95 to-background/90 backdrop-blur-md border-t border-gray-600/30 shadow-2xl">
          <div className="mx-auto px-6 py-6">
            <div className="flex justify-center">
              <div className="w-full max-w-md">
                <BrewButton
                  onClick={brewPotion}
                  selectedCount={selectedIngredients.length}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="pt-24 py-12 pb-32">
        {!recipe && (
          <ScatteredIngredientSelector
            ingredients={images}
            selectedIngredients={selectedIngredients}
            onToggleIngredient={toggleIngredient}
          />
        )}

        <ErrorDisplay error={error} />

        <PotionRecipe recipe={recipe} onBrewAgain={streaming ? undefined : () => {
          setRecipe("");
          setSelectedIngredients([]);
        }} />
      </div>
    </div>
  );
}
