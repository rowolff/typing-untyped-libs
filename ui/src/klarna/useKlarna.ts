import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export const useKlarna = (containerId: string) => {
  const klarnaContainerRef = useRef(null);
  const [clientToken, setClientToken] = useState<string>('');
  const [ready, setReady] = useState<boolean>(false);

  type TokenResponse = {
    clientToken: string;
  };

  const fetchClientToken = async () => {
    const { data } = await axios.get<TokenResponse>(
      'http://localhost:8080/token'
    );
    setClientToken(data.clientToken);
    console.log(data.clientToken);
  };

  useEffect(() => {
    fetchClientToken();
    const script = document.createElement('script');
    script.src = 'https://x.klarnacdn.net/kp/lib/v1/api.js';
    script.id = containerId;
    document.body.appendChild(script);
    script.onload = () => {
      setReady(true);
    };
  }, [containerId]);

  useEffect(() => {
    if (ready) {
      const Klarna = (window as any).Klarna;
      Klarna.Payments.init({
        client_token: clientToken,
      });
    }
  }, [ready]);

  return { klarnaContainerRef, ready };
};
