import type { LoaderFunction } from "@remix-run/node";
import { Outlet, useParams } from "@remix-run/react";
import config from "../../webapp.config.js";
import { redirect } from "@remix-run/node";

import EthereumProvider from "contexts/EthereumProvider";
import SolanaProvider from "contexts/SolanaProvider.js";

import { Fragment } from "react";

type ProviderMap = {
  [key: string]:
    | ((props: { children: React.ReactNode }) => JSX.Element)
    | undefined;
};

const Provider = ({
  network,
  children,
}: {
  network?: string;
  children: React.ReactNode;
}) => {
  const providers: ProviderMap = {
    ethereum: EthereumProvider,
    solana: SolanaProvider,
  };

  const ProviderComponent = (network && providers[network]) || Fragment;

  return <ProviderComponent>{children}</ProviderComponent>;
};

export const loader: LoaderFunction = async ({ params }) => {
  // Prevent unknown network params
  const { network } = params;

  const redirectTarget = redirect("/");

  if (!network) return redirectTarget;

  if (network in config.drivers === false) return redirectTarget;

  return true;
};

export default function Network() {
  const { network } = useParams();
  return (
    <Provider network={network}>
      <Outlet />
    </Provider>
  );
}
