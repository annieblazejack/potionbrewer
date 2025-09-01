import { ImageManifest } from '@/lib/image-manifest';
import { useEffect, useRef } from 'react';

interface IngredientPreviewProps {
  ingredient: ImageManifest;
  isVisible: boolean;
  onClose: () => void;
  onSelect: () => void;
  isSelected: boolean;
  isDisabled: boolean;
  showSelectButton?: boolean; // Only show button on mobile
}

// Sample ingredient descriptions - you can expand this with real data
const getIngredientDescription = (name: string): string => {
  const descriptions: Record<string, string> = {
    'Bull Statue': 'A weathered bronze statue representing strength and determination. Said to hold the power of ancient guardians.',
    'Corn Snake': 'A gentle serpent with vibrant orange and red patterns. Its shed skin is prized for transformation spells.',
    'Dandelion': 'A resilient flower that thrives anywhere. Its seeds carry wishes on the wind and dreams of new beginnings.',
    'Fossil': 'Ancient remnants of creatures long gone. Contains the memory of eons and the wisdom of deep time.',
    'Gardenia': 'A fragrant white bloom symbolizing purity and secret love. Its essence calms troubled spirits.',
    'Goldfinch': 'A bright yellow songbird that brings joy and lightness. Its feathers are said to carry melodies of hope.',
    'Icecream': 'A sweet frozen treat that captures moments of childhood wonder and simple pleasures.',
    'Ladyslipper': 'A rare orchid that grows in shadowed forests. Legend says it grants protection to woodland travelers.',
    'Lemur Fossil': 'The preserved remains of an ancient primate, holding secrets of evolution and adaptation.',
    'Library Book': 'A well-worn tome filled with knowledge and stories. Contains the collective wisdom of many minds.',
    'Longleaf': 'A majestic pine that survives fire and time. Its needles whisper ancient forest songs.',
    'Mating Moths': 'Two creatures drawn together by invisible forces. Represents the pull of deep connection.',
    'Moon': 'The celestial orb that guides tides and dreams. Source of nocturnal magic and silver light.',
    'N C M A': 'A cultural artifact representing human creativity and artistic expression through the ages.',
    'Opossum': 'A clever marsupial that plays dead to survive. Master of adaptation and resourcefulness.',
    'Parking': 'A mundane urban element that speaks to modern life\'s search for space and belonging.',
    'Ponysaurus': 'A mythical brewery creature that brings community together over craft and conversation.',
    'Redbud': 'An early spring bloomer with heart-shaped leaves. Herald of renewal and fresh beginnings.',
    'Shoelaces': 'Simple binding cords that connect us to our journeys. Every step tied to purpose.',
    'Sycamore': 'A towering tree with distinctive bark that peels like parchment, revealing stories beneath.',
    'T S A Water': 'Liquid confiscated at security checkpoints. Holds the frustrated energy of interrupted journeys.',
    'Tulip Poplar': 'A tall tree with tulip-shaped flowers. Bridges earth and sky with graceful strength.',
    'Two Roosters': 'A frozen dessert representing local flavor and community gathering places.'
  };
  
  return descriptions[name] || `A mysterious ingredient with unknown properties. Its true power awaits discovery.`;
};

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

  if (!isVisible) return null;

  const description = getIngredientDescription(ingredient.name);

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <div 
          ref={previewRef}
          className="relative bg-gray-900 border border-gray-600/30 rounded-xl p-6 max-w-sm w-full shadow-2xl"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition-colors"
            aria-label="Close preview"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="text-center mb-4">
            <img
              src={`/${ingredient.thumbnails.large}`}
              alt={ingredient.name}
              className="w-32 h-32 object-contain mx-auto mb-3 rounded"
            />
            <h3 className="font-caudex text-xl font-medium text-gray-200">
              {ingredient.name}
            </h3>
          </div>
          
          <p className="text-gray-300 text-sm leading-relaxed mb-6">
            {description}
          </p>
          
          {showSelectButton ? (
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 font-medium rounded-lg transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onSelect();
                  onClose();
                }}
                disabled={isDisabled}
                className={`flex-1 px-4 py-2 font-medium rounded-lg transition-colors ${
                  isSelected
                    ? 'bg-red-600 hover:bg-red-500 text-white'
                    : isDisabled
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-500 text-white'
                }`}
              >
                {isSelected ? 'Remove' : 'Add to Potion'}
              </button>
            </div>
          ) : (
            <div className="text-center">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 font-medium rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    );

}