import { Rarity } from "@fluidity-money/surfing";
import { LoaderFunction, json } from "@remix-run/node";
import { captureException } from "@sentry/react";
import { useAirdropStatsByAddress } from "~/queries/useAirdropStats";
import { useStakingDataByAddress } from "~/queries/useStakingData";

export type StakingEvent = {
  amount: number;
  durationDays: number;
  multiplier: number;
  insertedDate: string;
};

export type BottleTiers = {
  [Rarity.Common]: number;
  [Rarity.Uncommon]: number;
  [Rarity.Rare]: number;
  [Rarity.UltraRare]: number;
  [Rarity.Legendary]: number;
};

export type AirdropLoaderData = {
  referralsCount: number;
  bottleTiers: BottleTiers;
  bottlesCount: number;
  liquidityMultiplier: number;
  stakes: Array<StakingEvent>;
  loaded: boolean;
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const { network } = params;

  const url = new URL(request.url);
  const address = url.searchParams.get("address");

  if (!address || !network) throw new Error("Invalid Request");

  try {
    const { data: airdropStatsData, errors: airdropStatsErrors } =
      await useAirdropStatsByAddress(address);
    const { data: stakingData, errors: stakingErrors } =
      await useStakingDataByAddress(network, address);

    if (airdropStatsErrors || !airdropStatsData) throw airdropStatsErrors;
    if (stakingErrors || !stakingData) throw stakingErrors;

    const {
      lootboxCounts: bottleTiers,
      liquidityMultiplier: { result: liquidityMultiplier },
      referralsCount: {
        aggregate: { count: referralsCount },
      },
    } = airdropStatsData;
    const { stakes } = stakingData;

    return json({
      liquidityMultiplier,
      referralsCount,
      bottleTiers,
      bottlesCount: Object.values(bottleTiers).reduce(
        (sum: number, quantity: number) => sum + quantity,
        0
      ),
      stakes,
      loaded: true,
    } satisfies AirdropLoaderData);
  } catch (err) {
    captureException(new Error(`Could not fetch airdrop data: ${err}`), {
      tags: {
        section: "network/index",
      },
    });
    return new Error("Server could not fulfill request");
  }
};
