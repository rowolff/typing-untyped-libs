import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const useKlarna = (containerId: string) => {
  const [clientToken, setClientToken] = useState<string>('');
  const [loaded, setLoaded] = useState<boolean>(false);
  const [initialised, setInitialized] = useState<boolean>(false);
  const [ready, setReady] = useState<boolean>(false);
  const [authToken, setAuthToken] = useState<any>(null);

  type TokenResponse = {
    clientToken: string;
  };

  const fetchClientToken = useCallback(async () => {
    const { data } = await axios.get<TokenResponse>(
      'http://localhost:8080/token'
    );
    setClientToken(data.clientToken);
  }, []);

  useEffect(() => {
    const loadScript = async () => {
      await fetchClientToken();
      const script = document.createElement('script');
      script.src = 'https://x.klarnacdn.net/kp/lib/v1/api.js';
      script.id = 'Klarna';
      document.body.appendChild(script);
      script.onload = () => {
        setLoaded(true);
      };
    };
    loadScript();
  }, [containerId, fetchClientToken]);

  useEffect(() => {
    if (loaded) {
      const Klarna = (window as any).Klarna;
      Klarna.Payments.init({
        client_token: clientToken,
      });
      setInitialized(true);
    }
  }, [loaded]);

  useEffect(() => {
    if (initialised) {
      const Klarna = (window as any).Klarna;
      Klarna.Payments.load(
        {
          container: `#${containerId}`,
          payment_method_category: 'pay_later',
        },
        (res: any) => (res.show_form ? setReady(true) : null)
      );
    }
  }, [initialised]);

  const checkout = () => {
    const Klarna = (window as any).Klarna;
    Klarna.Payments.authorize(
      {
        payment_method_category: 'pay_later',
      },
      (res: any) => {
        if (res.approved) {
          authorize(res);
        }
      }
    );
  };

  type AuthTokenResponse = {
    authorization_token: string;
  };
  const authorize = async ({ authorization_token }: AuthTokenResponse) => {
    const { data } = await axios.post(
      'http://localhost:8080/authorize',
      {
        authorization_token,
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    console.log('final: ', data);
  };

  return { ready, checkout };
};
