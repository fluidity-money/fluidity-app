import type { LoaderFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import config from "../../webapp.config.js";
import { redirect } from "@remix-run/node";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useMemo, useState } from "react";

import EthereumProvider from "contexts/EthereumProvider";
import SolanaProvider from "contexts/SolanaProvider";

import { Fragment } from "react";

type ProviderMap = {
  [key: string]:
    | ((props: { children: React.ReactNode }) => JSX.Element)
    | undefined;
};

const Provider = ({
  network,
  solRpc,
  ethRpc,
  children,
}: {
  network?: string;
  solRpc: string;
  ethRpc: string;
  children: React.ReactNode;
}) => {
  const providers: ProviderMap = {
    ethereum: EthereumProvider(ethRpc),
    solana: SolanaProvider(solRpc),
  };

  const [validNetwork, setValidNetwork] = useState(network ?? "ethereum");

  useEffect(() => {
    if (network && Object.keys(providers).includes(network)) {
      setValidNetwork(network);
    }
  }, [network, providers]);

  const ProviderComponent = useMemo(() => 
    (network && providers[validNetwork]) || Fragment, [validNetwork]
  )
  
  return <ProviderComponent>{children}</ProviderComponent>;
};

export const loader: LoaderFunction = async ({ params }) => {
  // Prevent unknown network params
  const { network } = params;

  const solanaRpcUrl = process.env.FLU_SOL_RPC_HTTP;
  const ethereumRpcUrl = process.env.FLU_ETH_RPC_HTTP;

  const redirectTarget = redirect("/");

  if (!network) return redirectTarget;

  if (network in config.drivers === false) return redirectTarget;

  return {
    network,
    rpcUrls: {
      solana: solanaRpcUrl,
      ethereum: ethereumRpcUrl,
    },
  };
};

type LoaderData = {
  network: string;
  rpcUrls: {
    solana: string;
    ethereum: string;
  };
};

function ErrorBoundary() {
  return (
    <div>
      <img src="/images/logoMetallic.png" alt="" style={{ height: "40px" }} />
      <h1>Could not connect to Provider!</h1>
      <br />
      <h2>Our team has been notified, and are working on fixing it!</h2>
    </div>
  );
}

export default function Network() {
  const { network, rpcUrls } = useLoaderData<LoaderData>();

  return (
    <Provider
      network={network}
      solRpc={rpcUrls.solana}
      ethRpc={rpcUrls.ethereum}
    >
      <Outlet />
    </Provider>
  );
}

export { ErrorBoundary };
