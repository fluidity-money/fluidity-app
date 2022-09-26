import { LinksFunction, LoaderFunction, json, redirect } from "@remix-run/node";
import dashboardHomeStyle from "~/styles/dashboard/home.css";

import { Display, Text } from "@fluidity-money/surfing";

import { useUserTransactionCount, useUserTransactions } from "~/queries";
import { Link, useLoaderData, useTransition } from "@remix-run/react";
import { UserTransaction } from "~/queries/useUserTransactions";

import { isYesterday, isToday, formatDistanceToNow, format } from "date-fns";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const address = "0xbb9cdbafba1137bdc28440f8f5fbed601a107bb6"

export const loader: LoaderFunction = async ({ request, params }) => {
  const { network } = params;

  const url = new URL(request.url);
  const _pageStr = url.searchParams.get("page");
  const _pageUnsafe = _pageStr ? parseInt(_pageStr) : 1;
  const page = _pageUnsafe > 0 ? _pageUnsafe : 1;

  const { 
    data: {
      [network as string]: { 
        transfers: [{
          count
        }]
      }
    },
  } = await (await useUserTransactionCount(address)).json();

  const {
    data: {
      [network as string]: {
        transfers: transactions
      }
    },
  } = await (await useUserTransactions(address, page)).json();
  console.log(transactions)

  // Destructure GraphQL data
  const sanitizedTransactions = transactions.map((transaction: UserTransaction) => {
    const { 
      sender: {
        address: sender,
      },
      receiver: {
        address: receiver,
      },
      block: {
        timestamp: {
          unixtime: timestamp,
        }
      },
      amount: value,
      currency: {
        symbol: currency,
      }
    } = transaction;

    return {
      sender,
      receiver,
      timestamp,
      value,
      currency,
    }
  });

  if (Math.ceil(count / 12) < page && count > 0) {
    return redirect(`./`, 301);
  }

  return json( {
      transactions: sanitizedTransactions,
      count,
      page
    },
  );
}


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
};

const ActivityLabel = (activity: Transaction, address: string) => {
  const { sender, currency } = activity;
    return sender === address ? `Sent ${currency}` : `Received ${currency}`;
  }

export default function Home() {
  const {
    transactions,
    count,
    page
  } = useLoaderData<LoaderData>();

  const pageCount = Math.ceil(count / 12);
  const startTransaction = (page - 1) * 12 + 1;
  const endTransaction = page * 12 > count ? count : page * 12;

  const isTransition = useTransition();

  return (
    <>
      <nav>
        <p>Dashboard</p>
        <div>
          <a>Send</a>
          <a>Recieve</a>
          <a>Fluidify Money</a>
          <a>$1000.00</a>
        </div>
      </nav>
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
        <div className="transactions-header row justify-between">
          <Text>{startTransaction}-{endTransaction} of {count} transactions</Text>
          <div>
            <span>All</span>
            <span>DEX</span>
            <span>NFT</span>
            <span>DeFi</span>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Activity</th>
              <th>Value</th>
              <th>Reward</th>
              <th>Account</th>
              <th>Time</th>
            </tr>
          </thead>
            <AnimatePresence mode="wait" initial={false}>
          <motion.tbody key={`page-${page}`} 
          initial="enter"
          animate={isTransition.state === "idle" ? "enter" : "transitioning"}
          exit="exit"
          variants={{
            enter: {
              opacity: 1,
              transition: {
                when: "beforeChildren",
                staggerChildren: 0.05,
              },
            },
            exit: {
              opacity: 0,
              transition: {
                when: "afterChildren",
                staggerChildren: 0.05,
              },
            },
            transitioning: {}
          }}>
              {transactions.map((transaction, i) => {
                const { sender, receiver, timestamp, value, currency } = transaction;

                const isTransactionToday = isToday(timestamp * 1000);
                const isTransactionYesterday = isYesterday(timestamp * 1000);

                let timeLabel = "";

                if (isTransactionToday) {
                  timeLabel = formatDistanceToNow(timestamp * 1000, {
                    addSuffix: true,
                  });
                } else if (isTransactionYesterday) {
                  timeLabel = `Yesterday ${format(timestamp * 1000, "h:mmaaa")}`;

                } else {
                  timeLabel = format(timestamp * 1000, "dd.MM.yy h:mmaaa");
                }


                return <motion.tr 
                    key={`${timestamp}-${i}`}
                    variants={{
                      enter: { opacity: [0, 1] },
                      ready: { opacity: 1 },
                      exit: { opacity: 0 },
                      transitioning: { opacity: [0.75, 1, 0.75], transition: { duration: 1.5, repeat: Infinity } },
                    }}

                  >
                  <td>
                    <Text>{currency} {ActivityLabel(transaction, address)}</Text>
                  </td>
                  <td>
                    {value.toLocaleString("en-US", { style: "currency", currency: "USD" })}
                  </td>
                  <td>
                    -
                  </td>
                  <td>
                    {sender === address ? receiver : sender}
                  </td>
                  <td>
                    {timeLabel}
                  </td>
                </motion.tr>
              })}
          </motion.tbody>
            </AnimatePresence>
        </table>
        <motion.div className="pagination" layout="position">
          {Array.from(Array(pageCount).keys()).map((_, i) => {
            return <Link key={i} to={`?page=${i + 1}`}>{i + 1}</Link>
          }
          )}
        </motion.div>
      </section>
    </>
  );
}
