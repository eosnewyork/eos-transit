import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { AppLayout } from '../screen/AppLayout';
import { TestScreen } from '../TestScreen';

export function AppRoutes() {
	return (
		<AppLayout>
			<Switch>
				<Route path="/" exact={true} component={TestScreen} />
			</Switch>
		</AppLayout>
	);
}

export default AppRoutes;
