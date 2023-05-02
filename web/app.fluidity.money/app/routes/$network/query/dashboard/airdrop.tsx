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

const EPOCH_DAYS_TOTAL = 31;
// temp: april 19th, 2023
const EPOCH_START_DATE = new Date(2023, 3, 20);

const dayDifference = (date1: Date, date2: Date) =>
  Math.ceil(Math.abs(date1.getTime() - date2.getTime()) / 1000 / 60 / 60 / 24);

export const loader: LoaderFunction = async ({ params, request }) => {
  const { network } = params;

  const url = new URL(request.url);
  const address = url.searchParams.get("address");

  if (!address || !network) throw new Error("Invalid Request");

  const daysElapsed =
    dayDifference(new Date(), EPOCH_START_DATE) % EPOCH_DAYS_TOTAL;

  try {
    const { data: airdropStatsData, errors: airdropStatsErrors } =
      await useAirdropStatsByAddress(address);
    const { data: stakingData, errors: stakingErrors } =
      await useStakingDataByAddress(address, daysElapsed);

    if (airdropStatsErrors || !airdropStatsData) throw airdropStatsErrors;
    if (stakingErrors || !stakingData) throw stakingErrors;

    const {
      lootboxCounts: [bottleTiers],
      liquidityMultiplier: [liquidityMultiplierRes],
      referralsCount: {
        aggregate: { count: referralsCount },
      },
    } = airdropStatsData;
    const { stakes } = stakingData;

    return json({
      liquidityMultiplier: liquidityMultiplierRes?.result || 0,
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
