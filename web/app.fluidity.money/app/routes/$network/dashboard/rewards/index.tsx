import type { Chain } from "~/util/chainUtils/chains";
import type { IRow } from "~/components/Table";
import type Transaction from "~/types/Transaction";
import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import type { TransactionsLoaderData } from "../../query/userTransactions";
import type { RewardsLoaderData } from "../../query/dashboard/rewards";
import type { UnclaimedRewardsLoaderData } from "../../query/dashboard/unclaimedRewards";

import {
  transactionActivityLabel,
  transactionTimeLabel,
  getAddressExplorerLink,
  getTxExplorerLink,
} from "~/util";
import { motion } from "framer-motion";
import { json } from "@remix-run/node";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { UserRewards } from "./common";
import FluidityFacadeContext from "contexts/FluidityFacade";
import { MintAddress } from "~/types/MintAddress";
import {
  Text,
  Heading,
  numberToMonetaryString,
  ManualCarousel,
  trimAddress,
  LinkButton,
  useViewport,
} from "@fluidity-money/surfing";
import { useContext, useEffect, useState, useMemo } from "react";
import {
  LabelledValue,
  ProviderCard,
  ProviderIcon,
  ToolTipContent,
  useToolTip,
} from "~/components";
import { Table } from "~/components";
import dashboardRewardsStyle from "~/styles/dashboard/rewards.css";
import { useCache } from "~/hooks/useCache";
import config, { colors } from "~/webapp.config.server";
import { format } from "date-fns";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: dashboardRewardsStyle }];
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const { network } = params;

  const icons = config.provider_icons;

  const url = new URL(request.url);
  const _pageStr = url.searchParams.get("page");
  const _pageUnsafe = _pageStr ? parseInt(_pageStr) : 1;
  const txTablePage = _pageUnsafe > 0 ? _pageUnsafe : 1;

  return json({
    network,
    icons,
    page: txTablePage,
    colors: (await colors)[network as string],
  });
};

