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
  const [isLoadingRecipe, setIsLoadingRecipe] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  // Check for recipe query parameter on page load
  useEffect(() => {
    const checkForSharedRecipe = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const recipeId = urlParams.get("recipe");

      if (recipeId) {
        setIsLoadingRecipe(true);
        setError(null);

        try {
          const response = await fetch(`/api/recipes/fetch?id=${recipeId}`);

          if (!response.ok) {
            if (response.status === 404) {
              setError(
                "Recipe not found. It may have been deleted or the link is invalid."
              );
            } else {
              throw new Error("Failed to fetch recipe");
            }
            return;
          }

          const data = await response.json();
          setRecipe(data.recipe);
          setSelectedIngredients(data.ingredients);

          // Clean up the URL
          window.history.replaceState({}, "", window.location.pathname);
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong while loading the recipe"
          );
        } finally {
          setIsLoadingRecipe(false);
        }
      }
    };

    checkForSharedRecipe();
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
    <div className="bg-background flex flex-col h-screen-custom overflow-hidden">
      <OnboardingPopup
        isVisible={showOnboarding}
        onClose={handleCloseOnboarding}
      />

      {!recipe && !isLoadingRecipe && (
        <>
          <IngredientHUD
            ingredients={images}
            selectedIngredients={selectedIngredients}
            onToggleIngredient={toggleIngredient}
          />

          <div className="flex-grow overflow-hidden">
            <ScatteredIngredientSelector
              ingredients={images}
              selectedIngredients={selectedIngredients}
              onToggleIngredient={toggleIngredient}
            />
          </div>

          <div className="p-4 max-w-md mx-auto" id="brew-button-container">
            <BrewButton
              streaming={streaming}
              onClick={brewPotion}
              selectedCount={selectedIngredients.length}
            />
          </div>
        </>
      )}

      {/* Recipe Content */}
      {recipe && (
        <div className="flex-grow overflow-auto">
          <PotionRecipe
            recipe={recipe}
            ingredients={selectedIngredients}
            streaming={streaming}
            onBrewAgain={
              streaming
                ? undefined
                : () => {
                    setStreaming(false);
                    setRecipe("");
                    setSelectedIngredients([]);
                  }
            }
          />
        </div>
      )}

      {/* Loading state for shared recipes */}
      {isLoadingRecipe && (
        <div className="flex-grow flex justify-center items-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-gray-300 font-mono">Loading shared recipe...</p>
          </div>
        </div>
      )}

      <ErrorDisplay error={error} />
    </div>
  );
}
