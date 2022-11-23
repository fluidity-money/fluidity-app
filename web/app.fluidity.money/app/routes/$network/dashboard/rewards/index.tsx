import type { Provider } from "~/components/ProviderCard";
import type { Chain } from "~/util/chainUtils/chains";
import type { UserUnclaimedReward } from "~/queries/useUserUnclaimedRewards";
import type { Winner } from "~/queries/useUserRewards";
import type { UserTransaction } from "~/routes/$network/query/userTransactions";
import type { IRow } from "~/components/Table";
import type Transaction from "~/types/Transaction";

import {
  transactionActivityLabel,
  transactionTimeLabel,
  getAddressExplorerLink,
  getTxExplorerLink,
} from "~/util";
import { JsonRpcProvider } from "@ethersproject/providers";
import RewardAbi from "~/util/chainUtils/ethereum/RewardPool.json";
import { getTotalPrizePool } from "~/util/chainUtils/ethereum/transaction";
import { motion } from "framer-motion";
import { LinksFunction, LoaderFunction, json } from "@remix-run/node";
import config from "~/webapp.config.server";
import useViewport from "~/hooks/useViewport";
import { captureException } from "@sentry/react";
import { useUserUnclaimedRewards, useUserRewards } from "~/queries";
import { useLoaderData, useLocation } from "@remix-run/react";
import { UserRewards } from "./common";
import FluidityFacadeContext from "contexts/FluidityFacade";
import { MintAddress } from "~/types/MintAddress";
import {
  Text,
  Heading,
  numberToMonetaryString,
  ManualCarousel,
  trimAddress,
} from "@fluidity-money/surfing";
import { useContext, useEffect, useState } from "react";
import { LabelledValue, ProviderCard, ProviderIcon } from "~/components";
import { Table } from "~/components";
import useGlobalRewardStatistics from "~/queries/useGlobalRewardStatistics";
import { Providers } from "~/components/ProviderIcon";
import dashboardRewardsStyle from "~/styles/dashboard/rewards.css";

export const unstable_shouldReload = () => false;

export const loader: LoaderFunction = async ({ request, params }) => {
  const network = params.network ?? "";
  const icons = config.provider_icons;
  const fluidPairs = config.config[network ?? ""].fluidAssets.length;

  const networkFee = 0.002;
  const gasFee = 0.002;

  const url = new URL(request.url);
  const _pageStr = url.searchParams.get("page");
  const _pageUnsafe = _pageStr ? parseInt(_pageStr) : 1;
  const page = _pageUnsafe > 0 ? _pageUnsafe : 1;

  try {
    const mainnetId = 0;
    const infuraRpc = config.drivers["ethereum"][mainnetId].rpc.http;

    const provider = new JsonRpcProvider(infuraRpc);

    const rewardPoolAddr = "0xD3E24D732748288ad7e016f93B1dc4F909Af1ba0";

    const totalPrizePool = await getTotalPrizePool(
      provider,
      rewardPoolAddr,
      RewardAbi
    );

    const {
      transactions,
      count,
    }: { transactions: UserTransaction[]; count: number } = await (
      await fetch(
        `${url.origin}/${network}/query/userTransactions?network=${network}&page=${page}`
      )
    ).json();

    const { data, errors } = await useUserRewards(network ?? "");

    if (errors || !data) {
      throw errors;
    }

    const winnersMap = data.winners.reduce(
      (map, winner) => ({
        ...map,
        [winner.transaction_hash]: {
          ...winner,
        },
      }),
      {} as { [key: string]: Winner }
    );

    const {
      config: {
        [network as string]: { tokens },
      },
    } = config;

    const tokenLogoMap = tokens.reduce(
      (map, token) => ({
        ...map,
        [token.symbol]: token.logo,
      }),
      {} as Record<string, string>
    );

    const defaultLogo = "/assets/tokens/usdt.svg";

    const mergedTransactions: Transaction[] =
      transactions
        ?.filter((tx) => !!winnersMap[tx.hash])
        .map((tx) => ({
          sender: tx.sender,
          receiver: tx.receiver,
          winner: winnersMap[tx.hash].winning_address ?? "",
          reward: winnersMap[tx.hash]
            ? winnersMap[tx.hash].winning_amount /
              10 ** winnersMap[tx.hash].token_decimals
            : 0,
          hash: tx.hash,
          currency: tx.currency,
          value:
            tx.currency === "DAI" || tx.currency === "fDAI"
              ? tx.value / 10 ** 12
              : tx.value,
          timestamp: tx.timestamp * 1000,
          logo: tokenLogoMap[tx.currency] || defaultLogo,
        })) ?? [];

    const totalRewards = mergedTransactions.reduce(
      (sum, { reward }) => sum + reward,
      0
    );

    const { data: rewardData, errors: rewardErrors } =
      await useGlobalRewardStatistics(network ?? "");

    if (rewardErrors || !rewardData) {
      throw errors;
    }

    // group rewards by backend
    const aggregatedExpectedRewards = rewardData.expected_rewards.reduce(
      (previous, currentReward) => {
        const {
          highest_reward: prize,
          average_reward: avgPrize,
          token_short_name,
        } = currentReward;
        const backend = backends[token_short_name];

        // append to backend if it exists
        if (previous[backend]) {
          previous[backend].avgPrize += avgPrize;
          // max prize
          previous[backend].prize = Math.max(previous[backend].prize, prize);
          // set backend if it doesn't exist
        } else {
          previous[backend] = {
            name: backend,
            prize,
            avgPrize,
          };
        }
        return previous;
      },
      {} as { [K in Providers]: Provider }
    );

    // convert to expected format
    const rewarders = Object.values(aggregatedExpectedRewards);

    return json({
      icons,
      rewarders,
      page,
      network,
      fluidPairs,
      totalTransactions: mergedTransactions,
      totalCount: count,
      totalRewards,
      totalPrizePool,
      networkFee,
      gasFee,
    });
  } catch (err) {
    console.log(err);
    throw new Error(`Could not fetch Rewards on ${network}: ${err}`);
  } // Fail silently - for now.
};

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: dashboardRewardsStyle }];
};

