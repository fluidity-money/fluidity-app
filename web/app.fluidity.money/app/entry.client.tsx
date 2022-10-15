import { RemixBrowser } from "@remix-run/react";
import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { ToolProvider } from "./components/ToolTip";

hydrateRoot(
  document,   
  <StrictMode>
    <ToolProvider>
      <RemixBrowser />
    </ToolProvider>
  </StrictMode>
);
