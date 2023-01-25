import { LoaderFunction, json } from "@remix-run/node";
import { captureException } from "@sentry/react";
import config from "~/webapp.config.server";
import { useUserTransactionsByAddress } from "~/queries";
import { decimalsPostprocess } from "./userTransactions";
import { useSplitExperiment } from "~/util/server/split";

export type ProjectedWinData = {
  projectedWin: number;
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const { network } = params;

  const url = new URL(request.url);
  const address = url.searchParams.get("address");
  const useMoralis = useSplitExperiment("enable-moralis", true);

  const { tokens } = config.config[network ?? ""];

  if (!address || !tokens) throw new Error("Invalid Request");

  const tokenAddrs = tokens
    .filter((t) => !t.isFluidOf)
    .reduce(
      (previous, token) => ({ ...previous, [token.address]: token.symbol }),
      {}
    );

  const tokenDecimals = tokens
    .filter((entry) => entry.isFluidOf !== undefined)
    .reduce(
      (previous, token) => ({ ...previous, [token.symbol]: token.decimals }),
      {} as { [symbol: string]: number }
    );

  try {
    const { data: userTransactionsData, errors: userTransactionsErr } =
      await useUserTransactionsByAddress(
        network ?? "",
        tokenAddrs,
        1,
        address,
        [],
        useMoralis,
        50
      );

    if (userTransactionsErr || !userTransactionsData) {
      captureException(userTransactionsErr, {
        tags: {
          section: "opportunity",
        },
      });

      return new Error("Server could not fulfil request");
    }

    const {
      [network as string]: { transfers: transactions },
    } = userTransactionsData;

    // Destructure GraphQL data
    const totalUserTransferValue = transactions.reduce((sum, transaction) => {
      const {
        amount: value,
        currency: { symbol: currency },
      } = transaction;

      // Bitquery stores DAI decimals (6) incorrectly (should be 18)
      const normalisedValue = decimalsPostprocess(
        value,
        currency,
        tokenDecimals[currency]
      );

      return sum + normalisedValue;
    }, 0);

    const estimated1MPoolWeight = 0.076;

    const projectedWin = totalUserTransferValue * estimated1MPoolWeight;

    return json({
      projectedWin,
    } as ProjectedWinData);
  } catch (err) {
    captureException(new Error(`Could not fetch historical rewards: ${err}`), {
      tags: {
        section: "network/index",
      },
    });
    return new Error("Server could not fulfill request");
  }
};
