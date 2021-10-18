import { useState, useEffect } from 'react';
import axios from 'axios';

import { ORDER_DATA } from '../order/orderdata';

enum KlarnaPaymentMethodCategory {
  PAYNOW = 'pay_now',
  PAYLATER = 'pay_later',
}

export const useKlarna = (
  containerId: string,
  success: (id: string) => void
) => {
  const [clientToken, setClientToken] = useState<string>('');
  const [loaded, setLoaded] = useState<boolean>(false);
  const [initialised, setInitialized] = useState<boolean>(false);
  const [ready, setReady] = useState<boolean>(false);
  const [Klarna, setKlarna] = useState<Klarna>();

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
        setKlarna(window.Klarna);
      };
    };
    loadScript();
  }, []);

  useEffect(() => {
    if (loaded && Klarna) {
      Klarna.Payments.init({
        client_token: clientToken,
      });
      setInitialized(true);
    }
  }, [loaded, clientToken, Klarna]);

  useEffect(() => {
    if (initialised && Klarna) {
      Klarna.Payments.load(
        {
          container: `#${containerId}`,
          payment_method_category: KlarnaPaymentMethodCategory.PAYLATER,
        },
        ({ show_form }) => (show_form ? setReady(true) : null)
      );
    }
  }, [initialised, containerId, Klarna]);

  const checkout = () => {
    if (!Klarna) {
      return;
    }

    Klarna.Payments.authorize(
      {
        payment_method_category: KlarnaPaymentMethodCategory.PAYLATER,
      },
      ORDER_DATA,
      ({ approved, authorization_token, error }) => {
        if (approved) {
          complete(authorization_token);
        } else {
          console.log('Sth went wrong:', error);
        }
      }
    );
  };

  const complete = async (authorization_token: string) => {
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
