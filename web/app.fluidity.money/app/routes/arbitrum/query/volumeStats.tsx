import { json, LoaderFunction } from "@remix-run/node";
import {
  useVolumeStats,
  useVolumeStatsByAddress,
} from "~/queries/useVolumeStats";

export type ArbitrumVolume = {
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

export type ArbitrumVolumeLoaderData = {
  volume?: ArbitrumVolume;
  loaded: boolean;
};

export const loader: LoaderFunction = async ({ request }) => {
  const network = "arbitrum";

  const url = new URL(request.url);
  const address = url.searchParams.get("address");

  const { data: volumeData, errors: volumeErrors } = address
    ? await useVolumeStatsByAddress(network, address)
    : await useVolumeStats(network);

  if (!volumeData || volumeErrors) throw volumeErrors;

  return json({
    volume: volumeData,
    loaded: true,
  } satisfies ArbitrumVolumeLoaderData);
};
