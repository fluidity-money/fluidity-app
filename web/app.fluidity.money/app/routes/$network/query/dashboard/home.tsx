import { Chain } from "~/util/chainUtils/chains";
import type { Volume } from "../volumeStats";
import type { TimeSepUserYield } from "~/queries/useUserYield";
import { LoaderFunction, json } from "@remix-run/node";
import { jsonGet } from "~/util";
import { useUserYieldAll, useUserYieldByAddress } from "~/queries";
import config from "~/webapp.config.server";
import { GraphData, GraphEntry } from "~/queries/useGraphData";

export type TotalVolume = {
  day: [
    {
      totalVolume: number;
      actionCount: number;
    }
  ];
  week: [
    {
      totalVolume: number;
      actionCount: number;
    }
  ];
  month: [
    {
      totalVolume: number;
      actionCount: number;
    }
  ];
  year: [
    {
      totalVolume: number;
      actionCount: number;
    }
  ];
  all: [
    {
      totalVolume: number;
      actionCount: number;
    }
  ];
};

export type HomeLoaderData = {
  rewards: TimeSepUserYield;
  volumeStats: TotalVolume;
  graph: GraphData;
  totalFluidPairs: number;
  network: Chain;
  timestamp: number;
  loaded: boolean;
};

const binTransactions = (bins: Volume[], txs: Volume[]): GraphEntry[] => {
  const txMappedBins: Volume[][] = bins.map((bin) => [bin]);

  let binIndex = 0;
  txs.every((tx) => {
    while (tx.timestamp < bins[binIndex].timestamp) {
      binIndex++;

      if (binIndex >= bins.length) return false;
    }

    txMappedBins[binIndex].push(tx);
    return true;
  });

  const maxTxMappedBins = txMappedBins
    .map((txs, i) => {
      const tx =
        txs.find(
          (tx) => tx.amount === Math.max(...txs.map(({ amount }) => amount))
        ) || bins[i];
      const time = new Date(tx.timestamp * 1000);

      return {
        amount: tx.amount,
        sender_address: tx.sender,
        timestamp: tx.timestamp,
        time: time.toUTCString(),
        bucket: new Date(
          time.getUTCFullYear(),
          time.getUTCMonth(),
          time.getUTCDay()
        ).toUTCString(),
      };
    })
    .reverse();

  const [txMappedBinsStart, ...rest] = maxTxMappedBins.filter(
    (tx) => tx.amount
  );

  if (!txMappedBinsStart) return maxTxMappedBins;

  const txMappedBinsEnd = rest.pop();

  const maxTxs = maxTxMappedBins.filter(
    (tx, i) =>
      tx.amount ||
      i === 0 ||
      i === maxTxMappedBins.length - 1 ||
      (tx.timestamp < txMappedBinsStart.timestamp &&
        txMappedBinsEnd &&
        tx.timestamp > txMappedBinsEnd.timestamp)
  );

  return maxTxs;
};

const graphEmptyVolume = (time: number, amount = 0): Volume => ({
  sender: "",
  receiver: "",
  timestamp: time,
  amount,
  symbol: "",
});

