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
import { useState, useContext } from "react";
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
          winnersMap[tx.hash].token_decimals
        : 0,
      hash: tx.hash,
      currency: tx.currency,
      value: tx.value,
      timestamp: tx.timestamp,
    }));

    return json({
      transactions: mergedTransactions,
      count,
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

type LoaderData = {
  transactions: Transaction[];
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
  } = useLoaderData<LoaderData>();

  const location = useLocation();

  const pageRegex = /page=[0-9]+/gi;
  const _pageMatches = location.search.match(pageRegex);
  const _pageStr = _pageMatches?.length ? _pageMatches[0].split("=")[1] : "";
  const _pageUnsafe = _pageStr ? parseInt(_pageStr) : 1;
  const txTablePage = _pageUnsafe > 0 ? _pageUnsafe : 1;

  const navigate = useNavigate();

  const { address } = useContext(FluidityFacadeContext);

  const [activeFilterIndex, setActiveFilterIndex] = useState(2);

  const [{ count, transactions }] = useState<{
    count: number;
    transactions: Transaction[];
  }>({ count: allCount, transactions: allTransactions });

  const graphFilters = [
    {
      name: "D",
      filter: (row: Transaction) =>
        row.timestamp * 1000 >= Date.now() - 24 * 60 * 60 * 1000,
    },
    {
      name: "W",
      filter: (row: Transaction) =>
        row.timestamp * 1000 >= Date.now() - 7 * 24 * 60 * 60 * 1000,
    },
    {
      name: "M",
      filter: (row: Transaction) =>
        row.timestamp * 1000 >= Date.now() - 31 * 24 * 60 * 60 * 1000,
    },
    {
      name: "Y",
      filter: (row: Transaction) =>
        row.timestamp * 1000 >= Date.now() - 365 * 24 * 60 * 60 * 1000,
    },
  ];

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
      const { sender, receiver, timestamp, value, currency, reward, hash } =
        data;

      const txAddress = sender === address ? receiver : sender;

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
                <Text>{trimAddress(txAddress)}</Text>
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
                  $20,000.00
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
              {graphFilters.map((filter, i) => (
                <button
                  key={`filter-${filter.name}`}
                  onClick={() => setActiveFilterIndex(i)}
                >
                  <Text size="lg" prominent={activeFilterIndex === i}>
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
            data={transactions.filter(graphFilters[activeFilterIndex].filter)}
            lineLabel="transactions"
            accessors={{
              xAccessor: (d: Transaction) => d.timestamp,
              yAccessor: (d: Transaction) => d.value,
            }}
            renderTooltip={({ datum }: { datum: Transaction }) => (
              <div className={"tooltip"}>
                <span style={{ color: "rgba(255,255,255, 50%)" }}>
                  {format(datum.timestamp * 1000, "dd/mm/yy")}
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
                    prize awarded
                  </span>
                </span>
              </div>
            )}
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
