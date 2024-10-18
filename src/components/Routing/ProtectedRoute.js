import React from "react";
import { Route, Redirect } from "react-router-dom";
import useAuth from "views/auth/useAuth";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated } = useAuth();
  console.log(isAuthenticated)
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? <Component {...props} /> : <Redirect to="/auth/login" />
      }
    />
  );
};

export default ProtectedRoute;
