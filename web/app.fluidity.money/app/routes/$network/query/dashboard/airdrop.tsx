import { Chain } from "~/util/chainUtils/chains";
import { Rarity } from "@fluidity-money/surfing";
import { JsonRpcProvider } from "@ethersproject/providers";
import { LoaderFunction, json } from "@remix-run/node";
import { captureException } from "@sentry/react";
import { useAirdropStatsByAddress } from "~/queries/useAirdropStats";
import { useLootboxConfig } from "~/queries";
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
  wethPrice: number;
  usdcPrice: number;
  referralCode?: string;
  programBegin: Date;
  programEnd: Date;
  epochDaysTotal: number;
  epochDaysElapsed: number;
  epochIdentifier: string;
  ethereumApplication: string;
  epochFound: boolean;
  loaded: boolean;
};

const MAINNET_ID = 0;

const dayDifference = (date1: Date, date2: Date) =>
  Math.ceil(Math.abs(date1.getTime() - date2.getTime()) / 1000 / 60 / 60 / 24);

export const loader: LoaderFunction = async ({ params, request }) => {
  const { network } = params;

  const url = new URL(request.url);
  const address_ = url.searchParams.get("address") ?? "";
  const epochIdentifier = url.searchParams.get("epoch") ?? "";

  const address = address_?.toLowerCase();

  if (!network || !epochIdentifier)
    throw new Error("Invalid Request");

  const { data, errors } = await useLootboxConfig({
    identifier: epochIdentifier,
    shouldFind: false,
  });

  if (errors) {
    captureException(errors, {
      tags: {
        section: "airdrop",
      },
    });

    return new Error("Server could not fulfill request");
  }

  if (!data) {
    // return defaults
    return null;
  }

  const { lootboxConfig: configs } = data;

  // if we didn't find anything, then we need to return the defaults

  if (configs.length != 1) {
    return null;
  }

  const {
    programBegin: programBegin_,
    programEnd: programEnd_,
    ethereumApplication,
    found: epochFound,
  } = configs[0];

  const programBegin = new Date(programBegin_);
  const programEnd = new Date(programEnd_);

  const epochDaysTotal = Math.round(
    (programEnd.valueOf() - programBegin.valueOf()) / (1000 * 60 * 60 * 24)
  );

  const epochDaysElapsed =
    dayDifference(new Date(), programBegin) % epochDaysTotal;

  const infuraRpc = config.drivers[network][MAINNET_ID].rpc.http;
  const provider = new JsonRpcProvider(infuraRpc);

  const eacAggregatorProxyAddr =
    config.contract.eac_aggregator_proxy[network as Chain];

  try {
    const [{ data: airdropStatsData, errors: airdropStatsErrors }, wethPrice] =
      await Promise.all([
        useAirdropStatsByAddress(address, epochIdentifier),
        getWethUsdPrice(
          provider,
          eacAggregatorProxyAddr,
          EACAggregatorProxyAbi
        ),
      ]);

    if (airdropStatsErrors || !airdropStatsData) throw airdropStatsErrors;

    const {
      lootboxCounts: [bottleTiers_],
      liquidityMultiplier: [liquidityMultiplierRes],
      referralsCount: {
        aggregate: { count: referralsCount },
      },
    } = airdropStatsData;

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
      wethPrice,
      usdcPrice: 1,
      loaded: true,
      programBegin,
      programEnd,
      epochDaysTotal,
      epochDaysElapsed,
      epochIdentifier,
      epochFound,
      ethereumApplication,
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
