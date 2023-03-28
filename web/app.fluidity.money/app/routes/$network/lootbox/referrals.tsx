import type { LoaderFunction } from "@remix-run/node";
import type { ReferralCountData } from "../query/referrals";
import { LinksFunction } from "@remix-run/node";

import { json } from "@remix-run/node";
import { useCache } from "~/hooks/useCache";
import { useLoaderData } from "@remix-run/react";
import FluidityFacadeContext from "contexts/FluidityFacade";
import { useContext, useState } from "react";
import { jsonPost } from "~/util";
import { Text, Heading } from "@fluidity-money/surfing";
import { SplitContext } from "contexts/SplitProvider";
import referralModalStyles from "~/components/ReferralModal/referralModal.css";
import ReferralModal from "~/components/ReferralModal";

type LoaderData = {
  network: string;
  referral: string;
  referralMsg: string;
};
export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: referralModalStyles }];
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
    <>
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
                  const signedReferrer = await signBuffer?.("Referrer");
                  setReferralCode(
                    `/${network}/lootbox/referrals?referral=${address}&referralMsg=${signedReferrer}`
                  );
                } catch {
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
                referee_msg: (await signBuffer?.("Referee")) ?? "",
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

      <ReferralModal />
    </>
  );
};

export default Referral;
