import { useState } from 'react';

interface ShareRecipeModalProps {
  isVisible: boolean;
  onClose: () => void;
  recipe: string;
  ingredients: string[];
}

export default function ShareRecipeModal({
  isVisible,
  onClose,
  recipe,
  ingredients,
}: ShareRecipeModalProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleShare = async () => {
    if (!recipe || ingredients.length === 0) return;

    setIsSharing(true);
    setError(null);

    try {
      const response = await fetch('/api/recipes/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipe,
          ingredients,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save recipe');
      }

      const data = await response.json();
      const currentUrl = window.location.origin;
      const shareUrl = `${currentUrl}?recipe=${data.recipeId}`;
      setShareUrl(shareUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSharing(false);
    }
  };

  const copyToClipboard = async () => {
    if (shareUrl) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        // You could add a toast notification here
      } catch (err) {
        console.error('Failed to copy to clipboard:', err);
      }
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-black border border-white-600/30 p-8 max-w-md mx-4 shadow-2xl">
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
            Share Your Recipe
          </h2>

          {!shareUrl ? (
            <>
              <p className="text-gray-300 leading-relaxed mb-6">
                Save this recipe to share with other witches in the coven. They&apos;ll be able to view your creation and try it themselves.
              </p>

              {error && (
                <div className="mb-4 p-3 bg-red-900/30 border border-red-500/30 text-red-300 text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handleShare}
                disabled={isSharing}
                className="px-6 py-2 bg-white text-black hover:bg-gray-100 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSharing ? 'Saving...' : 'Save & Share'}
              </button>
            </>
          ) : (
            <>
              <p className="text-gray-300 leading-relaxed mb-4">
                Your recipe has been saved! Share this link with other witches:
              </p>

              <div className="mb-6 p-3 bg-gray-800/50 border border-gray-600/30 rounded">
                <p className="text-sm text-gray-300 break-all">
                  {shareUrl}
                </p>
              </div>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-gray-700 border border-gray-600/30 hover:bg-gray-600 text-white font-medium transition-colors"
                >
                  Copy Link
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-white text-black hover:bg-gray-100 font-medium transition-colors"
                >
                  Done
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
