import type { Chain } from "~/util/chainUtils/chains";
import type { UserTransaction } from "~/queries/useUserTransactions";
import { Transaction, Rewarder } from "~/screens/RewardPerformance";

import { useState } from "react";
import { LinksFunction, LoaderFunction, json, redirect } from "@remix-run/node";
import dashboardRewardsStyle from "~/styles/dashboard/rewards.css";
import useViewport from "~/hooks/useViewport";

import { useUserTransactionCount, useUserTransactions } from "~/queries";
import { useLoaderData } from "@remix-run/react";

import UserRewards from "~/screens/UserRewards";
import NoUserRewards from "~/screens/NoUserRewards";
import RewardPerformance from "~/screens/RewardPerformance";
import UnclaimedWinnings from "~/screens/UnclaimedWinnings";

const address = "0xbb9cdbafba1137bdc28440f8f5fbed601a107bb6";

export const loader: LoaderFunction = async ({ request, params }) => {
  const { network } = params;

  const url = new URL(request.url);
  const _pageStr = url.searchParams.get("page");
  const _pageUnsafe = _pageStr ? parseInt(_pageStr) : 1;
  const page = _pageUnsafe > 0 ? _pageUnsafe : 1;

  const {
    data: {
      [network as string]: {
        transfers: [{ count }],
      },
    },
  } = await (await useUserTransactionCount(address)).json();

  const {
    data: {
      [network as string]: { transfers: transactions },
    },
  } = await (await useUserTransactions(address, page)).json();

  // Destructure GraphQL data
  const sanitizedTransactions = transactions.map(
    (transaction: UserTransaction) => {
      const {
        sender: { address: sender },
        receiver: { address: receiver },
        block: {
          timestamp: { unixtime: timestamp },
        },
        amount: value,
        currency: { symbol: currency },
      } = transaction;

      return {
        sender,
        receiver,
        timestamp,
        value,
        currency,
      };
    }
  );

  if (Math.ceil(count / 12) < page && count > 0) {
    return redirect(`./`, 301);
  }

  // Get Best Rewarders - SCOPED OUT NO DATA

  return json({
    rewarders: rewarders,
    transactions: sanitizedTransactions,
    count,
    page,
    network,
  });
};

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: dashboardRewardsStyle }];
};

type LoaderData = {
  transactions: Transaction[];
  count: number;
  page: number;
  rewarders: Rewarder[];
  network: Chain;
};

export default function Rewards() {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [rewards, setUserRewards] = useState(false);
  const { transactions, count, page, rewarders, network } =
    useLoaderData<LoaderData>();

  const { width } = useViewport();
  const mobileView = width <= 375;

  return (
    <>
      {rewards ? (
        <UserRewards
          claimNow={mobileView || showBreakdown}
          showBreakdown={setShowBreakdown}
        />
      ) : (
        <NoUserRewards rewarder={rewarders[2]} />
      )}
      {showBreakdown ? (
        <UnclaimedWinnings
          transactions={transactions.filter(
            (tx) => tx.timestamp > new Date().getTime() - 1000
          )}
          count={count}
          page={page}
          network={network}
        />
      ) : (
        <RewardPerformance
          transactions={transactions}
          count={count}
          page={page}
          network={network}
          rewarders={rewarders}
        />
      )}
    </>
  );
}

const rewarders = [
  {
    iconUrl: "./Solana.svg",
    name: "Solana",
    prize: 351879,
    avgPrize: 1234,
  },
  {
    iconUrl: "./Solana.svg",
    name: "Polygon",
    prize: 351879,
    avgPrize: 1234,
  },
  {
    iconUrl: "./Solana.svg",
    name: "Compound",
    prize: 351879,
    avgPrize: 1234,
  },
  {
    iconUrl: "./Solana.svg",
    name: "Solana",
    prize: 351879,
    avgPrize: 1234,
  },
];
