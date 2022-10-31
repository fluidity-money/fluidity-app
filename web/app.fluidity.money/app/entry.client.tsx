import { RemixBrowser } from "@remix-run/react";
import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { ToolProvider } from "./components/ToolTip";
import { init as initSentry } from "@sentry/remix";
import { Integrations } from "@sentry/tracing";

if (process.env.NODE_ENV === "production") {
  const dsn = "https://6e55f2609b29473599d99a87221c60dc@o1103433.ingest.sentry.io/6745508";

  if (!dsn) console.error("DSN not set!");

  initSentry({
    dsn,
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 1.0,
  });
} else console.log("Running in development, ignoring Sentry initialisation...");


hydrateRoot(
  document,
  <StrictMode>
    <ToolProvider>
      <RemixBrowser />
    </ToolProvider>
  </StrictMode>
);

