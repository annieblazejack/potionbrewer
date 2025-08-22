'use client';

import { useState } from 'react';
import { generateViewportPartitionLayout } from '@/lib/ingredientImages';
import IngredientItem from './IngredientItem';

interface IngredientPageProps {
  ingredients: string[];
  selectedIngredients: string[];
  onToggleIngredient: (ingredient: string) => void;
  maxIngredients: number;
}

export default function IngredientPage({
  ingredients,
  selectedIngredients,
  onToggleIngredient,
  maxIngredients
}: IngredientPageProps) {
  const [hoveredIngredient, setHoveredIngredient] = useState<string | null>(null);
  
  // Generate viewport-partitioning layout for this page's ingredients
  const layoutItems = generateViewportPartitionLayout(ingredients, 100, 100);
  
  return (
    <div className="relative p-4" style={{ minHeight: '500px' }}>
      {layoutItems.map(item => {
        const { ingredient, x, y, width, height } = item;
        const isSelected = selectedIngredients.includes(ingredient);
        const isDisabled = !isSelected && selectedIngredients.length >= maxIngredients;
        const isHovered = hoveredIngredient === ingredient;
        
        return (
          <div 
            key={ingredient} 
            className="absolute transition-all duration-300"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: `${width}%`,
              height: `${height}%`
            }}
          >
            <IngredientItem
              ingredient={ingredient}
              isSelected={isSelected}
              isDisabled={isDisabled}
              isHovered={isHovered}
              onToggle={onToggleIngredient}
              onMouseEnter={() => setHoveredIngredient(ingredient)}
              onMouseLeave={() => setHoveredIngredient(null)}
              position={{ x, y }}
            />
          </div>
        );
      })}
    </div>
  );
}