import { json, LoaderFunction } from "@remix-run/node";
import {captureException} from "@sentry/remix";
import BN from "bn.js";
import {
  useVolumeTxByAddressTimestamp,
  useVolumeTxByTimestamp,
} from "~/queries/useVolumeTx";
import {useSplitExperiment} from "~/util/server/split";
import config from "~/webapp.config.server";

export type Volume = {
  amount: number;
  symbol: string;
  timestamp: number;
  sender: string;
  receiver: string;
};

type UnprocessedVolume = Omit<Volume, "amount"> & { amount: string };

export const loader: LoaderFunction = async ({ params, request }) => {
  const { network } = params;

  const url = new URL(request.url);
  const address = url.searchParams.get("address");
  const useMoralis = useSplitExperiment("enable-moralis", true);

  if (!network)
    return;

  const tokenDecimals = config.config[network ?? ""].tokens
    .filter((entry) => entry.isFluidOf !== undefined)
    .reduce(
      (previous, token) => ({ ...previous, [token.symbol]: token.decimals }),
      {} as { [symbol: string]: number }
    );

  // Postprocess res
  const postprocess = (volume: UnprocessedVolume) => {
    const bn = new BN(volume.amount);
    const decimals = new BN(10).pow(new BN(tokenDecimals[volume.symbol]));
    const amount = bn.div(decimals).toNumber();

    return {
      ...volume,
      amount: amount,
    };
  };

  const fluidAssets = config.config[network ?? ""].tokens
    .filter((entry) => entry.isFluidOf !== undefined)
    .reduce(
      (previous, token) => ({ ...previous, [token.address]: token.symbol }),
      {}
    );

  if (!fluidAssets) return;

  const prevYear = new Date().getFullYear() - 1;

  const prevYearDate = new Date();

  prevYearDate.setFullYear(prevYear);

  const prevYearIso = prevYearDate.toISOString();

  const {data: volumeData, errors: volumeErr }= address
    ? await useVolumeTxByAddressTimestamp(network, fluidAssets, address, prevYearIso, useMoralis)
    : await useVolumeTxByTimestamp(network, fluidAssets, prevYearIso, useMoralis);

    if (!volumeData || volumeErr) {
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

  const parsedVolume = volumeData[network].transfers.map((transfer) => ({
    symbol: transfer.currency.symbol,
    amount: transfer.amount,
    timestamp: transfer.block.timestamp.unixtime,
    sender: transfer.sender.address,
    receiver: transfer.receiver.address,
  }));

  const sanitisedVolumes = parsedVolume.map(postprocess);

  return json({
    volume: sanitisedVolumes,
  });
};
