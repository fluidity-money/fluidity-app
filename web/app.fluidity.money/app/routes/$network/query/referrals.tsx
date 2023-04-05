import type { LoaderFunction } from "@remix-run/node";

import { json } from "@remix-run/node";
import { useReferralCodeByAddress, useReferralCountByAddress } from "~/queries";
import { jsonPost } from "~/util";
import { AddReferralCodeBody, AddReferralCodeData } from "./referralCode";

export type ReferralCountData = {
  numReferrals: number;
  referralCode: string;
  loaded: boolean;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const network = params.network ?? "";

  const url = new URL(request.url);

  const address = url.searchParams.get("address");

  if (!address) {
    throw new Error("Invalid Request");
  }

  const [
    { data: referralData, errors: referralErr },
    { data: referralCodeData, errors: referralCodeErr },
  ] = await Promise.all([
    useReferralCountByAddress(address),
    useReferralCodeByAddress(address),
  ]);

  if (referralErr || !referralData) {
    throw new Error("Could not fetch Referrals");
  }

  const {
    lootbox_referrals_aggregate: {
      aggregate: { count: numReferrals },
    },
  } = referralData;

  if (referralCodeErr || !referralCodeData) {
    throw new Error("Could not fetch Referral Code");
  }

  const { lootbox_referral_codes: userReferralCodeArr } = referralCodeData;

  if (userReferralCodeArr.length) {
    return json({
      numReferrals,
      referralCode: userReferralCodeArr[0].referral_code,
      loaded: true,
    } satisfies ReferralCountData);
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
    numReferrals,
    referralCode: newReferralCode,
    loaded: true,
  } satisfies ReferralCountData);
};
