import { useState, useRef, useEffect } from 'react';
import { getIngredientImage, hasIngredientImage } from '@/lib/ingredientImages';
import { layoutStrategies, type LayoutStrategyName } from '@/lib/layoutStrategies';

interface IngredientSelectorProps {
  ingredients: string[];
  selectedIngredients: string[];
  onToggleIngredient: (ingredient: string) => void;
  maxIngredients?: number;
  layoutStrategy?: LayoutStrategyName;
  onLayoutStrategyChange?: (strategy: LayoutStrategyName) => void;
}


export default function IngredientSelector({
  ingredients,
  selectedIngredients,
  onToggleIngredient,
  maxIngredients = 6,
  layoutStrategy = 'poisson',
  onLayoutStrategyChange
}: IngredientSelectorProps) {
  const [hoveredIngredient, setHoveredIngredient] = useState<string | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Generate layout using selected strategy
  const strategy = layoutStrategies[layoutStrategy];
  const layoutItems = strategy.generateLayout(ingredients, 300, 100);
  
  // Check scroll position to show/hide scroll indicators
  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };
  
  useEffect(() => {
    checkScrollPosition();
  }, [layoutItems]);
  
  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -300, behavior: 'smooth' });
  };
  
  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 300, behavior: 'smooth' });
  };
  
  return (
    <section className="border border-border bg-accent/30 p-8 mb-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-2xl font-semibold text-foreground">
          Select Ingredients ({selectedIngredients.length}/{maxIngredients})
        </h2>
        <div className="flex items-center gap-3">
          <label className="text-sm text-foreground/70">Layout:</label>
          <select
            value={layoutStrategy}
            onChange={(e) => onLayoutStrategyChange?.(e.target.value as LayoutStrategyName)}
            className="text-xs bg-accent/20 text-foreground/80 px-3 py-1 rounded border border-accent/40 focus:outline-none focus:ring-2 focus:ring-foreground/20"
          >
            <option value="poisson">Poisson Disc</option>
            <option value="potpack">Bin Packing</option>
            <option value="masonry">Masonry</option>
            <option value="circlepacking">Circle Packing</option>
          </select>
        </div>
      </div>
      <p className="text-sm text-foreground/60 mb-6">
        Scroll horizontally to explore all available ingredients
      </p>
      
      <div className="relative mb-8 bg-black rounded-2xl border border-gray-800 overflow-hidden" style={{ height: '400px' }}>
        {/* Left scroll button */}
        {canScrollLeft && (
          <button
            onClick={scrollLeft}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/80 backdrop-blur-sm rounded-full border border-gray-600 text-white hover:bg-black/90 hover:scale-110 transition-all duration-300 flex items-center justify-center"
          >
            <span className="text-lg">‹</span>
          </button>
        )}
        
        {/* Right scroll button */}
        {canScrollRight && (
          <button
            onClick={scrollRight}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/80 backdrop-blur-sm rounded-full border border-gray-600 text-white hover:bg-black/90 hover:scale-110 transition-all duration-300 flex items-center justify-center"
          >
            <span className="text-lg">›</span>
          </button>
        )}
        
        {/* Scrollable ingredient container */}
        <div 
          ref={scrollContainerRef}
          onScroll={checkScrollPosition}
          className="overflow-x-auto overflow-y-hidden h-full scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500"
          style={{ scrollbarWidth: 'thin' }}
        >
          {/* Inner container for ingredients - wider than viewport to enable horizontal scroll */}
          <div className="relative p-2 h-full" style={{ width: '300%', minWidth: '1800px' }}>
        {layoutItems.map(item => {
          const { ingredient, x, y, width, height } = item;
          
          // Convert layout coordinates to CSS percentages correctly
          // Layout uses 300 unit width, CSS uses 300% width
          const cssX = x; // x is already a percentage of the container
          const cssY = y; // y is already a percentage of the container
          const cssWidth = width; // width is already a percentage
          const cssHeight = height; // height is already a percentage
          const imageSrc = getIngredientImage(ingredient);
          const isSelected = selectedIngredients.includes(ingredient);
          const isDisabled = !isSelected && selectedIngredients.length >= maxIngredients;
          const isHovered = hoveredIngredient === ingredient;
          
          return (
            <div 
              key={ingredient} 
              className="absolute transition-all duration-300"
              style={{
                left: `${cssX}%`,
                top: `${cssY}%`,
                width: `${cssWidth}%`,
                height: `${cssHeight}%`
              }}
            >
              <button
                onClick={() => onToggleIngredient(ingredient)}
                disabled={isDisabled}
                onMouseEnter={() => setHoveredIngredient(ingredient)}
                onMouseLeave={() => setHoveredIngredient(null)}
                className={`w-full h-full relative rounded-md transition-all duration-300 transform group overflow-hidden ${
                  isSelected
                    ? 'ring-2 ring-yellow-400 ring-opacity-80 scale-105 brightness-110'
                    : 'hover:scale-105 hover:brightness-105 hover:ring-1 hover:ring-white hover:ring-opacity-30'
                } ${isDisabled ? 'opacity-50 cursor-not-allowed hover:scale-100 hover:brightness-100' : 'cursor-pointer'}`}
              >
                {imageSrc ? (
                  <div className="w-full h-full relative">
                    <img
                      src={imageSrc}
                      alt={ingredient}
                      className="w-full h-full object-contain transition-all duration-500"
                      style={{
                        filter: isSelected 
                          ? 'brightness(1.2) contrast(1.1) saturate(1.4) drop-shadow(0 0 20px rgba(255,215,0,0.6))' 
                          : isHovered 
                            ? 'brightness(1.1) contrast(1.05) saturate(1.2) drop-shadow(0 0 10px rgba(255,255,255,0.3))'
                            : 'brightness(1.0) contrast(1.0) saturate(1.0)'
                      }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          parent.innerHTML = `<div class="w-full h-full bg-gray-800 rounded-lg flex items-center justify-center text-xs font-bold text-gray-400 border border-gray-600">${ingredient.substring(0, 2)}</div>`;
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-800 rounded-lg border border-gray-600">
                    <span className="text-sm font-medium text-center text-gray-400 px-2">
                      {ingredient}
                    </span>
                  </div>
                )}
                
                {/* Selection Badge - golden glow */}
                {isSelected && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                    <span className="text-sm text-yellow-900 font-bold">✓</span>
                  </div>
                )}
              </button>

              {/* Floating Hover Details - more organic positioning */}
              {isHovered && (
                <div 
                  className="absolute z-50 pointer-events-none"
                  style={{
                    left: cssX < 50 ? '100%' : 'auto',
                    right: cssX >= 50 ? '100%' : 'auto',
                    top: cssY < 30 ? '100%' : 'auto',
                    bottom: cssY >= 30 ? '100%' : 'auto',
                    marginLeft: cssX < 50 ? '12px' : 'auto',
                    marginRight: cssX >= 50 ? '12px' : 'auto',
                    marginTop: cssY < 30 ? '12px' : 'auto',
                    marginBottom: cssY >= 30 ? '12px' : 'auto'
                  }}
                >
                  <div className="bg-gray-900/95 backdrop-blur-md text-white text-sm rounded-2xl p-4 shadow-2xl border border-gray-700/50 min-w-44 max-w-52">
                    {/* Ingredient Name */}
                    <div className="font-bold text-base mb-2 text-center text-white">{ingredient}</div>
                    
                    {/* Dark theme details */}
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-emerald-400 font-medium">Origin:</span>
                        <span className="text-gray-300">Natural</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-amber-400 font-medium">Potency:</span>
                        <span className="text-gray-300">
                          {ingredient.length > 10 ? 'Strong' : ingredient.length > 6 ? 'Moderate' : 'Intense'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-purple-400 font-medium">Status:</span>
                        <span className={isSelected ? 'text-yellow-400 font-medium' : 'text-gray-300'}>
                          {isSelected ? '✓ Selected' : 'Available'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
          </div>
        </div>
      </div>
      
      {selectedIngredients.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-foreground mb-4">Selected:</h3>
          <div className="flex flex-wrap gap-3">
            {selectedIngredients.map(ingredient => (
              <span
                key={ingredient}
                className="px-4 py-2 bg-foreground text-background text-sm font-medium"
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