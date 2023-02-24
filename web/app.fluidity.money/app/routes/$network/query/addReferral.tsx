import type { ActionFunction } from "@remix-run/node";

import { useSplitExperiment } from "~/util/split";
import { addReferral } from "~/queries/addReferral";
import { json } from "@remix-run/node";
import { isAddress } from "web3-utils";
import { chainType } from "~/util/chainUtils/chains";
import { PublicKey } from "@solana/web3.js";

const validAddress = (input: string, network: string): boolean => {
  try {
    return chainType(network) === "evm"
      ? isAddress(input)
      : PublicKey.isOnCurve(new PublicKey(input));
  } catch {
    return false;
  }
};

export const action: ActionFunction = async ({ request, params }) => {
  const body = await request.json();
  const network = params.network ?? "";

  try {
    // Update DB with secret to write
    const referrer = body.get("referrer") ?? "";
    const referee = body.get("referee") ?? "";

    // Limit for internal testing
    if (
      !(
        useSplitExperiment("lootbox-referrals", true, { user: referrer }) &&
        useSplitExperiment("lootbox-referrals", true, { user: referee })
      )
    ) {
      throw "Unauthorised";
    }

    if (!(validAddress(referrer, network) && validAddress(referee, network))) {
      throw new Error("Invalid Addresses");
    }

    const res = await addReferral(referrer, referee);

    if (res.errors || !res.data) {
      throw new Error("Could not insert referral");
    }

    return json({
      success: true,
      msg: res.data,
    });
  } catch (e) {
    return json({
      success: false,
      msg: e,
    });
  }
};
