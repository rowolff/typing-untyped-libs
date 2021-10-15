import React from 'react';

interface OrderProps {
  id: string;
}

export const Order: React.FC<OrderProps> = ({ id }) => {
  if (id.length === 0) {
    return null;
  }

  return (
    <article>
      <p>Thank you for your order. Your order id is:</p>
      <a href="http://idealo.de">{id}</a>
    </article>
  );
};
