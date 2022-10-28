import { ErrorBoundaryComponent } from "remix";

import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

const ErrorBoundary : ErrorBoundaryComponent = ({ error : Error }) => {
  return (
    <html>
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <h1>Something went wrong!</h1>
        <Scripts />
      </body>
    </html>
  );
}

export default ErrorBoundary;
