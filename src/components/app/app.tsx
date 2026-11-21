import type {JSX} from 'react';
import type {DataRouter} from 'react-router';
import {RouterProvider} from 'react-router/dom';

interface AppProps {
  // Router создаётся снаружи: в main.tsx - браузерный, в тестах - createMemoryRouter.
  router: DataRouter;
}

function App({router}: AppProps): JSX.Element {
  return <RouterProvider router={router} />;
}

export default App;
