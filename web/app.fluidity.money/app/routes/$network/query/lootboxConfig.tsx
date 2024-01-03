import { LoaderFunction, json } from "@remix-run/node";
import { captureException } from "@sentry/react";
import config from "~/webapp.config.server";
import { useLootboxConfig } from "~/queries";

export type LootboxConfig = {
  found: boolean;
  programBegin: Date;
  programEnd: Date;
  epochIdentifier: string;
  ethereumApplication: string;
  loaded: boolean;
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const { network } = params;

  const url = new URL(request.url);

  try {
    const { data, errors } = await useLootboxConfig();

    if (errors || !data) {
      captureException(errors, {
        tags: {
          section: "airdrop",
        },
      });

      return new Error("Server could not fulfill request");
    }

    const { programBegin, programEnd, epochIdentifier, ethereumApplication } = data;

    return json({
      found: true,
      programBegin,
      programEnd,
      epochIdentifier,
      ethereumApplication,
      loaded: true,
    } satisfies LootboxConfig);
  } catch (err) {
    captureException(new Error(`Could not fetch lootbox config: ${err}`), {
      tags: {
        section: "network/index",
      },
    });
    return new Error("Server could not fulfill request");
  }
};
