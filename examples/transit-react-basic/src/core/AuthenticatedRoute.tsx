import React, { Component, ReactNode } from 'react';
import {
  Route,
  Redirect,
  withRouter,
  RouteComponentProps
} from 'react-router-dom';
import WAL from 'eos-transit';

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
      render={(props: any) => {
        const isLoggedIn = !!WAL.accessContext.getActiveWallets().length;
        if (isLoggedIn) return renderComponent(props);

        return (
          <Redirect
            to={{
              pathname: otherwiseRedirectTo || '/login',
              state: { from: props.location }
            }}
          />
        );
      }}
    />
  );
}

export default withRouter(AuthenticatedRoute);
