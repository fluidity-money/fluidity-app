import type { LoaderFunction } from "@remix-run/node";
import type { Referral } from "~/queries/useReferrals";

import { json } from "@remix-run/node";
import {
  useReferralCodeByAddress,
  useInactiveReferralByAddress,
  useActiveReferralCountByRefereeAddress,
  useActiveReferralCountByReferrerAddress,
  useInactiveReferralCountByRefereeAddress,
} from "~/queries";
import { jsonPost } from "~/util";
import { AddReferralCodeBody, AddReferralCodeData } from "./referralCode";
import { EPOCH_CURRENT_IDENTIFIER } from "../dashboard/airdrop";

export type ReferralCountLoaderData = {
  numActiveReferrerReferrals: number;
  numActiveReferreeReferrals: number;
  numInactiveReferreeReferrals: number;
  inactiveReferrals: Array<Referral>;
  referralCode: string;
  loaded: boolean;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const network = params.network ?? "";

  const url = new URL(request.url);

  const address_ = url.searchParams.get("address") ?? "";

  const address = address_.toLocaleLowerCase();

  if (!address) {
    throw new Error("Invalid Request");
  }

  const [
    {
      data: activeReferrerReferralCountData,
      errors: activeReferrerReferralCountErr,
    },
    {
      data: activeRefereeReferralCountData,
      errors: activeRefereeReferralCountErr,
    },
    {
      data: inactiveRefereeReferralCountData,
      errors: inactiveRefereeReferralCountErr,
    },
    { data: inactiveReferralData, errors: inactiveReferralErr },
    { data: referralCodeData, errors: referralCodeErr },
  ] = await Promise.all([
    useActiveReferralCountByReferrerAddress(address, EPOCH_CURRENT_IDENTIFIER),
    useActiveReferralCountByRefereeAddress(address, EPOCH_CURRENT_IDENTIFIER),
    useInactiveReferralCountByRefereeAddress(address, EPOCH_CURRENT_IDENTIFIER),
    useInactiveReferralByAddress(address, EPOCH_CURRENT_IDENTIFIER),
    useReferralCodeByAddress(address, EPOCH_CURRENT_IDENTIFIER),
  ]);

  if (activeReferrerReferralCountErr || !activeReferrerReferralCountData) {
    throw new Error(
      `Could not fetch Referrals referrer count ${JSON.stringify(
        activeReferrerReferralCountErr
      )}`
    );
  }

  const {
    lootbox_referrals_aggregate: {
      aggregate: { count: numActiveReferrerReferrals },
    },
  } = activeReferrerReferralCountData;

  if (activeRefereeReferralCountErr || !activeRefereeReferralCountData) {
    throw new Error(
      `Could not fetch Referrals referee active count ${JSON.stringify(
        activeRefereeReferralCountErr
      )}`
    );
  }

  const {
    lootbox_referrals_aggregate: {
      aggregate: { count: numActiveReferreeReferrals },
    },
  } = activeRefereeReferralCountData;

  if (inactiveRefereeReferralCountErr || !inactiveRefereeReferralCountData) {
    throw new Error("Could not fetch Referrals");
  }

  const {
    lootbox_referrals_aggregate: {
      aggregate: { count: numInactiveReferreeReferrals },
    },
  } = inactiveRefereeReferralCountData;

  if (inactiveReferralErr || !inactiveReferralData) {
    throw new Error(
      `Could not fetch Referrals inactive count ${JSON.stringify(
        inactiveReferralErr
      )}`
    );
  }

  const { lootbox_referrals: inactiveReferrals } = inactiveReferralData;

  if (referralCodeErr || !referralCodeData) {
    throw new Error("Could not fetch Referral Code");
  }

  const { lootbox_referral_codes: userReferralCodeArr } = referralCodeData;

  if (userReferralCodeArr.length) {
    return json({
      numActiveReferrerReferrals,
      numActiveReferreeReferrals,
      numInactiveReferreeReferrals,
      inactiveReferrals,
      referralCode: userReferralCodeArr[0].referral_code,
      loaded: true,
    } satisfies ReferralCountLoaderData);
  }

  // Production website (behind Cloudfront)
  // changes protocol to HTTP
  // Change back to HTTPS
  if (process.env.NODE_ENV === "production") {
    url.protocol = "https:";
  }

  // Create new referral code
  const { success, msg } = await jsonPost<
    AddReferralCodeBody,
    AddReferralCodeData
  >(`${url.origin}/${network}/query/referralCode`, {
    address,
  });

  const newReferralCode = success ? msg.referralCode : "";

  return json({
    numActiveReferrerReferrals,
    numActiveReferreeReferrals,
    numInactiveReferreeReferrals,
    inactiveReferrals,
    referralCode: newReferralCode,
    loaded: true,
  } satisfies ReferralCountLoaderData);
};
