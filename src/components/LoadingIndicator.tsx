import { useEffect, useState } from 'react';

const LOADING_MESSAGES = [
  'Heating the cauldron...',
  'Measuring magical ingredients...',
  'Consulting ancient grimoires...',
  'Stirring counterclockwise...',
  'Adding a pinch of stardust...',
  'Waiting for the moon phase...',
  'Channeling mystical energies...',
  'Balancing alchemical properties...',
  'Infusing with arcane wisdom...',
  'Nearly ready...'
];

interface LoadingIndicatorProps {
  isVisible: boolean;
}

export default function LoadingIndicator({ isVisible }: LoadingIndicatorProps) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <section className="border border-border bg-accent/30 p-8 mb-12 text-center">
      <div className="flex items-center justify-center gap-3 mb-4">
        <svg className="animate-spin h-6 w-6 text-foreground" viewBox="0 0 24 24">
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
        <h3 className="font-serif text-xl font-semibold text-foreground">
          Brewing in Progress
        </h3>
      </div>
      <p className="text-foreground/70 text-lg mb-6">
        {LOADING_MESSAGES[messageIndex]}
      </p>
      <div className="flex justify-center space-x-1">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 bg-foreground/50 rounded-full animate-pulse"
            style={{
              animationDelay: `${i * 0.2}s`,
              animationDuration: '1s'
            }}
          />
        ))}
      </div>
    </section>
  );
}