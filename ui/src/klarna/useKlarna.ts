import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

import { ORDER_DATA } from '../orderdata';

export const useKlarna = (
  containerId: string,
  success: (id: string) => void
) => {
  const [clientToken, setClientToken] = useState<string>('');
  const [loaded, setLoaded] = useState<boolean>(false);
  const [initialised, setInitialized] = useState<boolean>(false);
  const [ready, setReady] = useState<boolean>(false);

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
      ORDER_DATA,
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
  type AuthResult = {
    order_id: string;
  };
  const authorize = async ({ authorization_token }: AuthTokenResponse) => {
    const { data } = await axios.post<AuthResult>(
      'http://localhost:8080/authorize',
      {
        authorization_token,
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    if (data.order_id) {
      success(data.order_id);
    }
  };

  return { ready, checkout };
};
