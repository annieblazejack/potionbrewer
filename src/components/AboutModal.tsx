import { useEffect, useState } from 'react';

interface AboutModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function AboutModal({ isVisible, onClose }: AboutModalProps) {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      
      <div 
        className={`relative bg-black border border-gray-700 p-8 max-w-md w-full shadow-2xl transition-all duration-500 ${
          isAnimating 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-95 translate-y-4'
        }`}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Modal content */}
        <div className="text-center">
          <p className="text-gray-200 text-sm leading-relaxed">
            Created by{' '}
            <a
              href="https://www.annieandgeddes.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Annie Blazejack
            </a>{' '}
            and{' '}
            <a
              href="https://www.annieandgeddes.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Geddes Levenson
            </a>{' '}
            in 2025 with support from{' '}
            <a
              href="https://burnaway.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Burnaway
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}