import { useKlarna } from './useKlarna';

const KLARNA_PAYMENTS_CONTAINER = 'klarna-payments-container';

export const Invoice: React.FC = () => {
  const { ready, checkout } = useKlarna(KLARNA_PAYMENTS_CONTAINER);

  return (
    <section>
      <div id={KLARNA_PAYMENTS_CONTAINER} />
      <button disabled={!ready} onClick={checkout}>
        Buy Naow!
      </button>
    </section>
  );
};
