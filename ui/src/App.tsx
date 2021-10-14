import logo from './logo.svg';

import { Invoice } from './klarna/Invoice';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Click the link below to pay with invoice.</p>
        <Invoice />
      </header>
    </div>
  );
}

export default App;
