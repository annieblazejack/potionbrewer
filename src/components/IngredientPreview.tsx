import { ImageManifest } from '@/lib/image-manifest';
import { useEffect, useRef, useState } from 'react';


interface IngredientPreviewProps {
  ingredient: ImageManifest;
  isVisible: boolean;
  onClose: () => void;
  onSelect: () => void;
  isSelected: boolean;
  isDisabled: boolean;
  showSelectButton?: boolean; // Only show button on mobile
}

export default function IngredientPreview({
  ingredient,
  isVisible,
  onClose,
  onSelect,
  isSelected,
  isDisabled,
  showSelectButton = true
}: IngredientPreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      // Start fade-in animation
      setIsAnimating(true);
    } else {
      // Reset animation state when hidden
      setIsAnimating(false);
    }
  }, [isVisible]);

  if (!isVisible) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${
            isAnimating ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={onClose}
        />
        
        <div 
          ref={previewRef}
          className={`relative bg-black border border-gray-700 p-8 max-w-sm w-full max-h-[90vh] shadow-2xl transition-all duration-500 ${
            isAnimating 
              ? 'opacity-100 scale-100 translate-y-0' 
              : 'opacity-0 scale-95 translate-y-4'
          }`}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
            aria-label="Close preview"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="flex flex-col h-full">
            <div className="flex-1 flex flex-col justify-center min-h-0">
              <img
                src={`/${ingredient.thumbnails.xlarge}`}
                alt={ingredient.name}
                className="object-contain mx-auto rounded max-h-full max-w-full"
                style={{ maxHeight: 'calc(90vh - 200px)' }}
              />
            </div>
            <div className="text-center mt-4 flex-shrink-0">
              <h4 className="font-mono text-xl font-medium text-gray-200">
                {ingredient.name}
              </h4>
            </div>
          </div>

          
          {showSelectButton ? (
            <div className="flex justify-center mt-4 flex-shrink-0">
              <button
                onClick={() => {
                  onSelect();
                  onClose();
                }}
                disabled={isDisabled}
                className={`px-8 py-3 font-medium border border-white transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-red-600 hover:bg-red-500 text-white border-red-500'
                    : isDisabled
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed border-gray-500'
                    : 'bg-white hover:bg-gray-100 text-black border-white'
                }`}
              >
                {isSelected ? 'Remove' : 'Add to Potion'}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    );

}