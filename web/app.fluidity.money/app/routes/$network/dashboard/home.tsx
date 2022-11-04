import type { Chain } from "~/util/chainUtils/chains";

import { LinksFunction, LoaderFunction, json, redirect } from "@remix-run/node";
import dashboardHomeStyle from "~/styles/dashboard/home.css";
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

import { useUserTransactionCount, useUserTransactions } from "~/queries";
import { useState } from "react";
import { useLoaderData, useNavigate, Link } from "@remix-run/react";
import { UserTransaction } from "~/queries/useUserTransactions";

import TransactionTable from "~/components/TransactionTable";

const address = "0xbb9cdbafba1137bdc28440f8f5fbed601a107bb6";

export const loader: LoaderFunction = async ({ request, params }) => {
  const { network } = params;

  const url = new URL(request.url);
  const _pageStr = url.searchParams.get("page");
  const _pageUnsafe = _pageStr ? parseInt(_pageStr) : 1;
  const page = _pageUnsafe > 0 ? _pageUnsafe : 1;

  let userTransactionCount;
  let userTransactions;

  let error;

  try {
    console.log("Fetching user transaction count");
    userTransactionCount = await (
      await useUserTransactionCount(network ?? "", address)
    ).json();
    console.log("transactionCount ", userTransactionCount);

    console.log("Fetching user transactions");
    userTransactions = await (
      await useUserTransactions(network ?? "", address, page)
    ).json();

    console.log("userTransactions", userTransactions);
  } catch (err) {
    throw new Error(`The transaction explorer is unavailable! ${err}`);
  } // Fail silently - for now.

  if (
    error !== undefined ||
    userTransactionCount.errors ||
    userTransactions.errors
  ) {
    throw new Error(`The transaction explorer is unavailable! ${error}`);
  }
  if (userTransactionCount.errors || userTransactions.errors) {
    return json({ transactions: [], count: 0, page: 1, network });
  }

  const {
    data: {
      [network as string]: {
        transfers: [{ count }],
      },
    },
  } = userTransactionCount;

  const {
    data: {
      [network as string]: { transfers: transactions },
    },
  } = userTransactions;

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

  return json({
    transactions: sanitizedTransactions,
    count,
    page,
    network,
  });
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
  // timestamp is the Unix time, in seconds
  timestamp: number;
  value: number;
  currency: string;
};

type LoaderData = {
  transactions: Transaction[];
  count: number;
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
  const { transactions, count, page, network } = useLoaderData<LoaderData>();
  const navigate = useNavigate();

  const [activeFilterIndex, setActiveFilterIndex] = useState(0);

  const graphFilters = [
    {
      name: "D",
      filter: (row: Transaction) =>
        row.timestamp * 1000 >= Date.now() - 24 * 60 * 60 * 1000,
    },
    {
      name: "W",
      filter: (row: Transaction) =>
        row.timestamp * 1000 >= Date.now() - 24 * 60 * 60 * 1000,
    },
    {
      name: "M",
      filter: (row: Transaction) =>
        row.timestamp * 1000 >= Date.now() - 24 * 60 * 60 * 1000,
    },
    {
      name: "Y",
      filter: (row: Transaction) =>
        row.timestamp * 1000 >= Date.now() - 24 * 60 * 60 * 1000,
    },
  ];

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
                  <Link to={"#transactions"}>Activity</Link>
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
                  0
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
                  <span>{trimAddress(datum.receiver)}</span>
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
        <TransactionTable
          page={page}
          count={count}
          transactions={transactions}
          chain={network}
          address={address}
        />
      </section>
    </>
  );
}

export { ErrorBoundary };
