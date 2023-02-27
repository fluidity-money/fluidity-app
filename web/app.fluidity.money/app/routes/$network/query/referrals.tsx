import type { LoaderFunction } from "@remix-run/node";

import { json } from "@remix-run/node";
import { useReferralCountByAddress } from "~/queries";

export type ReferralCountData = {
  numReferrals: number;
  loaded: boolean;
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);

  const address = url.searchParams.get("address");

  if (!address) {
    throw new Error("Invalid Request");
  }

  const { data: referralData, errors } = await useReferralCountByAddress(
    address
  );

  if (errors || !referralData) {
    throw new Error("Could not fetch Referrals");
  }

  const {
    lootbox_referrals_aggregate: {
      aggregate: { count: numReferrals },
    },
  } = referralData;

  return json({
    numReferrals,
    loaded: true,
  } as ReferralCountData);
};
