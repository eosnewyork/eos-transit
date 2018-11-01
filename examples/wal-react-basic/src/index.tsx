import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider as UnstatedProvider } from 'unstated';
import WAL, { initDefaultAccessContext } from 'wal-eos';
import { makeScatterWalletProvider } from 'wal-eos/lib/walletProviders/scatter';
import 'minireset.css';
import AppRoutes from './AppRoutes';
import { applyGlobalStyles } from './globalStyles';
import { SessionStateContainer } from './core/SessionStateContainer';

applyGlobalStyles();

const appName = 'my_eos_dapp';

initDefaultAccessContext({
  appName,
  network: {
    host: 'api.pennstation.eosnewyork.io',
    port: 7001,
    protocol: 'http',
    chainId: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f'
  },
  walletProviders: [
    makeScatterWalletProvider(
      // NOTE: Temp repetition
      {
        host: 'api.pennstation.eosnewyork.io',
        port: 7001,
        protocol: 'http',
        chainId:
          'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f'
      }
    )
  ]
});

const sessionStateContainer = new SessionStateContainer(WAL.accessContext);

const Root = () => (
  <UnstatedProvider inject={[sessionStateContainer]}>
    <Router>
      <AppRoutes />
    </Router>
  </UnstatedProvider>
);

render(<Root />, document.getElementById('root'));
