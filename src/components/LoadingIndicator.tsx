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
  'Nearly ready...',
  'Adding a pinch of "please don\'t poison yourself" to this mess...',
  'Your ingredient choices are... interesting. I\'m fixing them.',
  'Muttering ancient curses about modern witches under my breath...',
  'Rolling my eyes so hard they might fall out. Still brewing though.',
  'Adding extra patience to this brew. You\'re going to need it.',
  'Consulting my grimoire because... wow. Just wow.',
  'Chanting "please don\'t explode" repeatedly. For both our sakes.',
  'Adding three drops of "I can\'t believe I\'m doing this"...',
  'Sighing dramatically while saving your potion from complete disaster.'
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
      }, 300); // Match the CSS transition duration
    }, 2000);

    return () => clearInterval(messageInterval);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <section className={`p-8 mb-12 text-center transition-all duration-500 ease-in-out ${
      isVisibleInternal ? 'opacity-100' : 'opacity-0'
    }`}>
      <p 
        className="text-foreground/70 text-2xl mb-6 transition-opacity duration-300 ease-in-out font-caudex-italic"
        style={{ opacity: messageOpacity }}
      >
        {LOADING_MESSAGES[messageIndex]}
      </p>
    </section>
  );
}