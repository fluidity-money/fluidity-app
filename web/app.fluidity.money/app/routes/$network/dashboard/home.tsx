import type { Chain } from "~/util/chainUtils/chains";
import type { IRow } from "~/components/Table";
import type Transaction from "~/types/Transaction";
import type { HomeLoaderData } from "~/routes/$network/query/dashboard/home";
import type { TransactionsLoaderData } from "~/routes/$network/query/userTransactions";

import { motion } from "framer-motion";
import { json, LinksFunction, LoaderFunction } from "@remix-run/node";
import { format } from "date-fns";
import { MintAddress } from "~/types/MintAddress";
import { SplitContext } from "contexts/SplitProvider";
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
} from "@fluidity-money/surfing";
import { useState, useContext, useEffect, useMemo } from "react";
import { useLoaderData, useFetcher, Link } from "@remix-run/react";
import { Table, ToolTipContent, useToolTip } from "~/components";
import {
  transactionActivityLabel,
  transactionTimeLabel,
  getAddressExplorerLink,
  getTxExplorerLink,
} from "~/util";
import FluidityFacadeContext from "contexts/FluidityFacade";
import dashboardHomeStyle from "~/styles/dashboard/home.css";
import { useCache } from "~/hooks/useCache";
import { colors } from "~/webapp.config.server";
import { GraphEntry } from "~/queries/useGraphData";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: dashboardHomeStyle }];
};

type LoaderData = {
  page: number;
  network: Chain;
  colors: {
    [symbol: string]: string;
  };
};

