import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export const ProtectedRoute = ({
  component: Component,
  isAuthenticated,
  ...rest
}: any) => {
  return (
    <Route
      {...rest}
      render={props => {
        return isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        );
      }}
    />
  );
};
