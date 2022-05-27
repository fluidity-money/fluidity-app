import {useSolana} from "@saberhq/use-solana";
import React from "react";
import {Redirect, Route} from "react-router-dom";

type ComponentType = React.ComponentType<any> | ((...args: any[]) => JSX.Element);

type RouteProps = {
    component: ComponentType,
    exact?: boolean,
    path: string,
    [x: string]: any
}
const ProtectedRoute =
    ({
        component: Component,
        exact,
        path,
        ...props
    }: RouteProps
    ) => {
        const sol = useSolana();
        return (
            <Route
                exact={exact}
                path={path}
                render={(renderProps) =>
                    sol.connected ? <Component {...renderProps} {...props} /> : <Redirect to="/" />
                }
            />
        );
    }

export default ProtectedRoute;
