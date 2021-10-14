import { useKlarna } from './useKlarna';

const KLARNA_PAYMENTS_CONTAINER = 'klarna-payments-container';

export const Invoice: React.FC = () => {
  const { klarnaContainerRef, ready } = useKlarna(KLARNA_PAYMENTS_CONTAINER);

  console.log(ready);

  return (
    <section>
      <button>Buy Naow!</button>
      <div id={KLARNA_PAYMENTS_CONTAINER} ref={klarnaContainerRef} />
    </section>
  );
};
