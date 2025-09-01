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
      className="w-full bg-black text-foreground-100 hover:bg-gray-800 disabled:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed font-semibold py-4 px-8 text-lg transition-all duration-300 border border-gray-600/60 hover:border-gray-500/80 shadow-lg hover:shadow-xl backdrop-blur-sm enabled:ring-2 enabled:ring-gray-500/20"
    >
      Brew Potion
    </button>
  );
}
