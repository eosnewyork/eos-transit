import React, { Component, ReactNode } from 'react';
import {
  Route,
  Redirect,
  withRouter,
  RouteComponentProps
} from 'react-router-dom';
import { Subscribe } from 'unstated';
import { SessionStateContainer } from './SessionStateContainer';

export interface Props extends RouteComponentProps<any> {
  component?: Component;
  children?: (props: any) => ReactNode;
  otherwiseRedirectTo?: string;
}

export function AuthenticatedRoute({
  children,
  component,
  otherwiseRedirectTo,
  ...rest
}: Props) {
  function renderComponent(props: any) {
    if (typeof children === 'function') {
      return children(props);
    }

    if (Component) {
      return <Component {...props} />;
    }

    return null;
  }

  return (
    <Route
      {...rest}
      render={(props: any) => (
        <Subscribe to={[SessionStateContainer]}>
          {(ssc: SessionStateContainer) => {
            if (ssc.isLoggedIn()) return renderComponent(props);
            // if (ssc.isAuthenticating()) return null;

            return (
              <Redirect
                to={{
                  pathname: otherwiseRedirectTo || '/login',
                  state: { from: props.location }
                }}
              />
            );
          }}
        </Subscribe>
      )}
    />
  );
}

export default withRouter(AuthenticatedRoute);
