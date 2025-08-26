import { useEffect, useState } from 'react';

const LOADING_MESSAGES = [
  'Heating the cauldron...',
  'Breathing slowly. Just FYI, this is going to take a minute...',
  'Measuring magical ingredients...',
  'Consulting my grimoire ...',
  'Chanting "please don\'t explode" repeatedly...',
  'Stirring counterclockwise...',
  'Balancing alchemical properties...',
  'Infusing with arcane wisdom...',
  'Adding a pinch of "please don\'t poison yourself" to this mess...',
  'Your ingredient choices are... interesting. I\'m fixing them.',
  'Muttering ancient curses under my breath...',
  'Adding extra patience to this brew. We\'re going to need it.',
  'Rolling my eyes so hard they might fall out. Still brewing though...',
  'Channeling mystical energies...',
  'Sighing dramatically while saving your potion from complete disaster.',
  'Waiting for the moon phase...',
  'Here we go again...',
];

interface LoadingIndicatorProps {
  isVisible: boolean;
}

export default function LoadingIndicator({ isVisible }: LoadingIndicatorProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [isVisibleInternal, setIsVisibleInternal] = useState(false);
  const [messageOpacity, setMessageOpacity] = useState(1);

  useEffect(() => {
    if (isVisible) {
      setIsVisibleInternal(true);
    } else {
      setIsVisibleInternal(false);
    }
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    const messageInterval = setInterval(() => {
      // Fade out current message
      setMessageOpacity(0);
      
      // Wait for fade out, then change message and fade in
      setTimeout(() => {
        setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
        setMessageOpacity(1);
      }, 400); // Match the CSS transition duration
    }, 2000);

    return () => clearInterval(messageInterval);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <section className={`p-8 mb-12 text-center transition-all duration-600 ease-in-out ${
      isVisibleInternal ? 'opacity-100' : 'opacity-0'
    }`}>
      <p 
        className="text-foreground/70 text-2xl mb-6 transition-opacity duration-400 ease-in-out font-caudex-italic"
        style={{ opacity: messageOpacity }}
      >
        {LOADING_MESSAGES[messageIndex]}
      </p>
    </section>
  );
}