import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { LoginScreen } from './login/LoginScreen';
import { AppLayout } from './core/AppLayout';
import { HomeScreen } from './HomeScreen';

export function AppRoutes() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/login" exact={true} component={LoginScreen} />
        <Route path="/" exact={true} component={HomeScreen} />
        {/* <AuthenticatedRoute>
        {() => (
          <Switch>
            <Route path="/" exact={true} component={App} />
          </Switch>
        )}
      </AuthenticatedRoute> */}
        />
        {/* <Route component={NotFoundScreen} /> */}
      </Switch>
    </AppLayout>
  );
}

export default AppRoutes;
