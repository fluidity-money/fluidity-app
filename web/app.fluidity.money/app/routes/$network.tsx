import type { LoaderFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import config from "../../webapp.config.js";
import serverConfig, { colors } from "~/webapp.config.server";
import { redirect } from "@remix-run/node";
import { useEffect, useMemo, useState } from "react";

import EthereumProvider from "contexts/EthereumProvider";
import SolanaProvider from "contexts/SolanaProvider";

import { Fragment } from "react";
import { Token } from "~/util/chainUtils/tokens.js";
import { NotificationSubscription } from "~/components/NotificationSubscription";

type ProviderMap = {
  [key: string]:
    | ((props: { children: React.ReactNode }) => JSX.Element)
    | undefined;
};

const Provider = ({
  network,
  tokens,
  solRpc,
  ethRpc,
  children,
}: {
  network?: string;
  tokens: Token[];
  solRpc: string;
  ethRpc: string;
  children: React.ReactNode;
}) => {
  const providers: ProviderMap = {
    ethereum: EthereumProvider(ethRpc, tokens),
    solana: SolanaProvider(solRpc, tokens),
  };

  const [validNetwork, setValidNetwork] = useState(network ?? "ethereum");

  useEffect(() => {
    if (network && Object.keys(providers).includes(network)) {
      setValidNetwork(network);
    }
  }, [network, providers]);

  const ProviderComponent = useMemo(
    () => (network && providers[validNetwork]) || Fragment,
    [validNetwork]
  );

  return <ProviderComponent>{children}</ProviderComponent>;
};

export const loader: LoaderFunction = async ({ params }) => {
  // Prevent unknown network params
  const { network } = params;
  const { tokens, explorer } =
    serverConfig.config[network as unknown as string] ?? {};

  const solanaRpcUrl = process.env.FLU_SOL_RPC_HTTP;
  const ethereumRpcUrl = process.env.FLU_ETH_RPC_HTTP;

  const redirectTarget = redirect("/");

  if (!network) return redirectTarget;

  if (network in config.drivers === false) return redirectTarget;

  return {
    network,
    explorer,
    tokens,
    rpcUrls: {
      solana: solanaRpcUrl,
      ethereum: ethereumRpcUrl,
    },
    colors: (await colors)[network as string],
  };
};

type LoaderData = {
  network: string;
  explorer: string;
  tokens: Token[];
  rpcUrls: {
    solana: string;
    ethereum: string;
  };
  colors: {
    [symbol: string]: string;
  };
};

function ErrorBoundary({ error }) {
  console.error(error);
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
  const { network, tokens, rpcUrls, colors } = useLoaderData<LoaderData>();

  // Hardcode solana to redirect to ethereum
  if (network === "solana") throw new Error("Solana not supported");

  return (
    <Provider
      network={network}
      tokens={tokens}
      solRpc={rpcUrls.solana}
      ethRpc={rpcUrls.ethereum}
    >
      <NotificationSubscription
        network={network}
        tokens={tokens}
        colorMap={colors}
      />
      <Outlet />
    </Provider>
  );
}

export { ErrorBoundary };
