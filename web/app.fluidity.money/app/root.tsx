import type { MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { withSentry } from "@sentry/remix";

import globalStylesheetUrl from "./global-styles.css";
import surfingStylesheetUrl from "@fluidity-money/surfing/dist/style.css";
import { ToolTipLinks } from "./components";

// Removed LinkFunction as insufficiently typed (missing apple-touch-icon)
export const links = () => {
  return [
    ...ToolTipLinks(),
    { rel: "icon", href: "/favicon.ico" },

    { rel: "apple-touch-icon", sizes: "57x57", href: "/apple-icon-57x57.png" },
    { rel: "apple-touch-icon", sizes: "60x60", href: "/apple-icon-60x60.png" },
    { rel: "apple-touch-icon", sizes: "72x72", href: "/apple-icon-72x72.png" },
    { rel: "apple-touch-icon", sizes: "76x76", href: "/apple-icon-76x76.png" },

    {
      rel: "apple-touch-icon",
      sizes: "114x114",
      href: "/apple-icon-114x114.png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "120x120",
      href: "/apple-icon-120x120.png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "144x144",
      href: "/apple-icon-144x144.png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "152x152",
      href: "/apple-icon-152x152.png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      href: "/apple-icon-180x180.png",
    },

    {
      rel: "icon",
      type: "image/png",
      sizes: "192x192",
      href: "/android-icon-192x192.png",
    },

    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      href: "/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "96x96",
      href: "/favicon-96x96.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      href: "/favicon-16x16.png",
    },

    { rel: "manifest", href: "/manifest.json" },

    { rel: "msapplication-TileColor", content: "#000000" },
    { rel: "msapplication-TileImage", href: "/ms-icon-144x144.png" },

    { rel: "theme-color", content: "#000000" },

    { rel: "stylesheet", href: globalStylesheetUrl },
    { rel: "stylesheet", href: surfingStylesheetUrl },
  ];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Fluidity",
  description:
    "Fluidity is a platform for getting more utility out of your crypto assets.",
  viewport: "width=device-width,initial-scale=1",
});

function ErrorBoundary() {
  return (
    <html>
      <head>
        <Meta />
        <Links />
      </head>
      <body style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
        <img src="/images/logoMetallic.png" alt="" style={{height: "40px"}} />
        <h1>Something went wrong!</h1>
        <br/>
        <h2>Our team has been notified, and are working on fixing it!</h2>
        <Scripts />
      </body>
    </html>
  );
}

function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export { ErrorBoundary }

export default withSentry(App, {
  wrapWithErrorBoundary: true,
});
