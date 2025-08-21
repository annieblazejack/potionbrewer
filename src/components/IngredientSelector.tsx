import { ImageManifest } from '@/lib/image-manifest';

interface IngredientSelectorProps {
  ingredients: ImageManifest[];
  selectedIngredients: string[];
  onToggleIngredient: (ingredient: string) => void;
  maxIngredients?: number;
}

export default function IngredientSelector({
  ingredients,
  selectedIngredients,
  onToggleIngredient,
  maxIngredients = 6
}: IngredientSelectorProps) {
  // Function to generate random colors for the pulsing effect
  const getRandomColor = () => {
    const colors = [
      '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57',
      '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43',
      '#10ac84', '#ee5a24', '#2f3542', '#3742fa', '#ff6348'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  
  return (
    <div className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {ingredients.map(ingredient => {
          const isSelected = selectedIngredients.includes(ingredient.name);
          const randomColor = isSelected ? getRandomColor() : '';
          
          return (
            <button
              key={ingredient.name}
              onClick={() => onToggleIngredient(ingredient.name)}
              disabled={!isSelected && selectedIngredients.length >= maxIngredients}
              className={`p-3 transition-all font-medium flex flex-col items-center gap-2 min-h-[100px] justify-center bg-background text-foreground hover:bg-foreground/10 disabled:opacity-50 disabled:cursor-not-allowed`}
              style={isSelected ? {
                boxShadow: `0 0 20px ${randomColor}`
              } : {}}
            >
            <img
              src={`/${ingredient.thumbnails.large}`}
              alt={ingredient.name}
              className={`max-w-full max-h-16 object-contain rounded ${
                isSelected ? 'opacity-90' : 'opacity-70'
              }`}
            />
          </button>
        );
        })}
      </div>
    </div>
  );
}