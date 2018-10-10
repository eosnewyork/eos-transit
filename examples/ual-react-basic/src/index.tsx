import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider as UnstatedProvider } from 'unstated';
import { makeUAL } from 'eos-ual';
import { makeScatterDesktopIntegration } from 'eos-ual/lib/integrations/scatter-desktop';
import 'minireset.css';
import AppRoutes from './AppRoutes';
import { applyGlobalStyles } from './globalStyles';
import { SessionStateContainer } from './core/SessionStateContainer';
import { TransactionStateContainer } from './core/TransactionStateContainer';

applyGlobalStyles();

const appName = 'my_eos_dapp';

const scatterNetworkConfig = {
  blockchain: 'eos',
  host: 'api.pennstation.eosnewyork.io',
  port: 7001,
  protocol: 'http',
  chainId: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f'
};

const scatterDesktopIntegration = makeScatterDesktopIntegration(
  appName,
  scatterNetworkConfig
);

const opts = {
  appName,
  chainId: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f',
  httpEndpoint: 'http://api.pennstation.eosnewyork.io:7001',
  expireInSeconds: 60,
  integrations: [scatterDesktopIntegration]
};

const ualInstance = makeUAL(opts);

const sessionStateContainer = new SessionStateContainer(ualInstance, appName);
const transactionStateContainer = new TransactionStateContainer(
  ualInstance,
  sessionStateContainer,
  appName
);

const Root = () => (
  <UnstatedProvider inject={[sessionStateContainer, transactionStateContainer]}>
    <Router>
      <AppRoutes />
    </Router>
  </UnstatedProvider>
);

render(<Root />, document.getElementById('root'));
