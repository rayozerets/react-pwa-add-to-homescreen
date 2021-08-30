// import React from 'react';
import { AddToHomeScreen } from 'react-pwa-add-to-homescreen';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Read More About <code>react-pwa-add-to-homescreen</code>.
        </p>
        <a
          className="App-link"
          href="https://www.npmjs.com/package/react-pwa-add-to-homescreen"
          target="_blank"
          rel="noopener noreferrer"
        >
          React PWA Add To Home Screen
        </a>
        <AddToHomeScreen />
      </header>
    </div>
  );
}

export default App;
