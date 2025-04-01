import type { Chain } from "~/util/chainUtils/chains";
import type { IRow } from "~/components/Table";
import type Transaction from "~/types/Transaction";

import { json, LinksFunction, LoaderFunction } from "@remix-run/node";
import { format } from "date-fns";
import { MintAddress } from "~/types/MintAddress";
import {
  Display,
  LineChart,
  Text,
  AnchorButton,
  LinkButton,
  trimAddress,
  numberToMonetaryString,
  useViewport,
  Tooltip,
  TabButton,
  toDecimalPlaces,
  ProviderIcon,
  TokenIcon,
  LootBottle,
  Rarity,
} from "@fluidity-money/surfing";
import { useState, useContext, useEffect, useMemo } from "react";
import { useLoaderData, useFetcher, Link } from "@remix-run/react";
import { Table, ToolTipContent, useToolTip, UtilityToken } from "~/components";
import {
  transactionActivityLabel,
  transactionTimeLabel,
  getAddressExplorerLink,
  getTxExplorerLink,
} from "~/util";
import FluidityFacadeContext from "contexts/FluidityFacade";
import dashboardHomeStyle from "~/styles/dashboard/home.css";
import { colors } from "~/webapp.config.server";
import { getProviderDisplayName } from "~/util/provider";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: dashboardHomeStyle }];
};

type LoaderData = {
  page: number;
  network: Chain;
  colors: {
    [symbol: string]: string;
  };
  debug?: boolean;
};

function ErrorBoundary(error: Error) {
  console.log(error);
  return (
    <div
      className="pad-main"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img src="/images/logoMetallic.png" alt="" style={{ height: "40px" }} />
      <h1>Could not fetch transactions!</h1>
    </div>
  );
}

const ADJUSTED_BOTTLE_MULTIPLIER = 12;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const translateRewardTierToRarity = (rewardTier: any): Rarity => {
  switch (rewardTier) {
    case 5:
      return Rarity.Legendary;
    case 4:
      return Rarity.UltraRare;
    case 3:
      return Rarity.Rare;
    case 2:
      return Rarity.Uncommon;
    case 1:
    default:
      return Rarity.Common;
  }
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const { network } = params;
  if (!network) return;

  const url = new URL(request.url);
  const _pageStr = url.searchParams.get("page");
  const _pageUnsafe = _pageStr ? parseInt(_pageStr) : 1;
  const txTablePage = _pageUnsafe > 0 ? _pageUnsafe : 1;
  const debug = url.searchParams.get("debug");

  return json({
    network,
    page: txTablePage,
    colors: (await colors)[network],
    debug,
  });
};

export default function Home() {
  const { network, page, colors, debug } = useLoaderData<LoaderData>();

  const { address, connected, tokens } = useContext(FluidityFacadeContext);

  const useDebug = debug;

  const [totalPrizePool, setTotalPrizePool] = useState(0);

  const userHomeData = useFetcher();
  const userTransactionsData = useFetcher();

  const toolTip = useToolTip();

  const handleRewardTransactionClick = (
    network: Chain,
    currency: string,
    logo: string,
    hash: string
  ) => {
    hash && window.open(getTxExplorerLink(network, hash), "_blank");

    !hash &&
      toolTip.open(
        colors[currency as unknown as string],
        <ToolTipContent
          tokenLogoSrc={logo}
          boldTitle={``}
          details={"⏳ This reward claim is still pending! ⏳"}
        />
      );
  };

  useEffect(() => {
    if (!address) return;

    userHomeData.load(`/${network}/query/dashboard/home?address=${address}`);

    userTransactionsData.load(
      `/${network}/query/userTransactions?page=${page}&address=${address}`
    );
  }, [address, page]);

  // Default to "Y" View
  const [activeTransformerIndex, setActiveTransformerIndex] = useState(3);

  // Default to "Global" View
  const [activeTableFilterIndex, setActiveTableFilterIndex] = useState(0);

  const { width } = useViewport();
  const isSmallMobile = width < 375;

  return (
    <>
        {width < 1200 && (
          <Display
            size={isSmallMobile ? "xxs" : "xs"}
            color="gray"
            className="dashboard-identifier"
          >
            {`${activeTableFilterIndex ? "My" : "Global"} Dashboard`}
          </Display>
        )}
    </>
  );
}

export { ErrorBoundary };
