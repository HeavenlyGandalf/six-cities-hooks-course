import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {createBrowserRouter} from 'react-router';
import App from './components/app/app';
import {createAppRoutes} from './components/app/router';
import {ROOT_ELEMENT_ID} from './const';
import './styles/main.css';
import './styles/pages/main.css';
import './styles/pages/main-empty.css';
import './styles/pages/offer.css';
import './styles/pages/states.css';
import './styles/pages/favorites.css';
import './styles/pages/login.css';
import './styles/pages/not-found.css';
import './styles/adaptive.css';

const rootElement = document.getElementById(ROOT_ELEMENT_ID);

if (!rootElement) {
  throw new Error(`Element #${ROOT_ELEMENT_ID} not found`);
}

const router = createBrowserRouter(createAppRoutes());

createRoot(rootElement).render(
  <StrictMode>
    <App router={router} />
  </StrictMode>,
);
