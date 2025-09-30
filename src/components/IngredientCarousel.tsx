import { useState } from 'react';
import { ImageManifest } from '../lib/image-manifest';

interface IngredientCarouselProps {
  ingredients: (ImageManifest | undefined)[];
}

export default function IngredientCarousel({ ingredients }: IngredientCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Filter out undefined ingredients
  const validIngredients = ingredients.filter((ingredient): ingredient is ImageManifest => 
    ingredient !== undefined
  );

  if (validIngredients.length === 0) {
    return null;
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? validIngredients.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === validIngredients.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="mx-auto mb-6 max-w-sm">
      <div className="relative">
        {/* Main image display with side previews */}
        <div className="flex items-center justify-center gap-2">
          {/* Left preview image - only show if there's a different previous image */}
          {validIngredients.length > 2 && (
            <button
              onClick={goToPrevious}
              className="w-16 h-16 rounded-lg overflow-hidden opacity-30 hover:opacity-50 transition-opacity flex-shrink-0 relative"
              aria-label="Previous ingredient"
            >
              <img
                src={`/${validIngredients[currentIndex === 0 ? validIngredients.length - 1 : currentIndex - 1].thumbnails.small}`}
                alt="Previous ingredient"
                className="object-contain w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
            </button>
          )}

          {/* Left preview for 2 images case - only show if current is second image */}
          {validIngredients.length === 2 && currentIndex === 1 && (
            <button
              onClick={goToPrevious}
              className="w-16 h-16 rounded-lg overflow-hidden opacity-30 hover:opacity-50 transition-opacity flex-shrink-0 relative"
              aria-label="Previous ingredient"
            >
              <img
                src={`/${validIngredients[0].thumbnails.small}`}
                alt="Previous ingredient"
                className="object-contain w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
            </button>
          )}

          {/* Center main image */}
          <div className="w-32 h-32 rounded-lg overflow-hidden flex items-center justify-center">
            <img
              src={`/${validIngredients[currentIndex].thumbnails.large}`}
              alt={validIngredients[currentIndex].name}
              className="object-contain w-full h-full p-2"
            />
          </div>

          {/* Right preview for 2 images case - only show if current is first image */}
          {validIngredients.length === 2 && currentIndex === 0 && (
            <button
              onClick={goToNext}
              className="w-16 h-16 rounded-lg overflow-hidden opacity-30 hover:opacity-50 transition-opacity flex-shrink-0 relative"
              aria-label="Next ingredient"
            >
              <img
                src={`/${validIngredients[1].thumbnails.small}`}
                alt="Next ingredient"
                className="object-contain w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-black/60 to-transparent"></div>
            </button>
          )}

          {/* Right preview image - only show if there's a different next image */}
          {validIngredients.length > 2 && (
            <button
              onClick={goToNext}
              className="w-16 h-16 rounded-lg overflow-hidden opacity-30 hover:opacity-50 transition-opacity flex-shrink-0 relative"
              aria-label="Next ingredient"
            >
              <img
                src={`/${validIngredients[currentIndex === validIngredients.length - 1 ? 0 : currentIndex + 1].thumbnails.small}`}
                alt="Next ingredient"
                className="object-contain w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-black/60 to-transparent"></div>
            </button>
          )}
        </div>

        {/* Ingredient name */}
        {/* <div className="mt-4 text-center">
          <h3 className="font-mono text-lg font-semibold text-foreground">
            {validIngredients[currentIndex].name}
          </h3>
        </div> */}

        {/* Dots indicator */}
        {/* {validIngredients.length > 1 && (
          <div className="flex justify-center mt-4 space-x-2">
            {validIngredients.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex 
                    ? 'bg-foreground' 
                    : 'bg-gray-400 hover:bg-gray-600'
                }`}
                aria-label={`Go to ingredient ${index + 1}`}
              />
            ))}
          </div>
        )} */}
      </div>
    </div>
  );
}
