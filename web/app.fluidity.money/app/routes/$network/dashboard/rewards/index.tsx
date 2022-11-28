import type { Provider } from "~/components/ProviderCard";
import type { Chain } from "~/util/chainUtils/chains";
import type { UserUnclaimedReward } from "~/queries/useUserUnclaimedRewards";

import type { IRow } from "~/components/Table";
import type Transaction from "~/types/Transaction";

import {
  transactionActivityLabel,
  transactionTimeLabel,
  getAddressExplorerLink,
  getTxExplorerLink,
} from "~/util";
import { motion } from "framer-motion";
import { json, LinksFunction, LoaderFunction } from "@remix-run/node";
import useViewport from "~/hooks/useViewport";
import { captureException } from "@sentry/react";
import { useUserUnclaimedRewards } from "~/queries";
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
import { useContext, useEffect, useState, useMemo } from "react";
import { LabelledValue, ProviderCard, ProviderIcon } from "~/components";
import { Table } from "~/components";
import dashboardRewardsStyle from "~/styles/dashboard/rewards.css";
import { useCache } from "~/hooks/useCache";
import config from "~/webapp.config.server";
import { format } from "date-fns";
import { Rewarders } from "~/util/rewardAggregates";

export const unstable_shouldReload = () => false;

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: dashboardRewardsStyle }];
};

export const loader: LoaderFunction = async ({ params }) => {
  const { network } = params;

  const icons = config.provider_icons;

  return json({
    network,
    icons,
  });
};

type LoaderData = {
  network: Chain;
  icons: { [provider: string]: string };
};