type LoaderData = {
  network: Chain;
  icons: { [provider: string]: string };
  page: number;
  colors: {
    [symbol: string]: string;
  };
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

type CacheData = RewardsLoaderData &
  TransactionsLoaderData &
  Partial<UnclaimedRewardsLoaderData>;

const SAFE_DEFAULT: CacheData = {
  // Only used in Rewards
  count: 0,
  network: "ethereum",
  fluidTokenMap: {},
  transactions: [],
  totalPrizePool: 0,
  page: 0,
  loaded: false,
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
  rewards: {
    day: [],
    week: [],
    month: [],
    year: [],
    all: [],
  },
};

export default function Rewards() {
  const { network, page, colors } = useLoaderData<LoaderData>();

  const { data: rewardsData } = useCache<RewardsLoaderData>(
    `/${network}/query/dashboard/rewards`
  );

  const isFirstLoad = !rewardsData;

  const { data: globalTransactionsData } = useCache<TransactionsLoaderData>(
    `/${network}/query/winningUserTransactions?page=${page}`
  );

  const { connected, address, tokens } = useContext(FluidityFacadeContext);

  const userRewardsData = useFetcher<RewardsLoaderData>();

  const userTransactionsData = useFetcher<TransactionsLoaderData>();

  const userUnclaimedRewardsData = useFetcher<UnclaimedRewardsLoaderData>();

  useEffect(() => {
    if (!address) return;

    userRewardsData.load(
      `/${network}/query/dashboard/rewards?address=${address}`
    );

    userTransactionsData.load(
      `/${network}/query/winningUserTransactions?page=${page}&address=${address}`
    );

    userUnclaimedRewardsData.load(
      `/${network}/query/dashboard/unclaimedRewards?address=${address}&page=${page}`
    );
  }, [address, page]);

  const [userFluidPairs, setUserFluidPairs] = useState(SAFE_DEFAULT.fluidPairs);

  const data: { user: CacheData; global: CacheData } = {
    global: {
      ...SAFE_DEFAULT,
      ...rewardsData,
      ...globalTransactionsData,
    },
    user: {
      ...SAFE_DEFAULT,
      ...userRewardsData.data,
      ...userTransactionsData.data,
      ...userUnclaimedRewardsData.data,
      fluidPairs: userFluidPairs,
    },
  };

  useEffect(() => {
    if (!connected) return;

    (async () => {
      const fluidTokens = await tokens?.();

      setUserFluidPairs(fluidTokens?.length || 0);
    })();
  }, [connected]);

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
            name: "REWARDED TIME",
            alignRight: true,
          },
        ];

  const [activeTableFilterIndex, setActiveTableFilterIndex] = useState(0);

  const txTableFilters = address
    ? [
        {
          filter: () => true,
          name: "GLOBAL",
        },
        {
          filter: ({ sender, receiver }: Transaction) =>
            [sender, receiver].includes(address),
          name: "MY REWARDS",
        },
      ]
    : [
        {
          filter: () => true,
          name: "GLOBAL",
        },
      ];

  useEffect(() => {
    setActiveTableFilterIndex(connected ? 1 : 0);
  }, [connected]);

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

  // Filter Transactions via rewards filter / tx type filters
  const {
    count,
    hasRewarders,
    fluidPairs,
    networkFee,
    gasFee,
    transactions,
    rewarders,
    activeYield,
    totalPrizePool,
    timestamp,
    userUnclaimedRewards,
    unclaimedTokenAddrs,
    weeklyRewards,
  } = useMemo(() => {
    const {
      fluidPairs,
      networkFee,
      gasFee,
      transactions,
      totalPrizePool,
      timestamp,
      rewarders,
      rewards,
      userUnclaimedRewards,
      unclaimedTokenAddrs,
    } = activeTableFilterIndex ? data.user : data.global;

    const {
      week: weeklyYield,
      month: monthlyYield,
      year: yearlyYield,
      all: allYield,
    } = rewards;

    const {
      week: weeklyRewards,
      month: monthlyRewards,
      year: yearlyRewards,
      all: allRewards,
    } = rewarders;

    const [activeRewards, activeYield] = (() => {
      switch (activeRewardFilterIndex) {
        case 1:
          return [weeklyRewards, weeklyYield];
        case 2:
          return [monthlyRewards, monthlyYield];
        case 3:
          return [yearlyRewards, yearlyYield];
        case 0:
        default:
          return [allRewards, allYield];
      }
    })();

    const hasRewarders = !!activeRewards.length;

    return {
      count: allYield.length ? allYield[0].count : 0,
      hasRewarders,
      fluidPairs,
      networkFee,
      gasFee,
      transactions,
      rewarders: activeRewards,
      timestamp,
      activeYield: activeYield.length ? activeYield[0].total_reward : 0,
      totalPrizePool,
      userUnclaimedRewards,
      unclaimedTokenAddrs,
      weeklyRewards,
    };
  }, [
    activeTableFilterIndex,
    activeRewardFilterIndex,
    rewardsData?.timestamp,
    globalTransactionsData?.page,
    userRewardsData.state,
    userTransactionsData.state,
    userUnclaimedRewardsData.state,
  ]);

  const TransactionRow = (chain: Chain): IRow<Transaction> =>
    function Row({ data, index }: { data: Transaction; index: number }) {
      const {
        winner,
        timestamp,
        value,
        reward,
        hash,
        rewardHash,
        logo,
        currency,
      } = data;

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
              <Text>{transactionActivityLabel(data, winner)}</Text>
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
            {reward ? (
              <a
                className="table-address"
                onClick={() =>
                  handleRewardTransactionClick(
                    network,
                    currency,
                    logo,
                    rewardHash
                  )
                }
              >
                <Text prominent={true}>
                  {reward ? numberToMonetaryString(reward) : "-"}
                </Text>
              </a>
            ) : (
              <Text>-</Text>
            )}
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
      {!!userUnclaimedRewards && userUnclaimedRewards > 0.000005 ? (
        <UserRewards
          claimNow={mobileView}
          unclaimedRewards={userUnclaimedRewards}
          claimedRewards={activeYield}
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
          {activeTableFilterIndex ? "My" : "Global"} Reward Performance
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
            {isFirstLoad || !timestamp
              ? "Loading data..."
              : `Last updated: ${format(timestamp, "dd-MM-yyyy HH:mm:ss")}`}
          </Text>
        </div>
        <div className="statistics-row">
          <div className="statistics-set">
            <LabelledValue
              label={`${activeTableFilterIndex ? "My" : "Total"} claimed yield`}
            >
              {numberToMonetaryString(activeYield)}
            </LabelledValue>
          </div>

          {hasRewarders && (
            <div className="statistics-set">
              <LabelledValue label={"Highest performer"}>
                <div className="highest-performer-child">
                  <ProviderIcon provider={rewarders[0]?.name} />
                  {rewarders[0]?.name === "Fluidity"
                    ? "Transacting ƒAssets"
                    : rewarders[0]?.name}
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
            <Link to={`/${network}/fluidify`}>
              <LinkButton
                size="medium"
                type="internal"
                handleClick={() => {
                  return;
                }}
              >
                Create Assets
              </LinkButton>
            </Link>
          </div>
        </div>
      </section>

      <section id="table">
        <Table
          itemName="rewards"
          headings={txTableColumns}
          pagination={{
            page,
            rowsPerPage: 12,
          }}
          count={count}
          data={transactions}
          renderRow={TransactionRow(network)}
          filters={txTableFilters}
          onFilter={setActiveTableFilterIndex}
          activeFilterIndex={activeTableFilterIndex}
          loaded={
            activeTableFilterIndex
              ? userTransactionsData.data?.loaded
              : globalTransactionsData?.loaded
          }
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
              {rewarders.map((rewarder) => (
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
