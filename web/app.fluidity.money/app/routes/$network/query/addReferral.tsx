import type { ActionFunction } from "@remix-run/node";

import { useSplitExperiment } from "~/util/split";
import { addReferral } from "~/queries/addReferral";
import { json } from "@remix-run/node";
import { isAddress } from "web3-utils";
import { chainType } from "~/util/chainUtils/chains";
import { PublicKey } from "@solana/web3.js";
import { recoverAddress } from "ethers/lib/utils";
import { hashMessage } from "@ethersproject/hash";
import nacl from "tweetnacl";
import { ethers } from "ethers";

export type AddReferralRes = {
  success: boolean;
  msg: unknown;
};

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
    const referrer_ = body["referrer"] ?? "";
    const referee_ = body["referee"] ?? "";
    const referrerMsg = body["referrer_msg"] ?? "";
    const refereeMsg = body["referee_msg"] ?? "";

    // Normalise addresses
    const referrer = referrer_.toLocaleLowerCase(),
      referee = referee_.toLocaleLowerCase();

    // Limit for internal testing
    if (
      !(
        useSplitExperiment("lootbox-referrals", true, { user: referrer }) &&
        useSplitExperiment("lootbox-referrals", true, { user: referee })
      )
    ) {
      throw new Error("Unauthorised");
    }

    // Check valid addresses
    if (
      !(
        referrer != referee &&
        validAddress(referrer, network) &&
        validAddress(referee, network)
      )
    ) {
      throw new Error("Invalid Addresses");
    }

    // Check signatures
    const signaturesVerified = (() => {
      switch (chainType(network)) {
        case "evm": {
          const referrerVerified =
            ethers.utils
              .recoverAddress(hashMessage("Referrer"), referrerMsg)
              .toLocaleLowerCase() === referrer;

          const refereeVerified =
            recoverAddress(
              hashMessage("Referee"),
              refereeMsg
            ).toLocaleLowerCase() === referee;

          return referrerVerified && refereeVerified;
        }
        case "solana": {
          const enc = new TextEncoder();

          const referrerPubkey = new PublicKey(referrer),
            refereePubkey = new PublicKey(referee);

          const referrerVerified = nacl.sign.detached.verify(
            enc.encode("Referrer"),
            enc.encode(referrerMsg),
            referrerPubkey.toBytes()
          );

          const refereeVerified = nacl.sign.detached.verify(
            enc.encode("Referee"),
            enc.encode(refereeMsg),
            refereePubkey.toBytes()
          );

          return referrerVerified && refereeVerified;
        }
        default:
          throw new Error("Could not parse network");
      }
    })();

    if (!signaturesVerified) {
      throw new Error("Could not verify signatures");
    }

    const res = await addReferral(referrer, referee);

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
