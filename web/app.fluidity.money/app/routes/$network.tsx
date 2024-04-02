import type { LoaderFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import serverConfig, { colors } from "~/webapp.config.server";
import { redirect } from "@remix-run/node";
import { useEffect, useMemo, useState } from "react";
import config from "../../webapp.config.js";

import EthereumProvider from "contexts/EthereumProvider";
import SolanaProvider from "contexts/SolanaProvider";

import { Fragment } from "react";
import { Token } from "~/util/chainUtils/tokens.js";
import { NotificationSubscription } from "~/components/NotificationSubscription";
import SuiProvider from "contexts/SuiProvider";

type ProviderMap = {
  [key: string]:
    | ((props: { children: React.ReactNode }) => JSX.Element)
    | undefined;
};

export const loader: LoaderFunction = async ({ params }) => {
  // Prevent unknown network params
  const { network } = params;
  const { tokens, explorer } =
    serverConfig.config[network as unknown as string] ?? {};

  const solanaRpcUrl = process.env.FLU_SOL_RPC_HTTP;
  const suiRpcUrl = process.env.FLU_SUI_RPC_HTTP;

  const walletconnectId = process.env.FLU_WALLETCONNECT_ID;

  const redirectTarget = redirect("/");

  if (!network) return redirectTarget;

  if (network in config.drivers === false) return redirectTarget;

  return {
    network,
    explorer,
    tokens,
    rpcUrls: {
      solana: solanaRpcUrl,
      sui: suiRpcUrl,
    },
    walletconnectId,
    colors: (await colors)[network as string],
  };
};

const Provider = ({
  network,
  tokens,
  solRpc,
  suiRpc,
  walletconnectId,
  children,
}: {
  network?: string;
  tokens: Token[];
  solRpc: string;
  suiRpc: string;
  walletconnectId: string;
  children: React.ReactNode;
}) => {
  const providers: ProviderMap = {
    solana: SolanaProvider(solRpc, tokens),
    arbitrum: EthereumProvider(walletconnectId, tokens, network),
    sui: SuiProvider(suiRpc, tokens),
  };

  const [validNetwork, setValidNetwork] = useState(network ?? "arbitrum");

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

type LoaderData = {
  network: string;
  explorer: string;
  tokens: Token[];
  rpcUrls: {
    solana: string;
    sui: string;
  };
  walletconnectId: string;
  colors: {
    [symbol: string]: string;
  };
};

function ErrorBoundary({ error }: { error: string }) {
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
  const { network, tokens, rpcUrls, colors, walletconnectId } =
    useLoaderData<LoaderData>();

  return (
    <Provider
      network={network}
      tokens={tokens}
      solRpc={rpcUrls.solana}
      suiRpc={rpcUrls.sui}
      walletconnectId={walletconnectId}
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
