import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './components/App';
import Appearance from './appearance';

ReactDOM.render(
  <React.StrictMode>
    <Appearance.Provider>
      <App />
    </Appearance.Provider>
  </React.StrictMode>,
  document.getElementById('root')
);