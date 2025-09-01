interface OnboardingPopupProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function OnboardingPopup({
  isVisible,
  onClose,
}: OnboardingPopupProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-gray-900 border border-gray-600/30 rounded-xl p-8 max-w-md mx-4 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition-colors"
          aria-label="Close"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="text-center">
          <h2 className="font-mono text-2xl font-medium text-gray-200 mb-4">
            Welcome to the Potion Brewer
          </h2>
          <p className="text-gray-300 leading-relaxed">
            Forage for ingredients. Once you&apos;ve chosen a few, use the Brew
            button to create a unique potion recipe.
          </p>

          <button
            onClick={onClose}
            className="mt-6 px-6 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 font-medium rounded-lg transition-colors"
          >
            Start Brewing
          </button>
        </div>
      </div>
    </div>
  );
}
