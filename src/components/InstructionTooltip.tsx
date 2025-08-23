import { useEffect, useState } from 'react';

interface InstructionTooltipProps {
  isVisible: boolean;
  onDismiss: () => void;
  isMobile: boolean;
}

export default function InstructionTooltip({ isVisible, onDismiss, isMobile }: InstructionTooltipProps) {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      // Small delay before showing tooltip
      const showTimer = setTimeout(() => setShouldShow(true), 300);
      
      // Auto-dismiss after 5 seconds
      const dismissTimer = setTimeout(() => {
        setShouldShow(false);
        setTimeout(onDismiss, 300); // Wait for fade out animation
      }, 5000);

      return () => {
        clearTimeout(showTimer);
        clearTimeout(dismissTimer);
      };
    } else {
      setShouldShow(false);
    }
  }, [isVisible, onDismiss]);

  if (!isVisible) return null;

  return (
    <div className={`fixed top-32 left-1/2 transform -translate-x-1/2 z-40 transition-all duration-300 ${
      shouldShow ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
    }`}>
      <div className="bg-gray-800 border border-gray-600/30 rounded-lg px-4 py-3 shadow-lg max-w-sm">
        <div className="flex items-center justify-between gap-3">
          <p className="text-gray-300 text-sm">
            {isMobile 
              ? "Tap ingredients to learn more • Use 'Add to Potion' button to select"
              : "Hover to preview • Click once to see details • Click twice to add to potion"
            }
          </p>
          <button
            onClick={() => {
              setShouldShow(false);
              setTimeout(onDismiss, 300);
            }}
            className="text-gray-400 hover:text-gray-200 transition-colors flex-shrink-0"
            aria-label="Dismiss instructions"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Small arrow pointing down */}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2">
          <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-800"></div>
        </div>
      </div>
    </div>
  );
}