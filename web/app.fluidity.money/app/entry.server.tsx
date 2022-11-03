import { EntryContext } from "@remix-run/node";
import { RemixServer, useLocation, useMatches } from "@remix-run/react";
import { renderToString } from "react-dom/server";
import * as Sentry from "@sentry/remix";
import { useEffect } from "react";

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const markup = renderToString(
    <RemixServer context={remixContext} url={request.url} />
  );
  responseHeaders.set("Content-Type", "text/html");
  return new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}

if (process.env.NODE_ENV === "production") {
  const dsn = process.env.REACT_APP_SENTRY_DSN;

  if (!dsn) console.error("DSN not set!");

  Sentry.init({
    dsn,
    tracesSampleRate: 1.0,
    integrations: [
      new Sentry.BrowserTracing({
        routingInstrumentation: Sentry.remixRouterInstrumentation(
          useEffect,
          useLocation,
          useMatches
        ),
      }),
    ],
  });
} else console.log("Running in development, ignoring Sentry initialisation...");
