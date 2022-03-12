import type {FC} from 'react';

import { ErrorBoundary as SentryErrorBoundary } from "@sentry/react";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import ErrorPage from "./ErrorPage";
import {useEffect} from 'react'

const ErrorBoundary: FC<{}> = ({children}) => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      const dsn = process.env.REACT_APP_SENTRY_DSN;

      if (!dsn) console.error("DSN not set!");

      Sentry.init({
        dsn,
        integrations: [new Integrations.BrowserTracing()],
        tracesSampleRate: 1.0,
      });
    } else console.log("Running in development, ignoring Sentry initialisation...");

  }, [])

  return <SentryErrorBoundary fallback={<ErrorPage/>}>{children}</SentryErrorBoundary>;
}

export default ErrorBoundary;
