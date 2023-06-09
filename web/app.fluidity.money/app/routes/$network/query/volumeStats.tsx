import { json, LoaderFunction } from "@remix-run/node";
import {
  useVolumeTxByAddressTimestamp,
  useVolumeTxByTimestamp,
} from "~/queries/useVolumeTx";
import config from "~/webapp.config.server";
import {TotalVolume} from "./dashboard/home";

export type Volume = {
  amount: number;
  symbol: string;
  timestamp: number;
  sender: string;
  receiver: string;
};

export type VolumeLoaderData = {
  volume?: TotalVolume;
  // volumeAll for processing graph data
  volumeAll?: Volume[];
  loaded: boolean;
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const { network } = params;

  if (!network) return;

  const url = new URL(request.url);
  const address = url.searchParams.get("address");

  // Postprocess res
  const fdaiPostprocess = (volume: Volume) =>
    network === "arbitrum"
      ? volume
      : {
          ...volume,
          amount: volume.amount / 10 ** 12,
        };

  const { fluidAssets } = config.config[network ?? ""];

  if (!fluidAssets) return;

  const prevYear = new Date().getFullYear() - 1;

  const prevYearDate = new Date();

  prevYearDate.setFullYear(prevYear);

  const prevYearIso = prevYearDate.toISOString();

  const volumesRes = address
    ? await useVolumeTxByAddressTimestamp(
        network,
        fluidAssets,
        address,
        prevYearIso
      )
    : await useVolumeTxByTimestamp(network, fluidAssets, prevYearIso);

  const parsedVolume = volumesRes.data?.[network].transfers.map((transfer) => ({
    symbol: transfer.currency.symbol,
    amount: parseFloat(String(transfer.amount)) || 0,
    timestamp: transfer.block.timestamp.unixtime * 1000,
    sender: transfer.sender.address,
    receiver: transfer.receiver.address,
  }));

  const daiSanitisedVolumes = parsedVolume?.map((volume) =>
    volume.symbol === "fDAI" ? fdaiPostprocess(volume) : volume
  );

  const volumeStats = daiSanitisedVolumes?.reduce((totalVolume, current) => {
    return {
      ...totalVolume,
      day: isDay(current.timestamp) ? [{
        totalVolume: totalVolume.day[0].totalVolume + current.amount,
        actionCount: totalVolume.day[0].actionCount + 1,
      }] as typeof totalVolume["day"] : totalVolume.day,

      week: isWeek(current.timestamp) ? [{
        totalVolume: totalVolume.week[0].totalVolume + current.amount,
        actionCount: totalVolume.week[0].actionCount + 1,
      }] as typeof totalVolume["week"] : totalVolume.week,

      month: isMonth(current.timestamp) ? [{
        totalVolume: totalVolume.month[0].totalVolume + current.amount,
        actionCount: totalVolume.month[0].actionCount + 1,
      }] as typeof totalVolume["month"] : totalVolume.month,

      year: isYear(current.timestamp) ? [{
        totalVolume: totalVolume.year[0].totalVolume + current.amount,
        actionCount: totalVolume.year[0].actionCount + 1,
      }] as typeof totalVolume["year"] : totalVolume.year,

      all: [{
        totalVolume: totalVolume.all[0].totalVolume + current.amount,
        actionCount: totalVolume.all[0].actionCount + 1,
      }] as typeof totalVolume["all"]
    };
  }, {
    day: [{totalVolume: 0, actionCount: 0}],
    week: [{totalVolume: 0, actionCount: 0}],
    month: [{totalVolume: 0, actionCount: 0}],
    year: [{totalVolume: 0, actionCount: 0}],
    all: [{totalVolume: 0, actionCount: 0}],
  } as TotalVolume)

  if (!volumeStats) return;

  return json({
    volume: volumeStats,
    volumeAll: daiSanitisedVolumes,
    loaded: true,
  } satisfies VolumeLoaderData);
};

const isDay   = (timestamp: number) => timestamp > Date.now() - 24 * 60 * 60 * 1000
const isWeek  = (timestamp: number) => timestamp > Date.now() - 7 * 24 * 60 * 60 * 1000
const isMonth = (timestamp: number) => timestamp > Date.now() - 30 * 24 * 60 * 60 * 1000
const isYear  = (timestamp: number) => timestamp > Date.now() - 365 * 24 * 60 * 60 * 1000
