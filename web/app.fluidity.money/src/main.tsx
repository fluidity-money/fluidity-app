import React from "react";
import ReactDOM from "react-dom/client";

import { BrowserTracing } from "@sentry/tracing";

import App from "./App";
import "./index.css";

if (import.meta.env.MODE === "production") {
  import("@sentry/react").then((Sentry) => {
    Sentry.init({
      dsn: process.env.REACT_APP_SENTRY_DSN,
      integrations: [new BrowserTracing()],
      tracesSampleRate: 1.0,
    });
  });
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
