import type { Chain } from "~/util/chainUtils/chains";
import type { UserTransaction } from "~/routes/$network/query/userTransactions";
import type { Winner } from "~/queries/useUserRewards";
import type { IRow } from "~/components/Table";
import type Transaction from "~/types/Transaction";

import config from "~/webapp.config.server";
import { motion } from "framer-motion";
import { LinksFunction, LoaderFunction, json } from "@remix-run/node";
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
import { useState, useContext, useMemo, useEffect } from "react";
import { useUserRewards } from "~/queries";
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

export const unstable_shouldReload = () => false;

export const loader: LoaderFunction = async ({ request, params }) => {
  const { network } = params;

  const url = new URL(request.url);
  const _pageStr = url.searchParams.get("page");
  const _pageUnsafe = _pageStr ? parseInt(_pageStr) : 1;
  const page = _pageUnsafe > 0 ? _pageUnsafe : 1;

  const fluidPairs = config.config[network ?? ""].fluidAssets.length;

  try {
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

    const defaultLogo = "/assets/tokens/fUSDT.png";

    const mergedTransactions: Transaction[] =
      transactions?.map((tx) => ({
        sender: tx.sender,
        receiver: tx.receiver,
        winner: winnersMap[tx.hash]?.winning_address ?? "",
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

    const totalVolume = mergedTransactions.reduce(
      (sum, { value }) => sum + value,
      0
    );

    return json({
      totalTransactions: mergedTransactions,
      totalCount: count,
      totalRewards,
      totalVolume,
      fluidPairs,
      page,
      network,
    });
  } catch (err) {
    console.log(err);
    throw new Error(`Could not fetch Transactions on ${network}: ${err}`);
  } // Fail silently - for now.
};

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: dashboardHomeStyle }];
};

export const meta = () => {
  return {
    title: "Dashboard",
  };
};

const graphEmptyTransaction = (time: number, value = 0): Transaction => ({
  sender: "",
  receiver: "",
  winner: "",
  reward: 0,
  hash: "",
  timestamp: time,
  value,
  currency: "",
  logo: "/assets/tokens/fUSDT.svg",
});

type LoaderData = {
  totalTransactions: Transaction[];
  totalRewards: number;
  totalCount: number;
  totalVolume: number;
  fluidPairs: number;
  page: number;
  network: Chain;
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

export default function Home() {
  const {
    network,
    totalTransactions,
    totalCount,
    totalRewards,
    totalVolume,
    fluidPairs,
  } = useLoaderData<LoaderData>();

  const location = useLocation();

  const pageRegex = /page=[0-9]+/gi;
  const _pageMatches = location.search.match(pageRegex);
  const _pageStr = _pageMatches?.length ? _pageMatches[0].split("=")[1] : "";
  const _pageUnsafe = _pageStr ? parseInt(_pageStr) : 1;
  const txTablePage = _pageUnsafe > 0 ? _pageUnsafe : 1;

  const navigate = useNavigate();

  const { address, connected } = useContext(FluidityFacadeContext);

  const [activeTransformerIndex, setActiveTransformerIndex] = useState(1);

  const [{ count, transactions, rewards, volume }, setTransactions] = useState<{
    count: number;
    transactions: Transaction[];
    rewards: number;
    volume: number;
  }>({
    count: totalCount,
    transactions: totalTransactions,
    rewards: totalRewards,
    volume: totalVolume,
  });

  const binTransactions = (
    bins: (Transaction & { x: number })[],
    txs: Transaction[]
  ) => {
    let mappedTxIndex = 0;

    txs.every((tx) => {
      while (tx.timestamp < bins[mappedTxIndex].timestamp) {
        mappedTxIndex += 1;

        if (mappedTxIndex >= bins.length) return false;
      }

      if (tx.value > bins[mappedTxIndex].value) {
        bins[mappedTxIndex] = { ...tx, x: bins.length - mappedTxIndex };
      }

      return true;
    });

    return bins;
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
          x: entries - i,
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
          x: entries - i,
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
          x: entries - i,
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
          x: entries - i,
        }));

        return binTransactions(mappedTxBins, txs);
      },
    },
  ];

  const graphTransformedTransactions = useMemo(
    () =>
      graphTransformers[activeTransformerIndex]
        .transform(totalTransactions)
        .reverse(),
    [activeTransformerIndex]
  );

  const { width } = useViewport();
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
          name: "YOUR DASHBOARD",
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

    setTransactions({
      count: tableFilteredTransactions.length,
      rewards: filteredRewards,
      volume: filteredVolume,
      transactions: tableFilteredTransactions,
    });
  }, [activeTableFilterIndex]);

  const TransactionRow = (chain: Chain): IRow<Transaction> =>
    function Row({ data, index }: { data: Transaction; index: number }) {
      const { sender, timestamp, value, reward, hash, logo } = data;

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

          {/* Account */}
          {width > tableBreakpoint && (
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
          {width > tableBreakpoint && (
            <td>
              <Text>{transactionTimeLabel(timestamp)}</Text>
            </td>
          )}
        </motion.tr>
      );
    };

  return (
    <>
      <section id="graph">
        <div className="graph-ceiling pad-main">
          {/* Statistics */}
          <div className="overlay">
            <div className="totals-row">
              {/* Transactions Count */}
              <div className="statistics-set">
                <Text>
                  {activeTableFilterIndex ? "Your" : "Total"} transactions
                </Text>
                <Display size={"xs"} style={{ margin: 0 }}>
                  {count}
                </Display>
                <AnchorButton>
                  <a href="#transactions">Activity</a>
                </AnchorButton>
              </div>

              {/* Volume */}
              <div className="statistics-set">
                <Text>{activeTableFilterIndex ? "Your" : "Total"} volume</Text>
                <Display size={"xs"} style={{ margin: 0 }}>
                  {numberToMonetaryString(volume)}
                </Display>
              </div>

              {/* Rewards */}
              <div className="statistics-set">
                <Text>{activeTableFilterIndex ? "Your" : "Total"} yield</Text>
                <Display size={"xs"} style={{ margin: 0 }}>
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
                <Display size={"xs"} style={{ margin: 0 }}>
                  {fluidPairs}
                </Display>
              </div>
            </div>
          </div>

          {/* Graph Filter Row */}
          <div>
            <div className="statistics-row">
              {graphTransformers.map((filter, i) => (
                <button
                  key={`filter-${filter.name}`}
                  onClick={() => setActiveTransformerIndex(i)}
                >
                  <Text
                    size="xl"
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
            data={graphTransformedTransactions}
            lineLabel="transactions"
            accessors={{
              xAccessor: (d: Transaction & { x: number }) => d.x,
              yAccessor: (d: Transaction & { x: number }) => d.value,
            }}
            renderTooltip={({ datum }: { datum: Transaction }) => {
              return datum.value > 0 ? (
                <div className={"tooltip-container"}>
                  <div className={"tooltip"}>
                    <span style={{ color: "rgba(255,255,255, 50%)" }}>
                      {format(datum.timestamp, "dd/MM/yy")}
                    </span>
                    <br />
                    <br />
                    <span>
                      <span>{trimAddress(datum.sender)}</span>
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
