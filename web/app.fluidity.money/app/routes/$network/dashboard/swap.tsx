import { Token } from "~/util/chainUtils/tokens";
import type AugmentedToken from "~/types/AugmentedToken";
import type { TransactionResponse } from "~/util/chainUtils/instructions";

import { useLoaderData, Link, useSearchParams } from "@remix-run/react";
import BN from "bn.js";
import { getUsdFromTokenAmount } from "~/util/chainUtils/tokens";
import { debounce, DebouncedFunc } from "lodash";
import { useContext, useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import ItemTypes from "~/types/ItemTypes";
import { SplitContext } from "contexts/SplitProvider";
import FluidityFacadeContext from "contexts/FluidityFacade";
// Use touch backend for mobile devices
import { HTML5Backend } from "react-dnd-html5-backend";
import config, { colors } from "~/webapp.config.server";
import {
  Display,
  GeneralButton,
  LinkButton,
  Text,
  useViewport,
  ConnectedWallet,
  ConnectedWalletModal,
  FluidifyCard,
  TabButton,
} from "@fluidity-money/surfing";
import Draggable from "~/components/Draggable";
import ConnectWalletModal from "~/components/ConnectWalletModal";
import SwapCircle from "~/components/Fluidify/SwapCircle";
import FluidifyForm from "~/components/Fluidify/FluidifyForm";
import SwapCompleteModal from "~/components/SwapCompleteModal";
import { captureException } from "@sentry/react";
import { json, LoaderFunction } from "@remix-run/node";
import { Chain, chainType } from "~/util/chainUtils/chains";

type LoaderData = {
  tokens: Token[];
  ethereumWallets: {
    name: string;
    id: string;
    description: string;
    logo: string;
  }[];
  network: Chain;
  colors: {
    [symbol: string]: string;
  };
};

export const loader: LoaderFunction = async ({ params }) => {
  const { network } = params;

  const ethereumWallets = config.config["ethereum"].wallets;

  const {
    config: {
      [network as string]: { tokens },
    },
  } = config;

  const pairedTokenAddrs = new Set();
  tokens.forEach(({ address, isFluidOf }) => {
    if (isFluidOf) {
      pairedTokenAddrs.add(address);
      pairedTokenAddrs.add(isFluidOf);
    }
  });

  return json({
    tokens: tokens.filter(({ address }) => pairedTokenAddrs.has(address)),
    ethereumWallets,
    network,
    colors: (await colors)[network as string],
  } as LoaderData);
};

function ErrorBoundary(error: unknown) {
  console.log(error);

  return (
    <div
      style={{
        paddingTop: "40px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img src="/images/logoMetallic.png" alt="" style={{ height: "40px" }} />
      <h1 style={{ textAlign: "center" }}>Could not find Token to Fluidify!</h1>
    </div>
  );
}

export default function Swap() {
  const {
    network,
    tokens: defaultTokens,
    colors,
  } = useLoaderData<LoaderData>();

  const {
    address,
    rawAddress,
    amountMinted,
    connected,
    connecting,
    disconnect,
    balance,
    addToken,
  } = useContext(FluidityFacadeContext);

  return (
    <h1>Hello, world!</h1>
  );
}

export { ErrorBoundary };