const GRAPH_TRANSFORMERS = {
  day: {
    transform: (vols: Volume[]): GraphEntry[] => {
      const entries = 24;
      const unixHourInc = 60 * 60 * 1000;
      const unixNow = Date.now();

      const mappedTxBins = Array.from({ length: entries }).map((_, i) => ({
        ...graphEmptyVolume(unixNow - (i + 1) * unixHourInc),
      }));

      return binTransactions(mappedTxBins, vols);
    },
  },
  week: {
    transform: (vols: Volume[]) => {
      //const entries = 21;
      //const unixEightHourInc = 8 * 60 * 60 * 1000;
      const entries = 7;
      const unixEightHourInc = 24 * 60 * 60 * 1000;
      const unixNow = Date.now();

      const mappedTxBins = Array.from({ length: entries }).map((_, i) => ({
        ...graphEmptyVolume(unixNow - (i + 1) * unixEightHourInc),
      }));

      return binTransactions(mappedTxBins, vols);
    },
  },
  month: {
    transform: (vols: Volume[]) => {
      const entries = 30;
      const unixDayInc = 24 * 60 * 60 * 1000;
      const unixNow = Date.now();

      const mappedTxBins = Array.from({ length: entries }).map((_, i) => ({
        ...graphEmptyVolume(unixNow - (i + 1) * unixDayInc),
      }));

      return binTransactions(mappedTxBins, vols);
    },
  },
  year: {
    transform: (vols: Volume[]) => {
      const entries = 12;
      const unixBimonthlyInc = 30 * 24 * 60 * 60 * 1000;
      const unixNow = Date.now();

      const mappedTxBins = Array.from({ length: entries }).map((_, i) => ({
        ...graphEmptyVolume(unixNow - (i + 1) * unixBimonthlyInc),
      }));

      return binTransactions(mappedTxBins, vols);
    },
  },
};

const TIME_FILTERS = {
  day: {
    filter: <T extends { timestamp: number }>({ timestamp }: T) =>
      timestamp > Date.now() - 24 * 60 * 60 * 1000,
  },
  week: {
    filter: <T extends { timestamp: number }>({ timestamp }: T) =>
      timestamp > Date.now() - 7 * 24 * 60 * 60 * 1000,
  },
  month: {
    filter: <T extends { timestamp: number }>({ timestamp }: T) =>
      timestamp > Date.now() - 30 * 24 * 60 * 60 * 1000,
  },
  year: {
    filter: <T extends { timestamp: number }>({ timestamp }: T) =>
      timestamp > Date.now() - 365 * 24 * 60 * 60 * 1000,
  },
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const network = (params.network ?? "") as Chain;

  const url = new URL(request.url);
  const address = url.searchParams.get("address");

  const fluidPairs = config.config[network ?? ""].fluidAssets.length;

  const timestamp = new Date().getTime();

  try {
    const [{ volume, volumeAll }, { data: rewardsData, errors: rewardsErr }] =
      await Promise.all([
        address
          ? jsonGet<
              { address: string },
              { volume: TotalVolume; volumeAll: Volume[] }
            >(`${url.origin}/${network}/query/volumeStats`, {
              address,
            })
          : jsonGet<
              Record<string, never>,
              { volume: TotalVolume; volumeAll: Volume[] }
            >(`${url.origin}/${network}/query/volumeStats`),
        address
          ? useUserYieldByAddress(network ?? "", address)
          : useUserYieldAll(network ?? ""),
      ]);

    if (!volume) {
      throw new Error("Could not fetch volume data");
    }

    if (rewardsErr || !rewardsData) {
      throw new Error("Could not fetch rewards data");
    }

    const filteredVolume = {
      day: volumeAll.filter(TIME_FILTERS.day.filter),
      week: volumeAll.filter(TIME_FILTERS.week.filter),
      month: volumeAll.filter(TIME_FILTERS.month.filter),
      year: volumeAll.filter(TIME_FILTERS.year.filter),
    };

    const graphData: GraphData = {
      day: GRAPH_TRANSFORMERS.day.transform(filteredVolume.day),
      week: GRAPH_TRANSFORMERS.week.transform(filteredVolume.week),
      month: GRAPH_TRANSFORMERS.month.transform(filteredVolume.month),
      year: GRAPH_TRANSFORMERS.year.transform(filteredVolume.year),
    };

    return json({
      rewards: rewardsData,
      graph: graphData,
      volumeStats: volume,
      totalFluidPairs: fluidPairs,
      network,
      timestamp,
      loaded: true,
    } satisfies HomeLoaderData);
  } catch (err) {
    console.log(err);
    throw new Error(`Could not fetch Transactions on ${network}: ${err}`);
  } // Fail silently - for now.
};
