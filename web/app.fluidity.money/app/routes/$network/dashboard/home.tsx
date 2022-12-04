import type { Chain } from "~/util/chainUtils/chains";
import type { IRow } from "~/components/Table";
import type Transaction from "~/types/Transaction";
import type { HomeLoader } from "../query/dashboard/home";
import type { TransactionsLoader } from "../query/userTransactions";

import { motion } from "framer-motion";
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
} from "@fluidity-money/surfing";
import useViewport from "~/hooks/useViewport";
import { useState, useContext, useEffect } from "react";
import { useLoaderData, useNavigate, useFetcher } from "@remix-run/react";
import { Table } from "~/components";
import {
  transactionActivityLabel,
  transactionTimeLabel,
  getAddressExplorerLink,
  getTxExplorerLink,
} from "~/util";
import FluidityFacadeContext from "contexts/FluidityFacade";
import dashboardHomeStyle from "~/styles/dashboard/home.css";
import { useCache } from "~/hooks/useCache";
import { Volume } from "../query/volumeStats";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: dashboardHomeStyle }];
};

const graphEmptyVolume = (time: number, amount = 0): Volume => ({
  sender: "",
  receiver: "",
  timestamp: time,
  amount,
  symbol: "",
});

const binTransactions = (bins: Volume[], txs: Volume[]): Volume[] => {
  const txMappedBins: Volume[][] = bins.map((bin) => [bin]);

  let binIndex = 0;
  txs.every((tx) => {
    while (tx.timestamp < bins[binIndex].timestamp) {
      binIndex++;

      if (binIndex >= bins.length) return false;
    }

    txMappedBins[binIndex].push(tx);
    return true;
  });

  const maxTxMappedBins = txMappedBins
    .map(
      (txs, i) =>
        txs.find(
          (tx) => tx.amount === Math.max(...txs.map(({ amount }) => amount))
        ) || bins[i]
    )
    .reverse();

  const [txMappedBinsStart, ...rest] = maxTxMappedBins.filter(
    (tx) => tx.amount
  );

  if (!txMappedBinsStart) return maxTxMappedBins;

  const txMappedBinsEnd = rest.pop();

  const maxTxs = maxTxMappedBins.filter(
    (tx, i) =>
      tx.amount ||
      i === 0 ||
      i === maxTxMappedBins.length - 1 ||
      (tx.timestamp < txMappedBinsStart.timestamp &&
        txMappedBinsEnd &&
        tx.timestamp > txMappedBinsEnd.timestamp)
  );

  return maxTxs;
};

const graphTransformers = [
  {
    name: "D",
    transform: (vols: Volume[]) => {
      const entries = 24;
      const unixHourInc = 60 * 60 * 1000;
      const unixNow = Date.now();

      const mappedTxBins = Array.from({ length: entries }).map((_, i) => ({
        ...graphEmptyVolume(unixNow - (i + 1) * unixHourInc),
      }));

      return binTransactions(mappedTxBins, vols);
    },
  },
  {
    name: "W",
    transform: (vols: Volume[]) => {
      //const entries = 21;
      //const unixEightHourInc = 8 * 60 * 60 * 1000;
      const entries = 7;
      const unixEightHourInc = 24 * 60 * 60 * 1000;
      const unixNow = Date.now();

      const mappedTxBins = Array.from({ length: entries }).map((_, i) => ({
        ...graphEmptyVolume(unixNow - (i + 1) * unixEightHourInc),
      }));

      return binTransactions(mappedTxBins, vols);
    },
  },
  {
    name: "M",
    transform: (vols: Volume[]) => {
      const entries = 30;
      const unixDayInc = 24 * 60 * 60 * 1000;
      const unixNow = Date.now();

      const mappedTxBins = Array.from({ length: entries }).map((_, i) => ({
        ...graphEmptyVolume(unixNow - (i + 1) * unixDayInc),
      }));

      return binTransactions(mappedTxBins, vols);
    },
  },
  {
    name: "Y",
    transform: (vols: Volume[]) => {
      const entries = 12;
      const unixBimonthlyInc = 30 * 24 * 60 * 60 * 1000;
      const unixNow = Date.now();

      const mappedTxBins = Array.from({ length: entries }).map((_, i) => ({
        ...graphEmptyVolume(unixNow - (i + 1) * unixBimonthlyInc),
      }));

      return binTransactions(mappedTxBins, vols);
    },
  },
];

