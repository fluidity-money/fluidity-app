import { Chain } from "~/util/chainUtils/chains";
import { Rarity } from "@fluidity-money/surfing";
import { JsonRpcProvider } from "@ethersproject/providers";
import { LoaderFunction, json } from "@remix-run/node";
import { captureException } from "@sentry/react";
import { useAirdropStatsByAddress } from "~/queries/useAirdropStats";
import { useStakingDataByAddress } from "~/queries/useStakingData";
import { getWethUsdPrice } from "~/util/chainUtils/ethereum/transaction";
import EACAggregatorProxyAbi from "~/util/chainUtils/ethereum/EACAggregatorProxy.json";
import config from "~/webapp.config.server";

export type StakingEvent = {
  amountUsd: number;
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
  wethPrice: number;
  usdcPrice: number;
  loaded: boolean;
  referralCode?: string;
};

const EPOCH_DAYS_TOTAL = 31;
// temp: april 19th, 2023
const EPOCH_START_DATE = new Date(2023, 3, 20);

const MAINNET_ID = 0;

const dayDifference = (date1: Date, date2: Date) =>
  Math.ceil(Math.abs(date1.getTime() - date2.getTime()) / 1000 / 60 / 60 / 24);

export const loader: LoaderFunction = async ({ params, request }) => {
  const { network } = params;

  const url = new URL(request.url);
  const address_ = url.searchParams.get("address");

  const address = address_?.toLowerCase();

  if (!address || !network) throw new Error("Invalid Request");

  const daysElapsed =
    dayDifference(new Date(), EPOCH_START_DATE) % EPOCH_DAYS_TOTAL;

  const infuraRpc = config.drivers[network][MAINNET_ID].rpc.http;
  const provider = new JsonRpcProvider(infuraRpc);

  const eacAggregatorProxyAddr =
    config.contract.eac_aggregator_proxy[network as Chain];

  try {
    const [
      { data: airdropStatsData, errors: airdropStatsErrors },
      { data: stakingData, errors: stakingErrors },
      wethPrice,
    ] = await Promise.all([
      useAirdropStatsByAddress(address),
      useStakingDataByAddress(address, daysElapsed),
      getWethUsdPrice(provider, eacAggregatorProxyAddr, EACAggregatorProxyAbi),
    ]);

    if (airdropStatsErrors || !airdropStatsData) throw airdropStatsErrors;
    if (stakingErrors || !stakingData) throw stakingErrors;

    const {
      lootboxCounts: [bottleTiers_],
      liquidityMultiplier: [liquidityMultiplierRes],
      referralsCount: {
        aggregate: { count: referralsCount },
      },
    } = airdropStatsData;

    const stakes = stakingData.stakes.map(
      ({ multiplier, durationSecs, amount, ...stake }) => ({
        ...stake,
        amountUsd: amount / 1e6,
        durationDays: durationSecs / 60 / 60 / 24,
        multiplier: multiplier[0].result,
      })
    );

    const bottleTiers = bottleTiers_ || {
      [Rarity.Common]: 0,
      [Rarity.Uncommon]: 0,
      [Rarity.Rare]: 0,
      [Rarity.UltraRare]: 0,
      [Rarity.Legendary]: 0,
    };

    return json({
      liquidityMultiplier: liquidityMultiplierRes?.result || 0,
      referralsCount,
      bottleTiers,
      bottlesCount: Object.values(bottleTiers).reduce(
        (sum: number, quantity: number) => sum + quantity,
        0
      ),
      stakes,
      wethPrice,
      usdcPrice: 1,
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
