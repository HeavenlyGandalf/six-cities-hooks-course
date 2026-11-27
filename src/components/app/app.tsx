import {Provider} from 'react-redux';
import type {AppStore} from '../../store/store';
import type {JSX} from 'react';
import type {DataRouter} from 'react-router';
import {RouterProvider} from 'react-router/dom';

interface AppProps {
  // Router создаётся снаружи: в main.tsx - браузерный, в тестах - createMemoryRouter.
  router: DataRouter;
  store: AppStore;
}

function App({router, store}: AppProps): JSX.Element {
  return <Provider store={store}><RouterProvider router={router} /></Provider>;
}

export default App;
