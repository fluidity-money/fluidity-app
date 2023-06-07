import type { LoaderFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import serverConfig, { colors } from "~/webapp.config.server";
import { redirect } from "@remix-run/node";
import { useEffect, useMemo, useState, useContext } from "react";
import FluidityFacadeContext from "contexts/FluidityFacade";
import { SplitContext } from "contexts/SplitProvider";
import config from "../../webapp.config.js";

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

export const loader: LoaderFunction = async ({ params }) => {
  // Prevent unknown network params
  const { network } = params;
  const { tokens, explorer } =
    serverConfig.config[network as unknown as string] ?? {};

  const solanaRpcUrl = process.env.FLU_SOL_RPC_HTTP;

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
    },
    walletconnectId,
    colors: (await colors)[network as string],
  };
};

const Provider = ({
  network,
  tokens,
  solRpc,
  walletconnectId,
  children,
}: {
  network?: string;
  tokens: Token[];
  solRpc: string;
  walletconnectId: string;
  children: React.ReactNode;
}) => {
  const providers: ProviderMap = {
    ethereum: EthereumProvider(walletconnectId, tokens, network),
    solana: SolanaProvider(solRpc, tokens),
    arbitrum: EthereumProvider(walletconnectId, tokens, network),
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

const ProviderOutlet = () => {
  const { connected, address, getDegenScore } = useContext(
    FluidityFacadeContext
  );

  const { client } = useContext(SplitContext);

  useEffect(() => {
    if (!(address && connected)) return;

    (async () => {
      if (!getDegenScore) return;

      const degenScore = await getDegenScore(address);

      client?.track("connected-user-degen-score", address, degenScore);
    })();
  }, [address, client]);

  return (
    <>
      <Outlet />
    </>
  );
};

type LoaderData = {
  network: string;
  explorer: string;
  tokens: Token[];
  rpcUrls: {
    solana: string;
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

  // Hardcode solana to redirect to ethereum
  if (network === "solana") throw new Error("Solana not supported");

  const { showExperiment } = useContext(SplitContext);

  const notificationSubscription =
    showExperiment("enable-notifications") ?
      <NotificationSubscription
        network={network}
        tokens={tokens}
        colorMap={colors}
      />
      : <></>;

  return (
    <Provider
      network={network}
      tokens={tokens}
      solRpc={rpcUrls.solana}
      walletconnectId={walletconnectId}
    >
      { notificationSubscription }
      <ProviderOutlet />
    </Provider>
  );
}

export { ErrorBoundary };
