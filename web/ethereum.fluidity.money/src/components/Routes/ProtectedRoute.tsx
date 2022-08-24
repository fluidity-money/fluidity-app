// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import React from "react";
import { Redirect, Route } from "react-router-dom";
import { useWallet } from "use-wallet";
import { JsonRpcProvider } from "ethers/providers";

type ComponentType = React.ComponentType<any> | ((...args: any[]) => JSX.Element);

const ProtectedRoute =
  ({
    component: Component,
    exact,
    path,
    extraProps
  }: {
    component: ComponentType,
    exact?: boolean,
    path: string,
    extraProps?: any
  }) => {
    const wallet = useWallet<JsonRpcProvider>();
    const isConnected = wallet.status === "connected";
    return (
      <Route
        exact={exact}
        path={path}
        render={(props) =>
          isConnected ? <Component {...extraProps} {...props} />
            : <Redirect to="/" />
        }
      />
    );
  }

export default ProtectedRoute;
