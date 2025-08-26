interface BrewButtonProps {
  onClick: () => void;
  isLoading: boolean;
  disabled?: boolean;
  minIngredients?: number;
  selectedCount: number;
}

export default function BrewButton({
  onClick,
  isLoading,
  disabled = false,
  minIngredients = 2,
  selectedCount
}: BrewButtonProps) {


  return (
    <button
      onClick={onClick}
      disabled={isLoading || disabled || selectedCount < minIngredients}
      className="w-full bg-gray-800 text-foreground-100 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed font-semibold py-4 px-8 text-lg transition-all duration-300 rounded-lg border border-gray-600/60 hover:border-gray-500/80 shadow-lg hover:shadow-xl backdrop-blur-sm enabled:ring-2 enabled:ring-gray-500/20"
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-3">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Brewing...
        </span>
      ) : (
        'Brew Potion'
      )}
    </button>
  );
}