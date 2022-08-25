import type { ComponentType } from "react";

import { Redirect, Route } from "react-router-dom";


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
  exact,
  path,
  ...props
}: IProtectedRoute) => {
  return (
    <Route exact path={path} >
      {
        predicate() 
          ? <Component {...props} />
          : <Redirect to="/" />
      }
    </Route
  );
}

export default ProtectedRoute;
