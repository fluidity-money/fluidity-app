import { json, LoaderFunction } from "@remix-run/node";
import {
  useVolumeStats,
  useVolumeStatsByAddress,
} from "~/queries/useVolumeStats";
import { TotalVolume } from "~/routes/$network/query/dashboard/home";

export type ArbitrumVolumeLoaderData = {
  volume?: TotalVolume;
  loaded: boolean;
};

export const loader: LoaderFunction = async ({ request }) => {
  const network = "solana";

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
