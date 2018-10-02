import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
// import { Provider as UnstatedProvider, Subscribe } from 'unstated';
import 'minireset.css';
import AppRoutes from './AppRoutes';
import { applyGlobalStyles } from './globalStyles';

applyGlobalStyles();

// const sessionStateContainer = new SessionStateContainer();
// const signUpStateContainer = new SignUpStateContainer();

const Root = () => (
  <Router>
    <AppRoutes />
  </Router>
);

render(<Root />, document.getElementById('root'));
