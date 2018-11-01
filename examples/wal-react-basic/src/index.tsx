import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import 'minireset.css';
import './initDefaultAccessContext';
import AppRoutes from './AppRoutes';
import { applyGlobalStyles } from './globalStyles';

applyGlobalStyles();

const Root = () => (
  <Router>
    <AppRoutes />
  </Router>
);

render(<Root />, document.getElementById('root'));
