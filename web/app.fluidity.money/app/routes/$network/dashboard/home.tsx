import type { Chain } from "~/util/chainUtils/chains";
import type { UserTransaction } from "~/routes/$network/query/userTransactions";
import type { Winner } from "~/queries/useUserRewards";
import type { IRow } from "~/components/Table";

import config from "~/webapp.config.server";
import { motion } from "framer-motion";
import { LinksFunction, LoaderFunction, json } from "@remix-run/node";
import { format } from "date-fns";
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
import { useState, useContext, useMemo } from "react";
import { useUserRewards } from "~/queries";
import {
  useLoaderData,
  useNavigate,
  Link,
  useLocation,
} from "@remix-run/react";
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

  const fluidPairs = config.config[network ?? ""].tokens.length;

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

    const mergedTransactions: Transaction[] = transactions.map((tx) => ({
      sender: tx.sender,
      receiver: tx.receiver,
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
    }));

    const totalYield = mergedTransactions.reduce(
      (sum, { reward }) => sum + reward,
      0
    );

    return json({
      transactions: mergedTransactions,
      count,
      totalYield,
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

type Transaction = {
  sender: string;
  receiver: string;
  reward: number;
  hash: string;
  // timestamp is the Unix time, in seconds
  timestamp: number;
  value: number;
  currency: string;
};

const graphEmptyTransaction = (time: number, value = 0) => ({
  sender: "",
  receiver: "",
  reward: 0,
  hash: "",
  timestamp: time,
  value,
  currency: "",
});

type LoaderData = {
  transactions: Transaction[];
  totalYield: number;
  count: number;
  fluidPairs: number;
  page: number;
  network: Chain;
};

function ErrorBoundary() {
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
    transactions: allTransactions,
    count: allCount,
    fluidPairs,
    totalYield,
  } = useLoaderData<LoaderData>();

  const location = useLocation();

  const pageRegex = /page=[0-9]+/gi;
  const _pageMatches = location.search.match(pageRegex);
  const _pageStr = _pageMatches?.length ? _pageMatches[0].split("=")[1] : "";
  const _pageUnsafe = _pageStr ? parseInt(_pageStr) : 1;
  const txTablePage = _pageUnsafe > 0 ? _pageUnsafe : 1;

  const navigate = useNavigate();

  const { address } = useContext(FluidityFacadeContext);

  const [activeTransformerIndex, setActiveTransformerIndex] = useState(1);

  const [{ count, transactions }] = useState<{
    count: number;
    transactions: Transaction[];
  }>({ count: allCount, transactions: allTransactions });

  const binTransactions = (bins: Transaction[], txs: Transaction[]) => {
    let mappedTxIndex = 0;

    txs.every((tx) => {
      while (tx.timestamp < bins[mappedTxIndex].timestamp) {
        mappedTxIndex += 1;

        if (mappedTxIndex >= bins.length) return false;
      }

      if (tx.value > bins[mappedTxIndex].value) {
        bins[mappedTxIndex] = tx;
      }

      return true;
    });

    const startBinTimestamp = bins[0].timestamp;
    const endBinTimestamp = bins[bins.length - 1].timestamp;

    return [graphEmptyTransaction(startBinTimestamp - 1, -1)]
      .concat(bins)
      .concat([graphEmptyTransaction(endBinTimestamp + 1, -1)]);
  };

  const graphTransformers = [
    {
      name: "D",
      transform: (txs: Transaction[]) => {
        const entries = 24;
        const unixHourInc = 60 * 60 * 1000;
        const unixNow = Date.now();

        const mappedTxBins = Array.from({ length: entries }).map((_, i) =>
          graphEmptyTransaction(unixNow - (i + 1) * unixHourInc)
        );

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

        const mappedTxBins = Array.from({ length: entries }).map((_, i) =>
          graphEmptyTransaction(unixNow - (i + 1) * unixEightHourInc)
        );

        return binTransactions(mappedTxBins, txs);
      },
    },
    {
      name: "M",
      transform: (txs: Transaction[]) => {
        const entries = 30;
        const unixDayInc = 24 * 60 * 60 * 1000;
        const unixNow = Date.now();

        const mappedTxBins = Array.from({ length: entries }).map((_, i) =>
          graphEmptyTransaction(unixNow - (i + 1) * unixDayInc)
        );

        return binTransactions(mappedTxBins, txs);
      },
    },
    {
      name: "Y",
      transform: (txs: Transaction[]) => {
        const entries = 12;
        const unixBimonthlyInc = 30 * 24 * 60 * 60 * 1000;
        const unixNow = Date.now();

        const mappedTxBins = Array.from({ length: entries }).map((_, i) =>
          graphEmptyTransaction(unixNow - (i + 1) * unixBimonthlyInc)
        );

        return binTransactions(mappedTxBins, txs);
      },
    },
  ];

  const graphTransformedTransactions = useMemo(
    () => graphTransformers[activeTransformerIndex].transform(transactions),
    [transactions, activeTransformerIndex]
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

  const txTableFilters = address
    ? [
        {
          filter: () => true,
          name: "ALL",
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
          name: "ALL",
        },
      ];

  const TransactionRow = (chain: Chain): IRow<Transaction> =>
    function Row({ data, index }: { data: Transaction; index: number }) {
      const { sender, timestamp, value, currency, reward, hash } = data;

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
              <img
                src={
                  currency === "USDC"
                    ? "/images/tokenIcons/usdcFluid.svg"
                    : "/images/tokenIcons/usdtFluid.svg"
                }
              />
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
                <Text>{trimAddress(sender)}</Text>
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
              <div className="statistics-set">
                <Text>Total transactions</Text>
                <Display size={"xs"} style={{ margin: 0 }}>
                  {count}
                </Display>
                <AnchorButton>
                  <Link
                    to={{ pathname: "#transactions", search: location.search }}
                  >
                    Activity
                  </Link>
                </AnchorButton>
              </div>
              <div className="statistics-set">
                <Text>Total yield</Text>
                <Display size={"xs"} style={{ margin: 0 }}>
                  {numberToMonetaryString(totalYield)}
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
                      activeTransformerIndex === i ? "active-graph-filter" : ""
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
              xAccessor: (d: Transaction) => d.timestamp,
              yAccessor: (d: Transaction) =>
                Math.log((d.value || 0.001) * 1100),
            }}
            renderTooltip={({ datum }: { datum: Transaction }) =>
              datum.value > 0 ? (
                <div className={"tooltip-container"}>
                  <div className={"tooltip"}>
                    <span style={{ color: "rgba(255,255,255, 50%)" }}>
                      {format(datum.timestamp, "dd/mm/yy")}
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
              )
            }
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
          filters={txTableFilters}
        />
      </section>
    </>
  );
}

export { ErrorBoundary };
