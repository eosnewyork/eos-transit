import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import 'minireset.css';
import './initDefaultAccessContext';
import AppRoutes from './ui/AppRoutes';
import { applyGlobalStyles } from './ui/globalStyles';

applyGlobalStyles();

const Root = () => (
	<Router>
		<AppRoutes />
	</Router>
);

render(<Root />, document.getElementById('root'));