type CacheData = {
  home: HomeLoaderData;
  transactions: TransactionsLoaderData;
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

const SAFE_DEFAULT_HOME: HomeLoaderData = {
  network: "ethereum",
  loaded: false,
  graph: {
    day: [],
    week: [],
    month: [],
    year: [],
  },
  rewards: {
    day: [],
    week: [],
    month: [],
    year: [],
    all: [],
  },
  volumeStats: {
    day: [{ totalVolume: 0, actionCount: 0 }],
    week: [{ totalVolume: 0, actionCount: 0 }],
    month: [{ totalVolume: 0, actionCount: 0 }],
    year: [{ totalVolume: 0, actionCount: 0 }],
    all: [{ totalVolume: 0, actionCount: 0 }],
  },
  totalFluidPairs: 0,
  timestamp: 0,
};

const SAFE_DEFAULT_TRANSACTIONS: TransactionsLoaderData = {
  count: 0,
  page: 0,
  transactions: [],
  loaded: false,
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const { network } = params;
  if (!network) return;

  const url = new URL(request.url);
  const _pageStr = url.searchParams.get("page");
  const _pageUnsafe = _pageStr ? parseInt(_pageStr) : 1;
  const txTablePage = _pageUnsafe > 0 ? _pageUnsafe : 1;

  return json({
    network,
    page: txTablePage,
    colors: (await colors)[network],
  });
};

export default function Home() {
  const { network, page, colors } = useLoaderData<LoaderData>();

  const { address, connected, tokens } = useContext(FluidityFacadeContext);

  const { showExperiment } = useContext(SplitContext);

  const { data: homeData } = useCache<HomeLoaderData>(
    `/${network}/query/dashboard/home`
  );
  const isFirstLoad = !homeData;

  const { data: globalTransactionsData } = useCache<TransactionsLoaderData>(
    `/${network}/query/userTransactions?page=${page}`
  );

  const [totalPrizePool, setTotalPrizePool] = useState(0);

  const userHomeData = useFetcher();
  const userTransactionsData = useFetcher();
  const prizePoolData = useFetcher();

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
    prizePoolData.load(`/${network}/query/dashboard/prizePool`);
  }, []);

  useEffect(() => {
    if (!address) return;

    userHomeData.load(`/${network}/query/dashboard/home?address=${address}`);

    userTransactionsData.load(
      `/${network}/query/userTransactions?page=${page}&address=${address}`
    );
  }, [address, page]);

  useEffect(() => {
    if (prizePoolData?.data)
      setTotalPrizePool(prizePoolData?.data.totalPrizePool);
  }, [prizePoolData]);

  const [userFluidPairs, setUserFluidPairs] = useState(
    SAFE_DEFAULT_HOME.totalFluidPairs
  );

  const data: {
    global: CacheData;
    user: CacheData;
  } = {
    global: {
      home: {
        ...SAFE_DEFAULT_HOME,
        ...homeData,
      },
      transactions: {
        ...SAFE_DEFAULT_TRANSACTIONS,
        ...globalTransactionsData,
      },
    },
    user: {
      home: {
        ...SAFE_DEFAULT_HOME,
        ...userHomeData.data,
        totalFluidPairs: userFluidPairs,
      },
      transactions: {
        ...SAFE_DEFAULT_TRANSACTIONS,
        ...userTransactionsData.data,
      },
    },
  };

  useEffect(() => {
    if (!connected) return;

    (async () => {
      const fluidTokens = await tokens?.();

      setUserFluidPairs(fluidTokens?.length || 0);
    })();
  }, [connected]);

  // Default to "Y" View
  const [activeTransformerIndex, setActiveTransformerIndex] = useState(3);

  // Default to "Global" View
  const [activeTableFilterIndex, setActiveTableFilterIndex] = useState(0);

  // If connected, default to "My Dashboard" View
  useEffect(() => {
    setActiveTableFilterIndex(connected ? 1 : 0);
  }, [connected]);

  const { width } = useViewport();
  const isTablet = width < 850 && width > 0;
  const isMobile = width < 500 && width > 0;
  const isSmallMobile = width < 375;

  const txTableColumns = (() => {
    switch (true) {
      case isSmallMobile:
        return [{ name: "ACTIVITY" }, { name: "VALUE" }];
      case isMobile:
        return [{ name: "ACTIVITY" }, { name: "VALUE" }, { name: "ACCOUNT" }];
      case isTablet:
        return [
          { name: "ACTIVITY" },
          { name: "VALUE" },
          { name: "FLUID REWARDS" },
          { name: "$WOM REWARDS" },
          { name: "ACCOUNT" },
        ];
      default:
        return [
          { name: "ACTIVITY" },
          { name: "VALUE" },
          { name: "FLUID REWARDS" },
          { name: "$WOM REWARDS" },
          { name: "ACCOUNT" },
          { name: "TIME", alignRight: true },
        ];
    }
  })();

  const txTableFilters = address
    ? [
        {
          filter: () => true,
          name: "GLOBAL",
        },
        {
          filter: ({
            sender,
            receiver,
          }: {
            sender: string;
            receiver: string;
          }) => [sender, receiver].includes(address),
          name: "MY DASHBOARD",
        },
      ]
    : [
        {
          filter: () => true,
          name: "GLOBAL",
        },
      ];

  const {
    count,
    totalCount,
    rewards,
    volume,
    transactions,
    graph,
    fluidPairs,
    timestamp,
    txLoaded,
  } = useMemo(() => {
    const { home, transactions: txData } = activeTableFilterIndex
      ? data.user
      : data.global;

    const {
      volumeStats,
      rewards,
      graph,
      totalFluidPairs,
      timestamp,
      loaded: homeLoaded,
    } = home;

    const { transactions, loaded: txLoaded } = txData;

    const {
      day: dailyRewards,
      week: weeklyRewards,
      month: monthlyRewards,
      year: yearlyRewards,
    } = rewards;

    const activeRewards = (() => {
      switch (activeTransformerIndex) {
        case 0:
          return dailyRewards;
        case 1:
          return weeklyRewards;
        case 2:
          return monthlyRewards;
        case 3:
        default:
          return yearlyRewards;
      }
    })();

    const [{ actionCount: transactionCount }] = volumeStats.all;
    const [
      { totalVolume: filteredVolume, actionCount: filteredTransactionCount },
    ] = Object.values(volumeStats)[activeTransformerIndex];

    return {
      count: filteredTransactionCount,
      totalCount: transactionCount,
      rewards: activeRewards,
      volume: filteredVolume,
      transactions,
      graph,
      fluidPairs: totalFluidPairs,
      timestamp,
      homeLoaded,
      txLoaded,
    };
  }, [
    activeTableFilterIndex,
    activeTransformerIndex,
    userHomeData.state,
    userTransactionsData.state,
    homeData?.timestamp,
    globalTransactionsData?.page,
  ]);

  const TransactionRow = (chain: Chain): IRow<Transaction> =>
    function Row({ data, index }: { data: Transaction; index: number }) {
      const {
        sender,
        timestamp,
        value,
        reward,
        hash,
        rewardHash,
        currency,
        logo,
        wombatTokens,
      } = data;

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
          <td>
            <Text>{numberToMonetaryString(value)}</Text>
          </td>

          {/* Reward */}
          {!isMobile && (
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
          )}

          {/* WOM */}
          {!isMobile && (
            <td>
              {wombatTokens ? (
                <a
                  className="table-token"
                  onClick={() =>
                    handleRewardTransactionClick(
                      network,
                      currency,
                      logo,
                      rewardHash
                    )
                  }
                >
                  <img src="/images/providers/wombat.svg" />
                  <Text>{toDecimalPlaces(wombatTokens, 4)}</Text>
                </a>
              ) : (
                <Text>-</Text>
              )}
            </td>
          )}

          {/* Account */}
          {!isSmallMobile && (
            <td>
              <a
                className="table-address"
                href={getAddressExplorerLink(chain, sender)}
              >
                <Text>
                  {sender === MintAddress
                    ? "Mint Address"
                    : trimAddress(sender)}
                </Text>
              </a>
            </td>
          )}

          {/* Time */}
          {!isTablet && (
            <td>
              <Text>{transactionTimeLabel(timestamp)}</Text>
            </td>
          )}
        </motion.tr>
      );
    };

  return (
    <>
      {/* Timestamp */}
      <div className="pad-main top-text">
        <Text>
          {isFirstLoad || !timestamp
            ? "Loading data..."
            : `Last updated: ${format(timestamp, "dd-MM-yyyy HH:mm:ss")}`}
        </Text>
        {width < 1200 && (
          <Display
            size={isSmallMobile ? "xxs" : "xs"}
            color="gray"
            className="dashboard-identifier"
          >
            {`${activeTableFilterIndex ? "My" : "Global"} Dashboard`}
          </Display>
        )}
      </div>

      <section id="graph">
        <div className="graph-ceiling pad-main">
          {/* Statistics */}
          <div className="overlay">
            {/* Column 1 */}
            <div className="totals-column">
              {/* Rewards */}
              <div className="statistics-set">
                <Text>
                  {activeTableFilterIndex
                    ? "My yield"
                    : showExperiment("weekly-available-rewards")
                    ? "Weekly available rewards"
                    : "Total yield"}
                </Text>
                <Display
                  size={width < 500 && width > 0 ? "xxxs" : "xxs"}
                  style={{ margin: 0 }}
                >
                  {numberToMonetaryString(
                    activeTableFilterIndex ||
                      !showExperiment("weekly-available-rewards")
                      ? rewards.find(
                          ({ network: rewardNetwork }) =>
                            rewardNetwork === network
                        )?.total_reward || 0
                      : totalPrizePool / 52
                  )}
                </Display>
                <Link to={`/${network}/dashboard/rewards`}>
                  <LinkButton
                    size="medium"
                    type="internal"
                    handleClick={() => {
                      return;
                    }}
                  >
                    Rewards
                  </LinkButton>
                </Link>
              </div>

              {/* Transactions Volume / Count */}
              <div className="statistics-set">
                <Text>
                  {activeTableFilterIndex ? "My" : "Total"} transactions
                </Text>
                <Display
                  size={width < 500 && width > 0 ? "xxxs" : "xxs"}
                  style={{ margin: 0 }}
                >
                  {count}
                </Display>
                {!!count && (
                  <AnchorButton>
                    <a href="#transactions">Activity</a>
                  </AnchorButton>
                )}
              </div>
            </div>

            {/* Column 2 */}
            <div className="totals-column">
              {/* Prize Pool */}
              <div className="statistics-set">
                <Text>
                  {showExperiment("weekly-available-rewards") ? "Total " : ""}
                  Prize Pool
                </Text>
                <Display
                  size={width < 500 && width > 0 ? "xxxs" : "xxs"}
                  style={{ margin: 0 }}
                >
                  {totalPrizePool
                    ? numberToMonetaryString(totalPrizePool)
                    : "Loading..."}
                </Display>
              </div>
              {activeTableFilterIndex === 0 ? (
                <div className="statistics-set">
                  <Text>Total volume</Text>
                  <Display
                    size={width < 500 && width > 0 ? "xxxs" : "xxs"}
                    style={{ margin: 0 }}
                  >
                    {numberToMonetaryString(volume)}
                  </Display>
                </div>
              ) : (
                <div className="statistics-set">
                  <Text>Fluid assets</Text>
                  <Display
                    size={width < 500 && width > 0 ? "xxxs" : "xxs"}
                    style={{ margin: 0 }}
                  >
                    {fluidPairs}
                  </Display>
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
              )}
            </div>

            {/* Column 3 */}
            {activeTableFilterIndex === 0 && (
              <div className="totals-column">
                <div className="statistics-set">
                  <Text>Fluid assets</Text>
                  <Display
                    size={width < 500 && width > 0 ? "xxxs" : "xxs"}
                    style={{ margin: 0 }}
                  >
                    {fluidPairs}
                  </Display>
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
            )}
            {/* Fluid Pairs */}
          </div>

          {/* Graph Filter Row */}
          {width > 1200 && (
            <Display
              size={width < 1010 ? "xxs" : "xs"}
              color="gray"
              className="dashboard-identifier"
            >
              {`${activeTableFilterIndex ? "My" : "Global"} Dashboard`}
            </Display>
          )}
        </div>

        {/* Graph */}
        <div
          className="graph"
          style={{ width: "100%", height: "400px", mixBlendMode: "screen" }}
        >
          <div className="statistics-row pad-main">
            {["D", "W", "M", "Y"].map((filter, i) => (
              <TabButton
                key={`filter-${filter}`}
                onClick={() => setActiveTransformerIndex(i)}
                size="default"
              >
                <Text
                  size="sm"
                  prominent={activeTransformerIndex === i}
                  className={
                    activeTransformerIndex === i ? "active-filter" : ""
                  }
                >
                  {filter}
                </Text>
              </TabButton>
            ))}
          </div>
          <LineChart
            data={Object.values(graph)[activeTransformerIndex].map((tx, i) => ({
              ...tx,
              x: i,
            }))}
            lineLabel="transactions"
            accessors={{
              xAccessor: (d: GraphEntry & { x: number }) => d.x,
              yAccessor: (d: GraphEntry & { x: number }) =>
                d.amount ? Math.log(d.amount + 1) : 0,
            }}
            renderTooltip={({ datum }: { datum: GraphEntry }) => {
              return datum.amount > 0 ? (
                <Tooltip
                  style={{
                    minWidth: 160,
                    gap: "0.4em",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text>
                    {format(new Date(datum.time).getTime(), "dd/MM/yy")}
                  </Text>
                  <div>
                    <Text prominent>
                      {datum.sender_address === MintAddress
                        ? "Mint Address"
                        : trimAddress(datum.sender_address)}
                    </Text>
                  </div>
                  <div>
                    <Text prominent>
                      {numberToMonetaryString(datum.amount)}
                    </Text>
                    <Text> swapped</Text>
                  </div>
                </Tooltip>
              ) : (
                <></>
              );
            }}
          />
        </div>
      </section>

      <section id="transactions" className="pad-main">
        <Table
          itemName="transactions"
          headings={txTableColumns}
          pagination={{
            page,
            rowsPerPage: 12,
          }}
          count={totalCount}
          data={transactions}
          renderRow={TransactionRow(network)}
          onFilter={setActiveTableFilterIndex}
          activeFilterIndex={activeTableFilterIndex}
          filters={txTableFilters}
          loaded={txLoaded}
        />
      </section>
    </>
  );
}

export { ErrorBoundary };
