import type {FC} from 'react';

import { ErrorBoundary as SentryErrorBoundary } from "@sentry/react";
import ErrorPage from "./ErrorPage";

const ErrorBoundary: FC<{}> = ({children}) => {
  return <SentryErrorBoundary fallback={<ErrorPage/>}>{children}</SentryErrorBoundary>;
}

export default ErrorBoundary;
