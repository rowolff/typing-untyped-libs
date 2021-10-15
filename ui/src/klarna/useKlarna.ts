import { useState, useEffect } from 'react';
import axios from 'axios';

import { ORDER_DATA } from '../order/orderdata';

export const useKlarna = (
  containerId: string,
  success: (id: string) => void
) => {
  const [clientToken, setClientToken] = useState<string>('');
  const [loaded, setLoaded] = useState<boolean>(false);
  const [initialised, setInitialized] = useState<boolean>(false);
  const [ready, setReady] = useState<boolean>(false);

  useEffect(() => {
    const loadScript = async () => {
      const { data } = await axios.get<ClientTokenResponse>(
        'http://localhost:8080/token'
      );
      setClientToken(data.clientToken);
      const script = document.createElement('script');
      script.src = 'https://x.klarnacdn.net/kp/lib/v1/api.js';
      script.id = 'Klarna';
      document.body.appendChild(script);
      script.onload = () => {
        setLoaded(true);
      };
    };
    loadScript();
  }, []);

  // https://fettblog.eu/typescript-hasownproperty/
  function hasOwnProperty<X extends {}, Y extends PropertyKey>(
    obj: X,
    prop: Y
  ): obj is X & Record<Y, unknown> {
    return obj.hasOwnProperty(prop);
  }

  useEffect(() => {
    if (loaded) {
      let Klarna: unknown;
      if (
        typeof window === 'object' &&
        window !== null &&
        hasOwnProperty(window, 'Klarna') &&
        typeof window.Klarna === 'object'
      ) {
        Klarna = window.Klarna;
      }

      let Payments: unknown;
      if (
        typeof Klarna === 'object' &&
        Klarna !== null &&
        hasOwnProperty(Klarna, 'Payments') &&
        typeof Klarna.Payments === 'object'
      ) {
        Payments = Klarna.Payments;
      }

      let init;
      if (
        typeof Payments === 'object' &&
        Payments !== null &&
        hasOwnProperty(Payments, 'init') &&
        typeof Payments.init === 'function'
      ) {
        init = Payments.init;
      }

      if (init) {
        init({
          client_token: clientToken,
        });
        setInitialized(true);
      }
    }
  }, [loaded, clientToken]);

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
  }, [initialised, containerId]);

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
