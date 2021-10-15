import logo from './logo.svg';
import './App.css';

import { useState } from 'react';

import { Invoice } from './klarna/Invoice';
import { Order } from './order/Order';

const App = () => {
  const [showInvoice, setShowInvoice] = useState<boolean>(true);
  const [orderId, setOrderId] = useState<string>('');

  const success = (id: string) => {
    setOrderId(id);
    setShowInvoice(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Invoice onSuccess={success} shown={showInvoice} />
        <Order id={orderId} />
      </header>
    </div>
  );
};

export default App;
