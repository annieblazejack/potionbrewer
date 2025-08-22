'use client';

import { getIngredientImage } from '@/lib/ingredientImages';

interface IngredientItemProps {
  ingredient: string;
  isSelected: boolean;
  isDisabled: boolean;
  isHovered: boolean;
  onToggle: (ingredient: string) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  position: { x: number; y: number };
}

export default function IngredientItem({
  ingredient,
  isSelected,
  isDisabled,
  isHovered,
  onToggle,
  onMouseEnter,
  onMouseLeave,
  position
}: IngredientItemProps) {
  const imageSrc = getIngredientImage(ingredient);
  const { x, y } = position;

  return (
    <>
      <button
        onClick={() => onToggle(ingredient)}
        disabled={isDisabled}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={`w-full h-full relative rounded-lg transition-all duration-300 transform group overflow-hidden ${
          isSelected
            ? 'ring-4 ring-yellow-400 ring-opacity-60 scale-105 brightness-110'
            : 'hover:scale-105 hover:brightness-105 hover:ring-2 hover:ring-white hover:ring-opacity-40'
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

      {/* Floating Hover Details */}
      {isHovered && (
        <div 
          className="absolute z-50 pointer-events-none"
          style={{
            left: x < 50 ? '100%' : 'auto',
            right: x >= 50 ? '100%' : 'auto',
            top: y < 30 ? '100%' : 'auto',
            bottom: y >= 30 ? '100%' : 'auto',
            marginLeft: x < 50 ? '12px' : 'auto',
            marginRight: x >= 50 ? '12px' : 'auto',
            marginTop: y < 30 ? '12px' : 'auto',
            marginBottom: y >= 30 ? '12px' : 'auto'
          }}
        >
          <div className="bg-gray-900/95 backdrop-blur-md text-white text-sm rounded-2xl p-4 shadow-2xl border border-gray-700/50 min-w-44 max-w-52">
            {/* Ingredient Name */}
            <div className="font-bold text-base mb-2 text-center text-white">{ingredient}</div>
            
            {/* Details */}
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
    </>
  );
}