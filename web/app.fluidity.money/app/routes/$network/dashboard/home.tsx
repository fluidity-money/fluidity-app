import type { Chain } from "~/util/chainUtils/chains";

import { LinksFunction, LoaderFunction, json, redirect } from "@remix-run/node";
import dashboardHomeStyle from "~/styles/dashboard/home.css";

import { Display, Text } from "@fluidity-money/surfing";

import { useUserTransactionCount, useUserTransactions } from "~/queries";
import { useLoaderData } from "@remix-run/react";
import { UserTransaction } from "~/queries/useUserTransactions";

import TransactionTable from "~/screens/TransactionTable";

const address = "0xbb9cdbafba1137bdc28440f8f5fbed601a107bb6";

export const loader: LoaderFunction = async ({ request, params }) => {
  const { network } = params;

  const url = new URL(request.url);
  const _pageStr = url.searchParams.get("page");
  const _pageUnsafe = _pageStr ? parseInt(_pageStr) : 1;
  const page = _pageUnsafe > 0 ? _pageUnsafe : 1;

  const {
    data: {
      [network as string]: {
        transfers: [{ count }],
      },
    },
  } = await (await useUserTransactionCount(address)).json();

  const {
    data: {
      [network as string]: { transfers: transactions },
    },
  } = await (await useUserTransactions(address, page)).json();

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

  return (
    <>
      <section id="graph">
        <div className="graph"></div>
        <div className="graph-ceiling">
          <div className="overlay">
            <div className="statistics-row">
              <div className="statistics-set">
                <Text>Total transactions</Text>
                <Display medium style={{ margin: 0 }}>
                  0
                </Display>
              </div>
              <div className="statistics-set">
                <Text>Total yield</Text>
                <Display medium style={{ margin: 0 }}>
                  0
                </Display>
              </div>
              <div className="statistics-set">
                <Text>Fluid assets</Text>
                <Display medium style={{ margin: 0 }}>
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
        />
      </section>
    </>
  );
}
