import type { Chain } from "~/util/chainUtils/chains";

import { LinksFunction, LoaderFunction, json, redirect } from "@remix-run/node";
import dashboardHomeStyle from "~/styles/dashboard/home.css";

import { Display, LineChart, Text } from "@fluidity-money/surfing";

import { useUserTransactionCount, useUserTransactions } from "~/queries";
import { useLoaderData } from "@remix-run/react";
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

    console.log("Fetching user transactions");
    userTransactions = await (
      await useUserTransactions(network ?? "", address, page)
    ).json();

    console.log("userTransactions", userTransactions);
  } catch (err) {
    error = "The transaction explorer is currently unavailable";
  } // Fail silently - for now.

  if (
    error !== undefined ||
    userTransactionCount.errors ||
    userTransactions.errors
  ) {
    return redirect("/error", {status: 500, statusText: error});
  }
  if (userTransactionCount.errors || userTransactions.errors) {
    return json({ transactions: [], count: 0, page: 1 });
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

export default function Home() {
  const { transactions, count, page, network } = useLoaderData<LoaderData>();
  const isTransition = useTransition();

  const pageCount = Math.ceil(count / 12);
  const startTransaction = (page - 1) * 12 + 1;
  const endTransaction = page * 12 > count ? count : page * 12;

  return (
    <>
      <section id="graph">
        <div className="graph" style={{ width: "100%", height: "400px" }}>
          <LineChart
            data={[
              { x: 10, y: 10 },
              { x: 20, y: 20 },
              { x: 30, y: 30 },
              { x: 40, y: 20 },
            ]}
            xLabel="Some X Label"
            yLabel="Some Y Label"
            lineLabel="Some Tooltip Label"
            accessors={{
              xAccessor: (d: any) => d.x,
              yAccessor: (d: any) => d.y,
            }}
          />
        </div>
        <div className="graph-ceiling">
          <div className="overlay">
            <div className="statistics-row">
              <div className="statistics-set">
                <Text>Total transactions</Text>
                <Display size={"md"} style={{ margin: 0 }}>
                  0
                </Display>
              </div>
              <div className="statistics-set">
                <Text>Total yield</Text>
                <Display size={"md"} style={{ margin: 0 }}>
                  0
                </Display>
              </div>
              <div className="statistics-set">
                <Text>Fluid assets</Text>
                <Display size={"md"} style={{ margin: 0 }}>
                  0
                </Display>
              </div>
            </div>
          </div>
          <div>
            <div className="statistics-row">
              <span>D</span>
              <span>W</span>
              <span>M</span>
              <span>Y</span>
            </div>
          </div>
        </div>
      </section>

      <section id="transactions">
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
