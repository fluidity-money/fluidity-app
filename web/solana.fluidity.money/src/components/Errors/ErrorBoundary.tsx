// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import type {FC} from 'react';

import { ErrorBoundary as SentryErrorBoundary } from "@sentry/react";
import ErrorPage from "./ErrorPage";

const ErrorBoundary: FC<{}> = ({children}) => {
  return <SentryErrorBoundary fallback={<ErrorPage/>}>{children}</SentryErrorBoundary>;
}

export default ErrorBoundary;
