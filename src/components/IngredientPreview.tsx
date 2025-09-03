import { ImageManifest } from '@/lib/image-manifest';
import { useEffect, useRef, useState } from 'react';

const acronyms = ['NCMA', 'NC', 'LGBTQ', 'TSA', 'NCCU', 'UNC', 'ACC'];
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
    'Bull Statue': 'A meeting place at the center of the city of Durham with truly ample testicles.',
    'Corn Snake': 'A gentle serpent with vibrant orange and red patterns. Its shed skin is prized for transformation spells.',
    'Dandelion': 'A resilient flower that thrives anywhere. Its seeds carry wishes on the wind and dreams of new beginnings.',
    'Fossil': 'A jawbone from the Duke Lemur Center. Contains the memory of eons and the wisdom of deep time.',
    'Gardenia': 'A fragrant white bloom. Its essence calms troubled spirits.',
    'Goldfinch': 'A bright yellow songbird that brings joy and lightness. More difficult to please than your average backyard bird.',
    'Icecream': 'A sweet frozen treat from Two Roosters.',
    'Ladyslipper': 'A yonic orchid that grows in shadowed forests. Legend says it grants protection to woodland travelers.',
    'Library Book': 'A well-worn tome filled with knowledge and stories. Contains the collective wisdom of many minds.',
    'Longleaf': 'A majestic pine that survives fire and time.',
    'Mating Moths': 'Two rosy maple moths, drawn together.',
    'Moon': 'The celestial orb that guides tides and dreams. Source of nocturnal magic and silver light.',
    'NCMA': 'Thomas Sayre\'s Gyre. A red clay monument.',
    'Opossum': 'A clever marsupial that plays dead to survive. Master of adaptation and resourcefulness.',
    'Parking': 'A validated parking ticket, proof that you attended the city council meeting.',
    'Ponysaurus': 'A tap handle representing the mythical brewery creature.',
    'Redbud': 'An early spring bloomer with heart-shaped leaves. Herald of renewal and fresh beginnings.',
    'Shoelaces': 'Taken from an ACC athlete. Still sweaty.',
    'Sycamore': 'A towering tree with distinctive bark that peels like parchment, revealing stories beneath.',
    'TSA Water': 'Liquid confiscated at security checkpoints. Holds the frustrated energy of interrupted journeys.',
    'Tulip Poplar': 'A tall tree with tulip-shaped flowers. Bridges earth and sky with graceful strength.',
    'Firefly' : '',
    'Apple' : 'Taken from the barrel after a big steak dinner at the Angus Barn',
    'Audio Cable' : 'Frayed, found amongst the detritus after a Sylvan Esso concert.',
    'Bat Dog' : 'Steadfast companion to the Durham Bulls.',
    'Bee' : '',
    'Blackberries' : 'Picked from a bramble under a high voltage power line.',
    'Bojangles' : 'Biscuit packaging, ideally found in a ditch by the side of a state road.',
    'Brick' : 'A Fitzgerald Brick from the late 1800s.',
    'Chanterelle' : 'Cinnamon Chantarelle mushrooms, bright and slender, found unexpectedly.',
    'Cheerwine' : 'The soda with the cherry flavor and distinctive fizzy mouthfeel.',
    'Cicaida' : 'Exoskeleton, shed by a cicada nymph when she was ready to grow up.',
    'Cloth' : 'Still wet with tears cried over an ACC game.',
    'Cockroach' : 'A survivor, and a harbinger of summer.',
    'Coffee' : 'A fancy iced coffee from Coco Cinnamon, to be used before all the ice has melted.',
    'Coins' : 'Found in a pocket, under a couch, or behind a dresser.',
    'Condoms' : 'Given freely by the LGBTQ Center of Durham.',
    'Copperhead' : '',
    'Crown' : 'Worn by a Beaver Queen at the pageant.',
    'Cypress Knees' : '',
    'Death Cap' : '',
    'Dumplings' : 'Rainbow dumplings from Sister Liu\'s',
    'Eno River Water' : '',
    'Essay' : 'Printed out on paper, with red corrections, written by a Duke undergrad.',
    'False Parasol' : '',
    'Feather' : '',
    'Fig' : '',
    'Grass' : 'Pampas grass',
    'Honeysuckle' : 'Coral honeysuckle',
    'Kudzu' : '',
    'Leopard Frog' : '',
    'Leopard Moth' : '',
    'Magnolia' : '',
    'Mama Ray' : 'Wangechi Mutu\'s sculpture at the Nasher.',
    'Maypop' : 'Also known as passion flower.',
    'Muscadine' : 'Ideally, scuppernongs.',
    'Nest' : 'A robin\'s nest with little precious blue eggs in it.',
    'Poison Ivy' : '',
    'Red Spotted Purple' : '',
    


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

  const description = getIngredientDescription(ingredient.name);

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
          className={`relative bg-black border border-gray-700 p-8 max-w-sm w-full shadow-2xl transition-all duration-500 ${
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
          
          <div className="text-center mb-4">
            <img
              src={`/${ingredient.thumbnails.xlarge}`}
              alt={ingredient.name}
              className="object-contain mx-auto p-12 rounded"
            />
            <h3 className="font-mono text-xl font-medium text-gray-200">
              {ingredient.name}
            </h3>
          </div>
          
          <p className="text-gray-300 text-sm leading-relaxed mb-6">
            {description}
          </p>
          
          {showSelectButton ? (
            <div className="flex justify-center">
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