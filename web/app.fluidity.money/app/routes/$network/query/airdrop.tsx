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

export type AirdropLeaderboardEntry = {
  rank: number;
  user: string;
  bottles: number;
  liquidityMultiplier: number;
  highestRewardTier: number;
  referralCount: number;
};

export type BottleCounts = {
  tier1: number;
  tier2: number;
  tier3: number;
  tier4: number;
  tier5: number;
  totalBottles: number;
};

type AirdropLoaderData = {
  epochDaysTotal: number;
  epochDaysRemaining: number;
  referralsCount: number;
  bottleCounts: BottleCounts;
  liquidityMultiplier: number;
  stakes: Array<StakingEvent>;
};

const EPOCH_DAYS_TOTAL = 31;

// temp: april 19th, 2023
const EPOCH_START_DATE = new Date(2023, 3, 20);
export const dayDifference = (date1: Date, date2: Date) =>
  Math.ceil(Math.abs(date1.getTime() - date2.getTime()) / 1000 / 60 / 60 / 24);

// total - (now - start)
const EpochDaysRemaining = () =>
  EPOCH_DAYS_TOTAL - dayDifference(new Date(), EPOCH_START_DATE);

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
      lootboxCounts: bottleCounts,
      liquidityMultiplier: { result: liquidityMultiplier },
      referralsCount: {
        aggregate: { count: referralsCount },
      },
    } = airdropStatsData;
    const { stakes } = stakingData;

    return json({
      epochDaysTotal: EPOCH_DAYS_TOTAL,
      epochDaysRemaining: EpochDaysRemaining(),
      liquidityMultiplier,
      referralsCount,
      bottleCounts,
      stakes,
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
