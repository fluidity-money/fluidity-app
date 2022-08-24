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
  extraProps,
}: IProtectedRoute) => {
  return (
    <Route
      exact={exact}
      path={path}
      render={(props) => 
        predicate() 
          ? <Component {...props} {...extraProps} />
          : <Redirect to="/" />
      }
    />
  );
}

export default ProtectedRoute;
