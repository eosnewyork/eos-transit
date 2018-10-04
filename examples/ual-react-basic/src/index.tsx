import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider as UnstatedProvider, Subscribe } from 'unstated';
import 'minireset.css';
import AppRoutes from './AppRoutes';
import { applyGlobalStyles } from './globalStyles';
import { SessionStateContainer } from './core/SessionStateContainer';

applyGlobalStyles();

const sessionStateContainer = new SessionStateContainer();

const Root = () => (
  <UnstatedProvider inject={[sessionStateContainer]}>
    <Router>
      <AppRoutes />
    </Router>
  </UnstatedProvider>
);

render(<Root />, document.getElementById('root'));
