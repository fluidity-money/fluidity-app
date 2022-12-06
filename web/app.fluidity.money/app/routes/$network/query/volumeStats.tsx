import { json, LoaderFunction } from "@remix-run/node";
import BN from "bn.js";
import {
  useVolumeTxByAddressTimestamp,
  useVolumeTxByTimestamp,
} from "~/queries/useVolumeTx";
import config from "~/webapp.config.server";

export type Volume = {
  amount: number;
  symbol: string;
  timestamp: number;
  sender: string;
  receiver: string;
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const { network } = params;

  const url = new URL(request.url);
  const address = url.searchParams.get("address");

  // Postprocess res
  const fdaiPostprocess = (volume: Volume) => {
    return {
      ...volume,
      amount: volume.amount / 10 ** 12,
    };
  };

  const { fluidAssets } = config.config[network ?? ""];

  if (!fluidAssets) return;

  const prevYear = new Date().getFullYear() - 1;

  const prevYearDate = new Date();

  prevYearDate.setFullYear(prevYear);

  const prevYearIso = prevYearDate.toISOString();

  const volumesRes = address
    ? await useVolumeTxByAddressTimestamp(fluidAssets, address, prevYearIso)
    : await useVolumeTxByTimestamp(fluidAssets, prevYearIso);

  const parsedVolume = volumesRes.data.ethereum.transfers.map((transfer) => ({
    symbol: transfer.currency.symbol,
    amount: parseFloat(transfer.amount) || 0,
    timestamp: transfer.block.timestamp.unixtime * 1000,
    sender: transfer.sender.address,
    receiver: transfer.receiver.address,
  }));

  const daiSanitisedVolumes = parsedVolume.map((volume) =>
    volume.symbol === "fDAI" ? fdaiPostprocess(volume) : volume
  );

  return json({
    volume: daiSanitisedVolumes,
  });
};
