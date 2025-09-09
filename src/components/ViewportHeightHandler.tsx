"use client";

import { useEffect } from "react";

export default function ViewportHeightHandler() {
  useEffect(() => {
    // Function to set the viewport height
    const setViewportHeight = () => {
      // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
      const vh = window.innerHeight * 0.01;
      // Then we set the value in the --vh custom property to the root of the document
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    // Set the initial value
    setViewportHeight();

    // We listen to the resize event
    window.addEventListener('resize', setViewportHeight);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', setViewportHeight);
    };
  }, []);

  return null; // This component doesn't render anything
}
