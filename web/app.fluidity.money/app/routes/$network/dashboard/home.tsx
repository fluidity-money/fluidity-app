import type { Chain } from "~/util/chainUtils/chains";

import { LinksFunction, LoaderFunction, json } from "@remix-run/node";
import { format, fromUnixTime } from "date-fns";
import {
  Display,
  LineChart,
  Text,
  AnchorButton,
  LinkButton,
  trimAddress,
  numberToMonetaryString,
} from "@fluidity-money/surfing";
import { captureException } from "@sentry/react";
import { useState, useContext, useEffect } from "react";
import { useLoaderData, useNavigate, Link } from "@remix-run/react";
import TransactionTable from "~/components/TransactionTable";
import FluidityFacadeContext from "contexts/FluidityFacade";
import dashboardHomeStyle from "~/styles/dashboard/home.css";

export const loader: LoaderFunction = async ({ request, params }) => {
  const { network } = params;

  const url = new URL(request.url);
  const _pageStr = url.searchParams.get("page");
  const _pageUnsafe = _pageStr ? parseInt(_pageStr) : 1;
  const page = _pageUnsafe > 0 ? _pageUnsafe : 1;

  return json({
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
  const { page, network } = useLoaderData<LoaderData>();
  const navigate = useNavigate();

  const { connected, address } = useContext(FluidityFacadeContext);

  const [activeFilterIndex, setActiveFilterIndex] = useState(0);

  const [{ transactions, count }, setTransactionsRes] = useState<{
    count: number;
    transactions: Transaction[];
  }>({ count: 0, transactions: [] });

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

  useEffect(() => {
    if (!connected || !address) return;

    (async () => {
      try {
        const { transactions, count } = await (
          await fetch(
            `/${network}/query/userTransactions?network=${network}&address=${address}&page=${page}`
          )
        ).json();

        setTransactionsRes({
          transactions,
          count,
        });
      } catch (err) {
        console.log(err);
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
      } // Fail silently - for now.
    })();
  }, [connected]);

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
          address={address ?? ""}
        />
      </section>
    </>
  );
}

export { ErrorBoundary };
