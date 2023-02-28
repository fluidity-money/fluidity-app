import type { LoaderFunction } from "@remix-run/node";
import type { ReferralCountData } from "../query/referrals";

import { json } from "@remix-run/node";
import { useCache } from "~/hooks/useCache";
import { useLoaderData } from "@remix-run/react";
import FluidityFacadeContext from "contexts/FluidityFacade";
import { useContext, useState } from "react";
import { Text, Heading } from "@fluidity-money/surfing";
import { SplitContext } from "contexts/SplitProvider";
import { Buffer } from "buffer";

import { jsonPost } from "~/util";

type LoaderData = {
  network: string;
  referral: string;
  referralMsg: string;
};

export const loader: LoaderFunction = ({ request, params }) => {
  const { network } = params;

  const url = new URL(request.url);
  const referral = url.searchParams.get("referral") ?? "";
  const referralMsg = url.searchParams.get("referralMsg") ?? "";

  return json({
    network,
    referral,
    referralMsg,
  } as LoaderData);
};

const SAFE_DEFAULT: ReferralCountData = {
  numReferrals: 0,
  loaded: false,
};

const Referral = () => {
  const { showExperiment } = useContext(SplitContext);

  const { network, referral, referralMsg } = useLoaderData<LoaderData>();

  const { address, connected, signBuffer } = useContext(FluidityFacadeContext);

  const [referralCode, setReferralCode] = useState("");

  const referralData = useCache(
    `/${network}/query/referrals?address=${address}`
  ).data;

  const referralsData_ = connected ? referralData : SAFE_DEFAULT;

  const referralsData = {
    ...SAFE_DEFAULT,
    ...referralsData_,
  };

  const { numReferrals } = referralsData;

  if (!showExperiment("lootbox-referrals")) {
    return <></>;
  }

  return (
    <div>
      {/* Num Referrals */}
      <div>
        <Text>Referrals</Text>
        <Heading>{numReferrals}</Heading>
      </div>

      {/* Referral Section */}
      <form>
        <input readOnly value={referralCode} />

        <button
          onClick={(e) => {
            e.preventDefault();
            (async () => {
              try {
                const signedReferrer = await signBuffer?.(
                  `Hi! From ${address} with ❤️`
                );

                if (!signedReferrer) return;

                const urlSafeB64 = Buffer.from(
                  signedReferrer.slice(2),
                  "hex"
                ).toString("base64url");

                setReferralCode(
                  `/${network}/lootbox/referrals?referral=${address}&referralMsg=${urlSafeB64}`
                );
              } catch (e) {
                console.log(e);
                return;
              }
            })();
          }}
        >
          Reveal Referral Link
        </button>
      </form>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          (async () => {
            await jsonPost(`/${network}/query/addReferral`, {
              referrer: referral,
              referee: address,
              referrer_msg: referralMsg,
              referee_msg: (await signBuffer?.(`🌊 - ${address}`)) ?? "",
            });
          })();
        }}
      >
        <label htmlFor="referrer" />
        <input readOnly name="referrer" value={referral} />
        <label htmlFor="address" />
        <input readOnly name="referee" value={address} />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Referral;
