import { useState } from 'react';
import IngredientSelector from './IngredientSelector';
import { type LayoutStrategyName } from '@/lib/layoutStrategies';

interface LayoutStrategyDemoProps {
  ingredients: string[];
  selectedIngredients: string[];
  onToggleIngredient: (ingredient: string) => void;
  maxIngredients?: number;
}

export default function LayoutStrategyDemo({
  ingredients,
  selectedIngredients,
  onToggleIngredient,
  maxIngredients = 6
}: LayoutStrategyDemoProps) {
  const [currentStrategy, setCurrentStrategy] = useState<LayoutStrategyName>('potpack');

  return (
    <div>
      {/* Strategy Selector */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setCurrentStrategy('potpack')}
          className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
            currentStrategy === 'potpack'
              ? 'bg-foreground text-background'
              : 'bg-accent/30 text-foreground/70 hover:bg-accent/50'
          }`}
        >
          Potpack Bin-Packing
        </button>
        <button
          onClick={() => setCurrentStrategy('masonry')}
          className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
            currentStrategy === 'masonry'
              ? 'bg-foreground text-background'
              : 'bg-accent/30 text-foreground/70 hover:bg-accent/50'
          }`}
        >
          Masonry Layout
        </button>
      </div>

      {/* Ingredient Selector with chosen strategy */}
      <IngredientSelector
        ingredients={ingredients}
        selectedIngredients={selectedIngredients}
        onToggleIngredient={onToggleIngredient}
        maxIngredients={maxIngredients}
        layoutStrategy={currentStrategy}
      />
    </div>
  );
}