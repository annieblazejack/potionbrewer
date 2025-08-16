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
  if (selectedCount < minIngredients) return null;

  return (
    <section className="mb-12">
      <button
        onClick={onClick}
        disabled={isLoading || disabled}
        className="w-full bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium py-6 px-8 text-lg transition-all border border-foreground"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-3">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
    </section>
  );
}