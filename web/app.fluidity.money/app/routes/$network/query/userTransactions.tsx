import { LoaderFunction, json, redirect } from "@remix-run/node";
import { useUserTransactionCount, useUserTransactions } from "~/queries";
import { captureException } from "@sentry/react";

export const loader: LoaderFunction = async ({ params, request }) => {
  const { network } = params;

  const url = new URL(request.url);
  const address = url.searchParams.get("address");
  const page_ = url.searchParams.get("page");

  if (!network || !address || !page_) return new Error("Invalid Request");

  const page = parseInt(page_);

  if (!page || page < 1) return new Error("Invalid Request");

  const [
    { data: userTransactionCountData, errors: userTransactionCountErr },
    { data: userTransactionsData, errors: userTransactionsErr },
  ] = await Promise.all([
    useUserTransactionCount(network, address),
    useUserTransactions(network, address, page),
  ]);

  if (!userTransactionCountData || userTransactionCountErr) {
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

    return new Error("Server could not fulfill request");
  }

  const {
    [network as string]: {
      transfers: [{ count: txCount }],
    },
  } = userTransactionCountData;

  if (Math.ceil(txCount / 12) < page && txCount > 0) {
    return redirect(`./`, 301);
  }

  if (!userTransactionsData || userTransactionsErr) {
    captureException(
      new Error(
        `Could not fetch User Transactions for ${address}, on ${network}`
      ),
      {
        tags: {
          section: "dashboard",
        },
      }
    );

    return new Error("Server could not fulfill request");
  }

  const {
    [network as string]: { transfers: transactions },
  } = userTransactionsData;

  // Destructure GraphQL data
  const sanitizedTransactions = transactions.map((transaction) => {
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
  });

  return json({
    transactions: sanitizedTransactions,
    count: txCount,
  });
};
