import type { ActionFunction } from "@remix-run/node";

import { addReferral } from "~/queries/addReferral";
import { json } from "@remix-run/node";
import { chainType } from "~/util/chainUtils/chains";
import { PublicKey } from "@solana/web3.js";
import { recoverAddress } from "ethers/lib/utils";
import { hashMessage } from "@ethersproject/hash";
import nacl from "tweetnacl";
import { validAddress } from "~/util";
import { useReferralCodeByCode } from "~/queries";
import { EPOCH_CURRENT_IDENTIFIER } from "../dashboard/airdrop";

export type AddReferralBody = {
  address: string;
  referrer_code: string;
  referee_msg: string;
};

export type AddReferralRes = {
  success: boolean;
  msg: unknown;
};

export const action: ActionFunction = async ({ request, params }) => {
  const body = await request.json();
  const network = params.network ?? "";

  try {
    // Update DB with secret to write
    const referee_ = body["address"] ?? "";
    const referrerCode = body["referrer_code"] ?? "";
    const refereeMsg = body["referee_msg"] ?? "";

    // Normalise addresses
    const referee = referee_.toLocaleLowerCase();

    // Check valid addresses
    if (!validAddress(referee, network)) {
      throw new Error("Invalid Addresses");
    }

    // Check signatures
    const signaturesVerified = (() => {
      switch (chainType(network)) {
        case "evm": {
          return (
            recoverAddress(
              hashMessage(`${referrerCode} 🌊 ${referee}`),
              refereeMsg
            ).toLocaleLowerCase() === referee
          );
        }
        case "solana": {
          const enc = new TextEncoder();

          const refereePubkey = new PublicKey(referee);

          return nacl.sign.detached.verify(
            enc.encode("Referee"),
            enc.encode(refereeMsg),
            refereePubkey.toBytes()
          );
        }
        default:
          throw new Error("Could not parse network");
      }
    })();

    if (!signaturesVerified) {
      throw new Error("Could not verify signatures");
    }

    // Check ReferralCode exists
    const { data: referralCodeByCodeData, errors } =
      await useReferralCodeByCode(referrerCode, EPOCH_CURRENT_IDENTIFIER);

    const matchingReferralCode =
      referralCodeByCodeData?.lootbox_referral_codes[0];

    if (errors || !matchingReferralCode) {
      throw new Error("Code does not exist");
    }

    // Check referral originator is not referee
    const referrer = matchingReferralCode.address;

    if (referrer === referee) {
      throw new Error("Invalid Address");
    }

    const res = await addReferral(referrer, referee, EPOCH_CURRENT_IDENTIFIER);

    if (res.errors || !res.data) {
      throw new Error("Could not insert referral");
    }

    return json({
      success: true,
      msg: res.data,
    } satisfies AddReferralRes);
  } catch (e) {
    return json({
      success: false,
      msg: e,
    } satisfies AddReferralRes);
  }
};