type LoaderData = {
  icons: { [provider: string]: string };
  rewarders: Provider[];
  totalTransactions: Transaction[];
  totalCount: number;
  totalRewards: number;
  totalPrizePool: number;
  page: number;
  network: Chain;
  fluidPairs: number;
  networkFee: number;
  gasFee: number;
};

function ErrorBoundary() {
  return (
    <div
      className="pad-main"
      style={{
        display: "flex",
        textAlign: "center",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img src="/images/logoMetallic.png" alt="" style={{ height: "40px" }} />
      <h1>Could not load User Rewards!</h1>
      <br />
      <h2>Our team has been notified, and are working on fixing it!</h2>
    </div>
  );
}

export default function Rewards() {
  const {
    fluidPairs,
    network,
    networkFee,
    gasFee,
    rewarders,
    totalTransactions,
    totalCount,
    totalRewards,
    totalPrizePool,
  } = useLoaderData<LoaderData>();

  const { connected, address } = useContext(FluidityFacadeContext);

  const location = useLocation();

  const pageRegex = /page=[0-9]+/gi;
  const _pageMatches = location.search.match(pageRegex);
  const _pageStr = _pageMatches?.length ? _pageMatches[0].split("=")[1] : "";
  const _pageUnsafe = _pageStr ? parseInt(_pageStr) : 1;
  const txTablePage = _pageUnsafe > 0 ? _pageUnsafe : 1;

  const [{ rewards, transactions, count }, setTransactions] = useState<{
    transactions: Transaction[];
    count: number;
    rewards: number;
  }>({
    transactions: totalTransactions,
    count: totalCount,
    rewards: totalRewards,
  });

  const [userUnclaimedRewards, setUserUnclaimedRewards] = useState(0);

  const { width } = useViewport();
  const mobileView = width <= 500;

  const tableBreakpoint = 850;

  const txTableColumns =
    width > 0 && width < tableBreakpoint
      ? [{ name: "ACTIVITY" }, { name: "REWARD" }]
      : [
          {
            name: "ACTIVITY",
          },
          {
            name: "VALUE",
          },
          {
            name: "REWARD",
          },
          {
            name: "WINNER",
          },
          {
            name: "TIME",
            alignRight: true,
          },
        ];

  const [activeTableFilterIndex, setActiveTableFilterIndex] = useState(
    connected ? 1 : 0
  );

  useEffect(() => {
    setActiveTableFilterIndex(connected ? 1 : 0);
  }, [connected]);

  const txTableFilters = address
    ? [
        {
          filter: () => true,
          name: "GLOBAL",
        },
        {
          filter: ({ sender, receiver }: Transaction) =>
            address in [sender, receiver],
          name: "YOUR REWARDS",
        },
      ]
    : [
        {
          filter: () => true,
          name: "GLOBAL",
        },
      ];

  const unixNow = Date.now();

  const [activeRewardFilterIndex, setActiveRewardFilterIndex] = useState(0);

  const rewardFilters = [
    {
      name: "All time",
      filter: () => true,
    },
    {
      name: "Last week",
      filter: ({ timestamp }: Transaction) =>
        timestamp > unixNow - 7 * 24 * 60 * 60 * 1000,
    },
    {
      name: "Last month",
      filter: ({ timestamp }: Transaction) =>
        timestamp > unixNow - 30 * 24 * 60 * 60 * 1000,
    },
    {
      name: "This year",
      filter: ({ timestamp }: Transaction) =>
        timestamp > unixNow - 365 * 24 * 60 * 60 * 1000,
    },
  ];

  const hasRewarders = rewarders.length > 0;

  const bestPerformingRewarders = rewarders.sort(
    ({ prize: prize_a }, { prize: prize_b }) => {
      if (prize_a > prize_b) return -1;
      if (prize_a === prize_b) return 0;
      return 1;
    }
  );

  // Get user's unclaimed rewards
  useEffect(() => {
    if (!connected || !address) return setUserUnclaimedRewards(0);

    // Get Unclaimed Rewards - Expect to fail if Solana
    (async () => {
      try {
        const { data, error } = await useUserUnclaimedRewards(
          network,
          address ?? ""
        );

        if (!data || error) return;

        const { ethereum_pending_winners: rewards } = data;

        const sanitisedRewards = rewards.filter(
          (transaction: UserUnclaimedReward) => !transaction.reward_sent
        );

        const userUnclaimedRewards = sanitisedRewards.reduce(
          (sum: number, transaction: UserUnclaimedReward) => {
            const { win_amount, token_decimals } = transaction;

            const decimals = 10 ** token_decimals;
            return sum + win_amount / decimals;
          },
          0
        );

        setUserUnclaimedRewards(userUnclaimedRewards);
      } catch (err) {
        captureException(
          new Error(
            `Could not fetch Transactions count for ${address}, on ${network}`
          ),
          {
            tags: {
              section: "dashboard",
            },
          }
        );
        return;
      }
    })();
  }, [connected, address]);

  // Filter Transactions via rewards filter / tx type filters
  useEffect(() => {
    const tableFilteredTransactions = totalTransactions
      .filter(rewardFilters[activeRewardFilterIndex].filter)
      .filter(txTableFilters[activeTableFilterIndex].filter);
    const filteredRewards = tableFilteredTransactions.reduce(
      (sum, { reward }) => sum + reward,
      0
    );

    setTransactions({
      count: tableFilteredTransactions.length,
      rewards: filteredRewards,
      transactions: tableFilteredTransactions,
    });
  }, [activeTableFilterIndex, activeRewardFilterIndex]);

  const TransactionRow = (chain: Chain): IRow<Transaction> =>
    function Row({ data, index }: { data: Transaction; index: number }) {
      const { sender, winner, timestamp, value, reward, hash, logo } = data;

      return (
        <motion.tr
          key={`${timestamp}-${index}`}
          variants={{
            enter: { opacity: [0, 1] },
            ready: { opacity: 1 },
            exit: { opacity: 0 },
            transitioning: {
              opacity: [0.75, 1, 0.75],
              transition: { duration: 1.5, repeat: Infinity },
            },
          }}
        >
          {/* Activity */}
          <td>
            <a
              className="table-activity"
              href={getTxExplorerLink(network, hash)}
            >
              <img src={logo} />
              <Text>{transactionActivityLabel(data, sender)}</Text>
            </a>
          </td>

          {/* Value */}
          {width > tableBreakpoint && (
            <td>
              <Text>
                {value.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </Text>
            </td>
          )}

          {/* Reward */}
          <td>
            <Text prominent={true}>
              {reward ? numberToMonetaryString(reward) : "-"}
            </Text>
          </td>

          {/* Winner */}
          {width > tableBreakpoint && (
            <td>
              <a
                className="table-address"
                href={getAddressExplorerLink(chain, winner)}
              >
                <Text>
                  {winner === MintAddress
                    ? "Mint Address"
                    : trimAddress(winner)}
                </Text>
              </a>
            </td>
          )}

          {/* Time */}
          {width > tableBreakpoint && (
            <td>
              <Text>{transactionTimeLabel(timestamp)}</Text>
            </td>
          )}
        </motion.tr>
      );
    };

  return (
    <div className="pad-main">
      {/* Info Cards */}
      {userUnclaimedRewards > 0 ? (
        <UserRewards
          claimNow={mobileView}
          unclaimedRewards={userUnclaimedRewards}
          network={network}
          networkFee={networkFee}
          gasFee={gasFee}
        />
      ) : (
        <div className="no-user-rewards">
          <section id="spend-to-earn">
            <Heading className="spendToEarnHeading" as="h2">
              Spend to earn
            </Heading>
            <Text size="lg">
              Use, send and receive fluid assets <br />
              to generate yield.
            </Text>
          </section>
          <section>
            <Text size="md">Highest reward distribution this week</Text>

            {hasRewarders && (
              <ProviderCard
                name={bestPerformingRewarders[0].name}
                prize={bestPerformingRewarders[0].prize}
                avgPrize={bestPerformingRewarders[0].avgPrize}
                size="lg"
              />
            )}
          </section>
        </div>
      )}
      <div className="reward-ceiling">
        <Heading className="reward-performance" as={mobileView ? "h3" : "h2"}>
          Reward Performance
        </Heading>

        <div className="filter-row">
          {rewardFilters.map((filter, i) => (
            <button
              key={`filter-${filter.name}`}
              onClick={() => setActiveRewardFilterIndex(i)}
            >
              <Text
                size="xl"
                prominent={activeRewardFilterIndex === i}
                className={activeRewardFilterIndex === i ? "active-filter" : ""}
              >
                {filter.name}
              </Text>
            </button>
          ))}
        </div>
      </div>
      {/* Reward Performance */}
      {hasRewarders && (
        <section id="performance">
          <div className="statistics-row">
            <div className="statistics-set">
              <LabelledValue
                label={`${
                  activeTableFilterIndex ? "Your" : "Total"
                } claimed yield`}
              >
                {numberToMonetaryString(rewards)}
              </LabelledValue>
            </div>

            <div className="statistics-set">
              <LabelledValue label={"Highest performer"}>
                <div className="highest-performer-child">
                  <ProviderIcon provider={bestPerformingRewarders[0].name} />
                  {bestPerformingRewarders[0].name}
                </div>
              </LabelledValue>
            </div>

            <div className="statistics-set">
              <LabelledValue label={"Total prize pool"}>
                {numberToMonetaryString(totalPrizePool)}
              </LabelledValue>
            </div>

            <div className="statistics-set">
              <LabelledValue label={"Fluid Pairs"}>{fluidPairs}</LabelledValue>
            </div>
          </div>
        </section>
      )}

      <section id="table">
        <Table
          itemName="rewards"
          headings={txTableColumns}
          pagination={{
            page: txTablePage,
            rowsPerPage: 12,
          }}
          count={count}
          data={transactions}
          renderRow={TransactionRow(network)}
          filters={txTableFilters}
          onFilter={setActiveTableFilterIndex}
          activeFilterIndex={activeTableFilterIndex}
        />
      </section>

      {/* Highest Rewarders */}
      {hasRewarders && (
        <section id="rewarders">
          <Heading className="highest-rewarders" as={"h2"}>
            Highest Rewarders
          </Heading>
          {
            <ManualCarousel scrollBar={true} className="rewards-carousel">
              {bestPerformingRewarders.map((rewarder) => (
                <div className="carousel-card-container" key={rewarder.name}>
                  <ProviderCard
                    name={rewarder.name}
                    prize={rewarder.prize}
                    avgPrize={rewarder.avgPrize}
                    size="md"
                  />
                </div>
              ))}
            </ManualCarousel>
          }
        </section>
      )}
    </div>
  );
}

export { ErrorBoundary };

const backends: { [Token: string]: Providers } = {
  USDC: "Compound",
  USDT: "Compound",
  DAI: "Compound",
  fUSDC: "Compound",
  fUSDT: "Compound",
  fDAI: "Compound",
};
