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
