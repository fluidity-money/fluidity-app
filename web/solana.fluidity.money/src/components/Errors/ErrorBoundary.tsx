// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import type {FC} from 'react';

import { ErrorBoundary as SentryErrorBoundary } from "@sentry/react";
import ErrorPage from "./ErrorPage";

const ErrorBoundary: FC<{}> = ({children}) => {
  return <SentryErrorBoundary fallback={<ErrorPage/>}>{children}</SentryErrorBoundary>;
}

export default ErrorBoundary;
