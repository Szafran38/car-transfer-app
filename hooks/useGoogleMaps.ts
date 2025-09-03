"use client";

import { useEffect, useState } from 'react';

export function useLeafletMaps() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Leaflet is loaded via npm package, so it's always available
    // We just need to ensure the component is mounted client-side
    setIsLoaded(true);
  }, []);

  return { isLoaded, error };
}

// Keep the old hook name for compatibility but use Leaflet
export function useGoogleMaps() {
  return useLeafletMaps();
}