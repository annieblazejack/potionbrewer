'use client';

import { useState, useCallback } from 'react';
import IngredientPage from './IngredientPage';

interface IngredientCarouselProps {
  ingredients: string[];
  selectedIngredients: string[];
  onToggleIngredient: (ingredient: string) => void;
  maxIngredients?: number;
  pageCount?: number;
}

export default function IngredientCarousel({
  ingredients,
  selectedIngredients,
  onToggleIngredient,
  maxIngredients = 6,
  pageCount = 3
}: IngredientCarouselProps) {
  const [currentPage, setCurrentPage] = useState(0);

  // Distribute ingredients across pages
  const distributeIngredients = useCallback((items: string[], pages: number) => {
    const itemsPerPage = Math.ceil(items.length / pages);
    return Array.from({ length: pages }, (_, pageIndex) => 
      items.slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage)
    ).filter(page => page.length > 0); // Remove empty pages
  }, []);

  const ingredientPages = distributeIngredients(ingredients, pageCount);
  const actualPageCount = ingredientPages.length;

  const goToPage = (pageIndex: number) => {
    setCurrentPage(Math.max(0, Math.min(pageIndex, actualPageCount - 1)));
  };

  const nextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, actualPageCount - 1));
  };

  const prevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 0));
  };

  return (
    <section className="border border-border bg-accent/30 p-8 mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-2xl font-semibold text-foreground">
          Select Ingredients ({selectedIngredients.length}/{maxIngredients})
        </h2>
        
        {/* Page Indicator */}
        <div className="flex items-center gap-2 text-sm text-foreground/70">
          <span>Page {currentPage + 1} of {actualPageCount}</span>
        </div>
      </div>

      {/* Carousel Viewport */}
      <div className="relative overflow-hidden rounded-2xl bg-black border border-gray-800 mb-6">
        {/* Carousel Track */}
        <div 
          className="flex transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${currentPage * 100}%)`,
            width: `${actualPageCount * 100}%`
          }}
        >
          {ingredientPages.map((pageIngredients, pageIndex) => (
            <div key={pageIndex} className="w-full flex-shrink-0">
              <IngredientPage
                ingredients={pageIngredients}
                selectedIngredients={selectedIngredients}
                onToggleIngredient={onToggleIngredient}
                maxIngredients={maxIngredients}
              />
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevPage}
          disabled={currentPage === 0}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-gray-900/80 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-full flex items-center justify-center text-white transition-colors"
        >
          ←
        </button>
        <button
          onClick={nextPage}
          disabled={currentPage === actualPageCount - 1}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-gray-900/80 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-full flex items-center justify-center text-white transition-colors"
        >
          →
        </button>
      </div>

      {/* Page Dots Navigation */}
      <div className="flex justify-center gap-2 mb-6">
        {Array.from({ length: actualPageCount }).map((_, pageIndex) => (
          <button
            key={pageIndex}
            onClick={() => goToPage(pageIndex)}
            className={`w-3 h-3 rounded-full transition-colors ${
              currentPage === pageIndex 
                ? 'bg-foreground' 
                : 'bg-foreground/30 hover:bg-foreground/50'
            }`}
          />
        ))}
      </div>

      {/* Selected Ingredients Display */}
      {selectedIngredients.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-foreground mb-4">Selected:</h3>
          <div className="flex flex-wrap gap-3">
            {selectedIngredients.map(ingredient => (
              <span
                key={ingredient}
                className="px-4 py-2 bg-foreground text-background text-sm font-medium rounded"
              >
                {ingredient}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}