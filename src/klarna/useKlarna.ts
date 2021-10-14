import { useState, useEffect, useRef } from 'react';

export const useKlarna = (containerId: string) => {
  const klarnaContainerRef = useRef(null);
  const [ready, setReady] = useState<boolean>(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://x.klarnacdn.net/kp/lib/v1/api.js';
    script.id = containerId;
    document.body.appendChild(script);
    script.onload = () => {
      setReady(true);
    };
  }, [containerId]);

  return { klarnaContainerRef, ready };
};
