// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import type { ComponentType } from "react";

import { Route } from "react-router-dom";


interface IProtectedRoute {
  predicate: () => boolean,
  component: ComponentType<any> | ((...args: any[]) => JSX.Element);
  exact?: boolean,
  path: string,
  extraProps?: any,
}

const ProtectedRoute = ({
  predicate,
  component: Component,
  path,
  ...props
}: IProtectedRoute) => {
  return predicate()
    ? <Route 
        path={path} 
        element={<Component {...props} />}
      />
    : <Route path="/" />
}

export default ProtectedRoute;
