// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

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
