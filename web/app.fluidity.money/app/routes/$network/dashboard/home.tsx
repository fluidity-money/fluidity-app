import type { Chain } from "~/util/chainUtils/chains";
import type { IRow } from "~/components/Table";
import type Transaction from "~/types/Transaction";

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
import { useLoaderData, useNavigate, useLocation } from "@remix-run/react";
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

export const unstable_shouldReload = () => false;

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: dashboardHomeStyle }];
};

const graphEmptyTransaction = (time: number, value = 0): Transaction => ({
  sender: "",
  receiver: "",
  winner: "",
  reward: 0,
  hash: "",
  rewardHash: "",
  timestamp: time,
  value,
  currency: "",
  logo: "/assets/tokens/fUSDT.svg",
  provider: "",
});

type LoaderData = {
  network: Chain;
};

type TransactionLoader = {
  totalTransactions: Transaction[];
  totalRewards: number;
  totalCount: number;
  totalVolume: number;
  fluidPairs: number;
  page: number;
  timestamp: number;
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

const SAFE_DEFAULT: TransactionLoader = {
  totalTransactions: [],
  totalRewards: 0,
  totalCount: 0,
  totalVolume: 0,
  fluidPairs: 0,
  timestamp: 0,
  page: 0,
};

export const loader: LoaderFunction = async ({ params }) => {
  const { network } = params;

  return json({
    network,
  });
};

export default function Home() {
  const { network } = useLoaderData<LoaderData>();

  const { data: loaderData } = useCache<TransactionLoader>(
    `/${network}/query/dashboard/home`
  );

  const isFirstLoad = !loaderData;

  const data = loaderData || SAFE_DEFAULT;

  const {
    totalTransactions,
    totalCount,
    totalRewards,
    totalVolume,
    fluidPairs,
    timestamp,
  } = data;

  const location = useLocation();

  const pageRegex = /page=[0-9]+/gi;
  const _pageMatches = location.search.match(pageRegex);
  const _pageStr = _pageMatches?.length ? _pageMatches[0].split("=")[1] : "";
  const _pageUnsafe = _pageStr ? parseInt(_pageStr) : 1;
  const txTablePage = _pageUnsafe > 0 ? _pageUnsafe : 1;

  const navigate = useNavigate();

  const { address, connected } = useContext(FluidityFacadeContext);

  const [activeTransformerIndex, setActiveTransformerIndex] = useState(3);

  const [
    { count, transactions, rewards, volume, graphTransformedTransactions },
    setTransactions,
  ] = useState<{
    count: number;
    transactions: Transaction[];
    rewards: number;
    volume: number;
    graphTransformedTransactions: Transaction[];
  }>({
    count: totalCount,
    transactions: totalTransactions,
    rewards: totalRewards,
    volume: totalVolume,
    graphTransformedTransactions: [],
  });

  useEffect(() => {
    setTransactions({
      count: totalCount,
      transactions: totalTransactions,
      rewards: totalRewards,
      volume: totalVolume,
      graphTransformedTransactions: [],
    });
  }, [totalCount, totalTransactions, totalRewards, totalVolume]);

  const binTransactions = (
    bins: Transaction[],
    txs: Transaction[]
  ): Transaction[] => {
    const txMappedBins: Transaction[][] = bins.map((bin) => [bin]);

    let binIndex = 0;
    for (let txIndex = 0; txIndex < txs.length; txIndex++) {
      const tx = txs[txIndex];

      while (tx.timestamp < bins[binIndex].timestamp) {
        binIndex++;

        if (binIndex >= bins.length) break;
      }
      if (binIndex >= bins.length) break;

      txMappedBins[binIndex].push(tx);
    }

    const maxTxMappedBins = txMappedBins
      .map(
        (txs, i) =>
          txs.find(
            (tx) => tx.value === Math.max(...txs.map(({ value }) => value))
          ) || bins[i]
      )
      .reverse();

    const [txMappedBinsStart, ...rest] = maxTxMappedBins.filter(
      (tx) => tx.value
    );

    if (!txMappedBinsStart) return maxTxMappedBins;

    const txMappedBinsEnd = rest.pop();

    const maxTxs = maxTxMappedBins.filter(
      (tx, i) =>
        tx.value ||
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
      transform: (txs: Transaction[]) => {
        const entries = 24;
        const unixHourInc = 60 * 60 * 1000;
        const unixNow = Date.now();

        const mappedTxBins = Array.from({ length: entries }).map((_, i) => ({
          ...graphEmptyTransaction(unixNow - (i + 1) * unixHourInc),
        }));

        return binTransactions(mappedTxBins, txs);
      },
    },
    {
      name: "W",
      transform: (txs: Transaction[]) => {
        //const entries = 21;
        //const unixEightHourInc = 8 * 60 * 60 * 1000;
        const entries = 7;
        const unixEightHourInc = 24 * 60 * 60 * 1000;
        const unixNow = Date.now();

        const mappedTxBins = Array.from({ length: entries }).map((_, i) => ({
          ...graphEmptyTransaction(unixNow - (i + 1) * unixEightHourInc),
        }));

        return binTransactions(mappedTxBins, txs);
      },
    },
    {
      name: "M",
      transform: (txs: Transaction[]) => {
        const entries = 30;
        const unixDayInc = 24 * 60 * 60 * 1000;
        const unixNow = Date.now();

        const mappedTxBins = Array.from({ length: entries }).map((_, i) => ({
          ...graphEmptyTransaction(unixNow - (i + 1) * unixDayInc),
        }));

        return binTransactions(mappedTxBins, txs);
      },
    },
    {
      name: "Y",
      transform: (txs: Transaction[]) => {
        const entries = 12;
        const unixBimonthlyInc = 30 * 24 * 60 * 60 * 1000;
        const unixNow = Date.now();

        const mappedTxBins = Array.from({ length: entries }).map((_, i) => ({
          ...graphEmptyTransaction(unixNow - (i + 1) * unixBimonthlyInc),
        }));

        return binTransactions(mappedTxBins, txs);
      },
    },
  ];

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
            [sender, receiver].includes(address),
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
    if (!activeTableFilterIndex) {
      return setTransactions({
        count: totalCount,
        rewards: totalRewards,
        transactions: totalTransactions,
        volume: totalVolume,
        graphTransformedTransactions:
          graphTransformers[activeTransformerIndex].transform(
            totalTransactions
          ),
      });
    }

    const tableFilteredTransactions = totalTransactions.filter(
      txTableFilters[activeTableFilterIndex].filter
    );

    const filteredRewards = tableFilteredTransactions.reduce(
      (sum, { reward }) => sum + reward,
      0
    );

    const filteredVolume = tableFilteredTransactions.reduce(
      (sum, { value }) => sum + value,
      0
    );

    const graphTransformedTransactions = graphTransformers[
      activeTransformerIndex
    ].transform(tableFilteredTransactions);

    setTransactions({
      count: tableFilteredTransactions.length,
      rewards: filteredRewards,
      volume: filteredVolume,
      transactions: tableFilteredTransactions,
      graphTransformedTransactions,
    });
  }, [activeTableFilterIndex, activeTransformerIndex]);

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
            {`${activeTableFilterIndex ? "My" : "Global"} dashboard`}
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
                {activeTableFilterIndex ? (
                  <>
                    <Text>My transactions</Text>
                    <Display
                      size={width < 300 && width > 0 ? "xxxs" : "xs"}
                      style={{ margin: 0 }}
                    >
                      {count}
                    </Display>
                  </>
                ) : (
                  <>
                    <Text>Total volume</Text>
                    <Display
                      size={width < 300 && width > 0 ? "xxxs" : "xs"}
                      style={{ margin: 0 }}
                    >
                      {numberToMonetaryString(volume)}
                    </Display>
                  </>
                )}
                <AnchorButton>
                  <a href="#transactions">Activity</a>
                </AnchorButton>
              </div>

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
                {`${activeTableFilterIndex ? "My" : "Global"} dashboard`}
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
              xAccessor: (d: Transaction & { x: number }) => d.x,
              yAccessor: (d: Transaction & { x: number }) =>
                d.value ? Math.log(d.value + 1) : 0,
            }}
            renderTooltip={({ datum }: { datum: Transaction }) => {
              return datum.value > 0 ? (
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
                      <span>{numberToMonetaryString(datum.value)} </span>
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
            page: txTablePage,
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
