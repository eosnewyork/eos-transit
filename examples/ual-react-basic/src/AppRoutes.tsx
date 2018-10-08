import React from 'react';
import { Route, Switch } from 'react-router-dom';
import LoginScreen from './login/LoginScreen';
import AuthenticatedRoute from './core/AuthenticatedRoute';
import { AppLayout } from './core/AppLayout';
import { HomeScreen } from './HomeScreen';

export function AppRoutes() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/login" exact={true} component={LoginScreen} />
        <AuthenticatedRoute>
          {() => (
            <Switch>
              <Route path="/" exact={true} component={HomeScreen} />
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
