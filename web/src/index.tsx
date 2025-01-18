import { Auth0Provider } from "@auth0/auth0-react";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-0lhvkegz23fmv54q.us.auth0.com"
      clientId="EdlonjAKtmxU4eufGFKyflSsrEH6QxJP"
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
);
