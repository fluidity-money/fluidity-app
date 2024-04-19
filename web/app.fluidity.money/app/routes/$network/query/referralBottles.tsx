import type { LoaderFunction } from "@remix-run/node";
import type { BottleTiers } from "./dashboard/airdrop";

import { Rarity } from "@fluidity-money/surfing";
import { json } from "@remix-run/node";
import { useReferralLootboxesByAddress } from "~/queries/useLootBottlesCount";

export type ReferralBottlesCountLoaderData = {
  bottleTiers: BottleTiers;
  bottlesCount: number;
  loaded: boolean;
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);

  const address_ = url.searchParams.get("address") ?? "";
  const epoch = url.searchParams.get("epoch");

  const address = address_.toLocaleLowerCase();

  if (!address || !epoch) throw new Error("Invalid Request");

  const { data: referralBottleCountData, errors: referralBottleCountErr } =
    await useReferralLootboxesByAddress(epoch, address);

  if (referralBottleCountErr || !referralBottleCountData) {
    throw new Error(
      `Could not fetch Referral Bottles ${JSON.stringify(
        referralBottleCountErr
      )}`
    );
  }

  const {
    referralLootboxCounts: [referralLootbottles_],
  } = referralBottleCountData;

  const referralLootbottles = referralLootbottles_ || {
    [Rarity.Common]: 0,
    [Rarity.Uncommon]: 0,
    [Rarity.Rare]: 0,
    [Rarity.UltraRare]: 0,
    [Rarity.Legendary]: 0,
  };

  return json({
    bottleTiers: referralLootbottles,
    bottlesCount: Object.values(referralLootbottles).reduce(
      (sum: number, quantity: number) => sum + quantity,
      0
    ),
    loaded: true,
  } satisfies ReferralBottlesCountLoaderData);
};