const timeFilters = [
  {
    name: "D",
    filter: <T extends { timestamp: number }>({ timestamp }: T) =>
      timestamp > Date.now() - 24 * 60 * 60 * 1000,
  },
  {
    name: "W",
    filter: <T extends { timestamp: number }>({ timestamp }: T) =>
      timestamp > Date.now() - 7 * 24 * 60 * 60 * 1000,
  },
  {
    name: "M",
    filter: <T extends { timestamp: number }>({ timestamp }: T) =>
      timestamp > Date.now() - 30 * 24 * 60 * 60 * 1000,
  },
  {
    name: "Y",
    filter: <T extends { timestamp: number }>({ timestamp }: T) =>
      timestamp > Date.now() - 365 * 24 * 60 * 60 * 1000,
  },
];

type LoaderData = {
  page: number;
  network: Chain;
};

type CacheData = HomeLoader & {
  transactions: Transaction[];
  page: number;
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

const SAFE_DEFAULT: CacheData = {
  network: "ethereum",
  transactions: [],
  rewards: [],
  volume: [],
  totalFluidPairs: 0,
  timestamp: 0,
  page: 0,
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const { network } = params;

  const url = new URL(request.url);
  const _pageStr = url.searchParams.get("page");
  const _pageUnsafe = _pageStr ? parseInt(_pageStr) : 1;
  const txTablePage = _pageUnsafe > 0 ? _pageUnsafe : 1;

  return json({
    network,
    page: txTablePage,
  });
};

export default function Home() {
  const { network, page } = useLoaderData<LoaderData>();

  const { address, connected, tokens } = useContext(FluidityFacadeContext);

  const { data: homeData } = useCache<HomeLoader>(
    `/${network}/query/dashboard/home`
  );

  const isFirstLoad = !homeData;

  const { data: globalTransactionsData } = useCache<TransactionsLoader>(
    `/${network}/query/userTransactions?page=${page}`
  );

  const userHomeData = useFetcher();

  const userTransactionsData = useFetcher();

  useEffect(() => {
    if (!address) return;

    userHomeData.load(`/${network}/query/dashboard/home?address=${address}`);

    userTransactionsData.load(
      `/${network}/query/userTransactions?page=${page}&address=${address}`
    );
  }, [address]);

  const [userFluidPairs, setUserFluidPairs] = useState(
    SAFE_DEFAULT.totalFluidPairs
  );

  const data: {
    global: CacheData;
    user: CacheData;
  } = {
    global: {
      ...SAFE_DEFAULT,
      ...homeData,
      ...globalTransactionsData,
    },
    user: {
      ...SAFE_DEFAULT,
      ...userHomeData.data,
      ...userTransactionsData.data,
      totalFluidPairs: userFluidPairs,
    },
  };

  useEffect(() => {
    if (!connected) return;

    (async () => {
      const fluidTokens = await tokens?.();

      setUserFluidPairs(fluidTokens?.length || 0);
    })();
  }, [connected]);

  const navigate = useNavigate();

  const [activeTransformerIndex, setActiveTransformerIndex] = useState(3);

  const [activeTableFilterIndex, setActiveTableFilterIndex] = useState(
    connected ? 1 : 0
  );

  useEffect(() => {
    setActiveTableFilterIndex(connected ? 1 : 0);
  }, [connected]);

  const [
    {
      count,
      transactions,
      rewards,
      volume,
      graphTransformedTransactions,
      fluidPairs,
      timestamp,
    },
    setTransactions,
  ] = useState<{
    count: number;
    transactions: Transaction[];
    rewards: number;
    volume: number;
    graphTransformedTransactions: Volume[];
    fluidPairs: number;
    timestamp: number;
  }>({
    count: data.global.volume.length,
    transactions: data.global.transactions,
    rewards: data.global.rewards.reduce(
      (sum, { token_decimals, winning_amount }) =>
        sum + winning_amount / 10 ** token_decimals,
      0
    ),
    volume: data.global.volume.reduce((sum, { amount }) => sum + amount, 0),
    graphTransformedTransactions: [],
    fluidPairs: data.global.totalFluidPairs,
    timestamp: data.global.timestamp,
  });

  const { width } = useViewport();
  const isTablet = width < 850 && width > 0;
  const isMobile = width < 500 && width > 0;
  const isSmallMobile = width < 375;

  const txTableColumns = isSmallMobile
    ? [{ name: "ACTIVITY" }, { name: "VALUE" }]
    : isMobile
    ? [{ name: "ACTIVITY" }, { name: "VALUE" }, { name: "ACCOUNT" }]
    : isTablet
    ? [
        { name: "ACTIVITY" },
        { name: "VALUE" },
        { name: "REWARD" },
        { name: "ACCOUNT" },
      ]
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
          name: "ACCOUNT",
        },
        {
          name: "TIME",
          alignRight: true,
        },
      ];

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

  useEffect(() => {
    const { transactions, volume, rewards, totalFluidPairs, timestamp } =
      activeTableFilterIndex ? data.user : data.global;

    const filteredRewards = rewards
      .map((reward) => ({
        ...reward,
        timestamp: new Date(reward.created).getTime(),
      }))
      .filter(timeFilters[activeTransformerIndex].filter)
      .reduce(
        (sum, { winning_amount, token_decimals }) =>
          sum + winning_amount / 10 ** token_decimals,
        0
      );

    const filteredVolume = volume.filter(
      timeFilters[activeTransformerIndex].filter
    );

    const totalVolume = filteredVolume.reduce(
      (sum, { amount }) => sum + amount,
      0
    );

    const graphTransformedTransactions =
      graphTransformers[activeTransformerIndex].transform(filteredVolume);

    setTransactions({
      count: filteredVolume.length,
      rewards: filteredRewards,
      volume: totalVolume,
      transactions,
      graphTransformedTransactions,
      fluidPairs: totalFluidPairs,
      timestamp,
    });
  }, [
    activeTableFilterIndex,
    activeTransformerIndex,
    userHomeData.state,
    userTransactionsData.state,
  ]);

  const TransactionRow = (chain: Chain): IRow<Transaction> =>
    function Row({ data, index }: { data: Transaction; index: number }) {
      const { sender, timestamp, value, reward, hash, rewardHash, logo } = data;

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
            <Text>
              {value.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </Text>
          </td>

          {/* Reward */}
          {!isMobile && (
            <td>
              {reward ? (
                <a
                  className="table-address"
                  href={getTxExplorerLink(network, rewardHash)}
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
      <div className="pad-main" style={{ marginBottom: "12px" }}>
        {isTablet && (
          <Display
            size={isSmallMobile ? "xxs" : "xs"}
            color="gray"
            className="dashboard-identifier"
          >
            {`${activeTableFilterIndex ? "My" : "Global"} Dashboard`}
          </Display>
        )}
        <Text>
          {isFirstLoad
            ? "Loading data..."
            : `Last updated ${format(timestamp, "dd-MM-yyyy HH:mm:ss")}`}
        </Text>
      </div>
      <section id="graph">
        <div className="graph-ceiling pad-main">
          {/* Statistics */}
          <div className="overlay">
            <div className="totals-row">
              {/* Transactions Volume / Count */}
              <div className="statistics-set">
                <Text>
                  {activeTableFilterIndex ? "My" : "Total"} transactions
                </Text>
                <Display
                  size={width < 300 && width > 0 ? "xxxs" : "xs"}
                  style={{ margin: 0 }}
                >
                  {count}
                </Display>
                <AnchorButton>
                  <a href="#transactions">Activity</a>
                </AnchorButton>
              </div>

              {activeTableFilterIndex === 0 && (
                <div className="statistics-set">
                  <Text>Total volume</Text>
                  <Display
                    size={width < 300 && width > 0 ? "xxxs" : "xs"}
                    style={{ margin: 0 }}
                  >
                    {numberToMonetaryString(volume)}
                  </Display>
                </div>
              )}

              {/* Rewards */}
              <div className="statistics-set">
                <Text>{activeTableFilterIndex ? "My" : "Total"} yield</Text>
                <Display
                  size={width < 300 && width > 0 ? "xxxs" : "xs"}
                  style={{ margin: 0 }}
                >
                  {numberToMonetaryString(rewards)}
                </Display>
                <LinkButton
                  size="medium"
                  type="internal"
                  handleClick={() => {
                    navigate("../rewards");
                  }}
                >
                  Rewards
                </LinkButton>
              </div>

              {/* Fluid Pairs */}
              <div className="statistics-set">
                <Text>Fluid assets</Text>
                <Display
                  size={width < 300 && width > 0 ? "xxxs" : "xs"}
                  style={{ margin: 0 }}
                >
                  {fluidPairs}
                </Display>
              </div>
            </div>
          </div>

          {/* Graph Filter Row */}
          <div>
            {!isTablet && (
              <Display
                size={width < 1010 ? "xxs" : "xs"}
                color="gray"
                className="dashboard-identifier"
              >
                {`${activeTableFilterIndex ? "My" : "Global"} Dashboard`}
              </Display>
            )}
            <div className="statistics-row">
              {graphTransformers.map((filter, i) => (
                <button
                  key={`filter-${filter.name}`}
                  onClick={() => setActiveTransformerIndex(i)}
                >
                  <Text
                    size="lg"
                    prominent={activeTransformerIndex === i}
                    className={
                      activeTransformerIndex === i ? "active-filter" : ""
                    }
                  >
                    {filter.name}
                  </Text>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Graph */}
        <div className="graph" style={{ width: "100%", height: "400px" }}>
          <LineChart
            data={graphTransformedTransactions.map((tx, i) => ({
              ...tx,
              x: i,
            }))}
            lineLabel="transactions"
            accessors={{
              xAccessor: (d: Volume & { x: number }) => d.x,
              yAccessor: (d: Volume & { x: number }) =>
                d.amount ? Math.log(d.amount + 1) : 0,
            }}
            renderTooltip={({ datum }: { datum: Volume }) => {
              return datum.amount > 0 ? (
                <div className={"graph-tooltip-container"}>
                  <div className={"graph-tooltip"}>
                    <span style={{ color: "rgba(255,255,255, 50%)" }}>
                      {format(datum.timestamp, "dd/MM/yy")}
                    </span>
                    <br />
                    <br />
                    <span>
                      {datum.sender === MintAddress
                        ? "Mint Address"
                        : trimAddress(datum.sender)}
                    </span>
                    <br />
                    <br />
                    <span>
                      <span>{numberToMonetaryString(datum.amount)} </span>
                      <span style={{ color: "rgba(2555,255,255, 50%)" }}>
                        swapped
                      </span>
                    </span>
                  </div>
                </div>
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
          count={count}
          data={transactions}
          renderRow={TransactionRow(network)}
          onFilter={setActiveTableFilterIndex}
          activeFilterIndex={activeTableFilterIndex}
          filters={txTableFilters}
        />
      </section>
    </>
  );
}

export { ErrorBoundary };
