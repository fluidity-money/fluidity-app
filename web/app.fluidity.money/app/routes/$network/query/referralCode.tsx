import type { ActionFunction, LoaderFunction } from "@remix-run/node";

import { useSplitExperiment } from "~/util/split";
import { json } from "@remix-run/node";
import { addReferralCode, useReferralCodeByAddress } from "~/queries";
import { validAddress } from "~/util";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const address = url.searchParams.get("address");

  if (!address) throw new Error("Unauthorised");

  const { data: referralCodeData, errors } = await useReferralCodeByAddress(
    address
  );

  if (errors || !referralCodeData) {
    throw new Error("No address found");
  }

  return json(referralCodeData.lootbox_referral_codes);
};

export type AddReferralCodeBody = {
  address: string;
};

type SuccessfulReferralCodeData = {
  success: true;
  msg: {
    address: string;
    referralCode: string;
  };
};

type FailedReferralCodeData = {
  success: false;
  msg: unknown;
};

export type AddReferralCodeData =
  | SuccessfulReferralCodeData
  | FailedReferralCodeData;

export const action: ActionFunction = async ({ request, params }) => {
  const network = params.network ?? "";

  const body = (await request.json()) satisfies AddReferralCodeBody;

  try {
    const address_ = body["address"] ?? "";

    // Normalise addresses
    const address = address_.toLocaleLowerCase();

    // Limit for internal testing
    if (!useSplitExperiment("lootbox-referrals", true, { user: address })) {
      throw new Error("Unauthorised");
    }

    // Check valid addresses
    if (!validAddress(address, network)) {
      throw new Error("Invalid Address");
    }

    // Check address is new
    const {
      data: referralCodeByAddressData,
      errors: referralCodeByAddressErr,
    } = await useReferralCodeByAddress(address);

    if (
      referralCodeByAddressErr ||
      referralCodeByAddressData?.lootbox_referral_codes.referral_code
    ) {
      throw new Error("Invalid Address");
    }

    // Generate unique ID
    const genReferralCode = await (async () => {
      const retries = 5;
      let counter = 0;

      while (counter < retries) {
        const referralCode = randomCode(8);

        const { data: referralCodeByCodeData, errors: referralCodeByCodeErr } =
          await useReferralCodeByAddress(address);

        if (
          referralCodeByCodeErr ||
          referralCodeByCodeData?.lootbox_referral_codes.referral_code
        ) {
          counter += 1;
          continue;
        }

        return referralCode;
      }

      return undefined;
    })();

    if (!genReferralCode) {
      throw new Error("Could not generate unique ID");
    }

    const { data, errors } = await addReferralCode(address, genReferralCode);

    if (errors || !data) {
      throw new Error("Could not insert referral code");
    }

    const { address: newAddress, referral_code: newReferralCode } =
      data.insert_lootbox_referral_codes_one;

    return json({
      success: true,
      msg: {
        address: newAddress,
        referralCode: newReferralCode,
      },
    } satisfies AddReferralCodeData);
  } catch (e) {
    return json({
      success: false,
      msg: e as Error,
    } satisfies AddReferralCodeData);
  }
};

const randomCode = (length: number) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
  const charactersLength = characters.length;

  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};
