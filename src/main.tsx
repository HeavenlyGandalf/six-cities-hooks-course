import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './app';
import {ROOT_ELEMENT_ID} from './const';
import './styles/main.css';
import './styles/pages/main.css';
import './styles/pages/main-empty.css';
import './styles/pages/offer.css';
import './styles/pages/states.css';
import './styles/pages/favorites.css';
import './styles/pages/login.css';
import './styles/pages/not-found.css';

const rootElement = document.getElementById(ROOT_ELEMENT_ID);

if (!rootElement) {
  throw new Error(`Element #${ROOT_ELEMENT_ID} not found`);
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
