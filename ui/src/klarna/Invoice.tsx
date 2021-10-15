import { useKlarna } from './useKlarna';

const KLARNA_PAYMENTS_CONTAINER = 'klarna-payments-container';

interface InvoiceProps {
  shown: boolean;
  onSuccess: (id: string) => void;
}

export const Invoice: React.FC<InvoiceProps> = ({ shown, onSuccess }) => {
  const { ready, checkout } = useKlarna(KLARNA_PAYMENTS_CONTAINER, onSuccess);

  if (!shown) {
    return null;
  }

  return (
    <section>
      <p>Click the link below to pay with invoice.</p>
      <div id={KLARNA_PAYMENTS_CONTAINER} />
      <button disabled={!ready} onClick={checkout}>
        Buy Naow!
      </button>
    </section>
  );
};