type ExLoaderData = {
  fluidTokenMap: { [tokenName: string]: string };
  totalTransactions: Transaction[];
  totalCount: number;
  totalRewards: number;
  totalPrizePool: number;
  totalRewarders: Provider[];
  page: number;
  fluidPairs: number;
  networkFee: number;
  gasFee: number;
  timestamp: number;
  rewarders: Rewarders;
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
  const { network } = useLoaderData<LoaderData>();

  const { data: loaderData } = useCache<ExLoaderData>(
    `/${network}/query/dashboard/home`
  );

  const defaultData = {
    icons: {},
    fluidTokenMap: {},
    highestWeeklyRewarder: undefined,
    totalTransactions: [],
    totalCount: 0,
    totalRewards: 0,
    totalPrizePool: 0,
    totalRewarders: [],
    page: 0,
    fluidPairs: 0,
    networkFee: 0,
    gasFee: 0,
    timestamp: 0,
    rewarders: {
      week: [],
      month: [],
      year: [],
      all: [],
    },
  };

  const data: ExLoaderData = {
    ...defaultData,
    ...loaderData,
  };

  const {
    fluidPairs,
    networkFee,
    gasFee,
    totalTransactions,
    totalCount,
    totalRewards,
    totalPrizePool,
    totalRewarders,
    fluidTokenMap,
    timestamp,
    rewarders,
  } = data;

  const {
    week: weeklyRewards,
    month: monthlyRewards,
    year: yearlyRewards,
    all: allRewards,
  } = rewarders;
  const { connected, address } = useContext(FluidityFacadeContext);

  const location = useLocation();

  const pageRegex = /page=[0-9]+/gi;
  const _pageMatches = location.search.match(pageRegex);
  const _pageStr = _pageMatches?.length ? _pageMatches[0].split("=")[1] : "";
  const _pageUnsafe = _pageStr ? parseInt(_pageStr) : 1;
  const txTablePage = _pageUnsafe > 0 ? _pageUnsafe : 1;

  console.log("timestamp", timestamp);

  const [{ rewards, transactions, count }, setTransactions] = useState<{
    transactions: Transaction[];
    count: number;
    rewards: number;
    rewarders: Provider[];
  }>({
    transactions: totalTransactions,
    count: totalCount,
    rewards: totalRewards,
    rewarders: totalRewarders,
  });

  const { width } = useViewport();
  const mobileView = width <= 500 && width > 0;

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

  const txTableFilters = address
    ? [
        {
          filter: () => true,
          name: "GLOBAL",
        },
        {
          filter: ({ sender, receiver }: Transaction) =>
            [sender, receiver].includes(address),
          name: "YOUR REWARDS",
        },
      ]
    : [
        {
          filter: () => true,
          name: "GLOBAL",
        },
      ];

  const [
    { userUnclaimedRewards, unclaimedTokenAddrs },
    setUserUnclaimedRewards,
  ] = useState<{
    userUnclaimedRewards: number;
    unclaimedTokenAddrs: string[];
  }>({
    userUnclaimedRewards: 0,
    unclaimedTokenAddrs: [],
  });

  useEffect(() => {
    setActiveTableFilterIndex(connected ? 1 : 0);
  }, [connected]);

  const userTotalRewards = useMemo(
    () =>
      address
        ? transactions
            .filter(txTableFilters[1].filter)
            .reduce((sum, { reward }) => sum + reward, 0)
        : 0,
    [address, loaderData]
  );

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

  const hasRewarders = allRewards.length > 0;

  // update bestPerformingRewarders based on the selected time interval
  const [bestPerformingRewarders, setBestPerformingRewarders] =
    useState<Provider[]>(allRewards);

  const activeRewards = (() => {
    switch (activeRewardFilterIndex) {
      case 0:
      default:
        return allRewards;
      case 1:
        return weeklyRewards;
      case 2:
        return monthlyRewards;
      case 3:
        return yearlyRewards;
    }
  })();

  useEffect(() => {
    setBestPerformingRewarders(
      activeRewards.sort(({ prize: prize_a }, { prize: prize_b }) => {
        if (prize_a > prize_b) return -1;
        if (prize_a === prize_b) return 0;
        return 1;
      })
    );
  }, [activeRewardFilterIndex]);

  // Get user's unclaimed rewards
  useEffect(() => {
    if (!connected || !address) return;

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

        const unclaimedTokenAddrs = Array.from(
          new Set(
            sanitisedRewards.map(({ token_short_name }) => token_short_name)
          )
        ).map((name) => fluidTokenMap[name] ?? "");

        setUserUnclaimedRewards({ userUnclaimedRewards, unclaimedTokenAddrs });
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
  }, [connected, address, useLoaderData]);

  // Filter Transactions via rewards filter / tx type filters
  useEffect(() => {
    const timeFilteredTransactions = totalTransactions.filter(
      rewardFilters[activeRewardFilterIndex].filter
    );

    const userFilteredTransactions = timeFilteredTransactions.filter(
      txTableFilters[activeTableFilterIndex].filter
    );

    const filteredRewards = userFilteredTransactions.reduce(
      (sum, { reward }) => sum + reward,
      0
    );

    const filteredRewarders = Object.values(
      timeFilteredTransactions.reduce((map, tx) => {
        const provider = map[tx.provider];

        return {
          ...map,
          [tx.provider]: provider
            ? {
                ...provider,
                count: provider.count + 1,
                prize: provider.prize + tx.reward,
              }
            : {
                name: tx.provider,
                count: 1,
                prize: tx.reward,
              },
        };
      }, {} as { [providerName: string]: { name: string; count: number; prize: number } })
    )
      .map(({ count, ...provider }) => ({
        ...provider,
        avgPrize: provider.prize / count,
      }))
      .sort(({ avgPrize: avgPrizeA }, { avgPrize: avgPrizeB }) =>
        avgPrizeA > avgPrizeB ? -1 : avgPrizeA === avgPrizeB ? 0 : 1
      ) as Provider[];

    setTransactions({
      count: userFilteredTransactions.length,
      rewards: filteredRewards,
      rewarders: filteredRewarders,
      transactions: userFilteredTransactions,
    });
  }, [activeTableFilterIndex, activeRewardFilterIndex, loaderData]);

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

  const isFirstLoad = !loaderData;

  return (
    <div className="pad-main">
      {/* Info Cards */}
      {userUnclaimedRewards > 0 ? (
        <UserRewards
          claimNow={mobileView}
          unclaimedRewards={userUnclaimedRewards}
          claimedRewards={userTotalRewards}
          network={network}
          networkFee={networkFee}
          gasFee={gasFee}
          tokenAddrs={unclaimedTokenAddrs}
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
            {weeklyRewards?.length > 0 && (
              <>
                <Text size="md">Highest reward distribution this week</Text>

                <ProviderCard
                  name={weeklyRewards[0].name}
                  prize={weeklyRewards[0].prize}
                  avgPrize={weeklyRewards[0].avgPrize}
                  size="lg"
                />
              </>
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
      <section id="performance">
        <div style={{ marginBottom: "12px" }}>
          <Text>
            {isFirstLoad
              ? "Loading data..."
              : `Last updated ${format(timestamp, "dd-MM-yyyy HH:mm:ss")}`}
          </Text>
        </div>
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

          {hasRewarders && (
            <div className="statistics-set">
              <LabelledValue label={"Highest performer"}>
                <div className="highest-performer-child">
                  <ProviderIcon provider={bestPerformingRewarders[0].name} />
                  {bestPerformingRewarders[0].name}
                </div>
              </LabelledValue>
            </div>
          )}

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
