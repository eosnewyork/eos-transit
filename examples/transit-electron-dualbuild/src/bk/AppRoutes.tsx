import React from 'react';
import { Route, Switch } from 'react-router-dom';
import LoginScreen from './login/LoginScreen';
import AuthenticatedRoute from './core/AuthenticatedRoute';
import { AppLayout } from './core/AppLayout';
import { HomeScreen } from './HomeScreen';
import { TestScreen } from './TestScreen';

export function AppRoutes() {
	return (
		<AppLayout>
			<Switch>
				<Route path="/login" exact={true} component={LoginScreen} />
				<AuthenticatedRoute>
					{() => (
						<Switch>
							<Route path="/" exact={true} component={HomeScreen} />
							<Route path="/test" exact={true} component={TestScreen} />
						</Switch>
					)}
				</AuthenticatedRoute>
				/>
				{/* <Route component={NotFoundScreen} /> */}
			</Switch>
		</AppLayout>
	);
}

export default AppRoutes;
