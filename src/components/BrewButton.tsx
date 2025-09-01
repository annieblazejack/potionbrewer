interface BrewButtonProps {
  onClick: () => void;
  disabled?: boolean;
  minIngredients?: number;
  selectedCount: number;
}

export default function BrewButton({
  onClick,
  disabled = false,
  minIngredients = 2,
  selectedCount,
}: BrewButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || selectedCount < minIngredients}
      className="cursor-pointer w-full bg-white text-black hover:bg-gray-100 disabled:bg-black disabled:text-gray-400 disabled:border-gray-400 disabled:cursor-not-allowed font-semibold py-4 px-8 text-lg transition-all duration-300 border border-gray-300 hover:border-gray-400 shadow-lg hover:shadow-xl backdrop-blur-sm enabled:ring-2 enabled:ring-gray-500/20"
    >
      Brew Potion
    </button>
  );
}
