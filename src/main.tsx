import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './app';
import {ROOT_ELEMENT_ID} from './const';

const rootElement = document.getElementById(ROOT_ELEMENT_ID);

if (!rootElement) {
  throw new Error(`Element #${ROOT_ELEMENT_ID} not found`);
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
