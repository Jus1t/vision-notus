import React from "react";
import ReactDOM from "react-dom/client"; // Updated import for React 18
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/styles/tailwind.css";

// layouts
import Admin from "layouts/Admin.js";
import Auth from "layouts/Auth.js";
// views without layouts
import ProtectedRoute from "components/Routing/ProtectedRoute";

import { AuthProvider } from "views/auth/AuthProvider"; // Ensure the path to AuthProvider is correct

// Create root with ReactDOM.createRoot for React 18
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode> {/* Optional, but helps catch potential issues */}
    <AuthProvider> {/* Ensure this wraps your components */}
      <BrowserRouter>
        <Switch>
          <Route path="/auth/login" component={Auth} />
          <ProtectedRoute path="/admin" component={Admin} />
          <Redirect from="*" to="/admin" />
        </Switch>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
