import { LoaderFunction, json } from "@remix-run/node";
import { captureException } from "@sentry/react";
import config from "~/webapp.config.server";
import { useUserTransactionCountByAddressTimestamp } from "~/queries";

export type ProjectedWinData = {
  projectedWin: number;
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const { network } = params;

  const url = new URL(request.url);
  const address = url.searchParams.get("address");

  const { tokens } = config.config[network ?? ""];

  if (!address || !tokens) throw new Error("Invalid Request");

  const lastWeekDate = new Date();

  const lastWeek = lastWeekDate.getDate() - 7;
  lastWeekDate.setDate(lastWeek);
  const lastWeekIso = lastWeekDate.toISOString();

  try {
    const { data: userTransactionCountData, errors: userTransactionCountErr } =
      await useUserTransactionCountByAddressTimestamp(
        network ?? "",
        address,
        lastWeekIso
      );

    if (userTransactionCountErr || !userTransactionCountData) {
      captureException(userTransactionCountErr, {
        tags: {
          section: "opportunity",
        },
      });

      return new Error("Server could not fulfill request");
    }

    const {
      [network as string]: {
        transfers: [{ count }],
      },
    } = userTransactionCountData;

    const estimated1MPoolWeight = 0.076;

    const projectedWin = count * estimated1MPoolWeight;

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
