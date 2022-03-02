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
