import type { LoaderFunction } from "@remix-run/node";
import type { ReferralCountData } from "../query/referrals";
import { ReferralCodeData } from "../query/referralCode";
import { LinksFunction } from "@remix-run/node";

import { json } from "@remix-run/node";
import { useCache } from "~/hooks/useCache";
import { useLoaderData } from "@remix-run/react";
import FluidityFacadeContext from "contexts/FluidityFacade";
import { useContext, useState } from "react";
import { jsonPost } from "~/util";
import { Text, Heading, GeneralButton } from "@fluidity-money/surfing";
import { SplitContext } from "contexts/SplitProvider";
import ReferralModal from "~/components/ReferralModal";
import AcceptReferralModal from "~/components/AcceptReferralModal";
import referralModalStyles from "~/components/ReferralModal/referralModal.css";
import acceptReferralModalStyles from "~/components/AcceptReferralModal/referralModal.css";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: referralModalStyles },
    { rel: "stylesheet", href: acceptReferralModalStyles },
  ];
};

type LoaderData = {
  network: string;
  referralCode: string;
};

export const loader: LoaderFunction = ({ request, params }) => {
  const network = params.network ?? "";

  const url = new URL(request.url);
  const referralCode = url.searchParams.get("referral_code") ?? "";

  return json({
    network,
    referralCode,
  } satisfies LoaderData);
};

const SAFE_DEFAULT: ReferralCountData & ReferralCodeData = {
  numActiveReferrerReferrals: 0,
  numActiveReferreeReferrals: 0,
  numInactiveReferreeReferrals: 0,
  inactiveReferrals: [],
  referralCode: "",
  referralAddress: "",
  loaded: false,
};

const Referral = () => {
  const { showExperiment } = useContext(SplitContext);

  const { network, referralCode: clickedReferralCode } =
    useLoaderData<LoaderData>();

  const { address, connected, signBuffer } = useContext(FluidityFacadeContext);

  const { data: referralsData } = useCache<ReferralCountData>(
    address ? `/${network}/query/referrals?address=${address}` : ""
  );

  const { data: referralCodeData } = useCache<ReferralCountData>(
    clickedReferralCode && address
      ? `/${network}/query/referralCode?code=${clickedReferralCode}&address=${address}`
      : ""
  );

  const data = {
    ...SAFE_DEFAULT,
    ...referralsData,
    ...referralCodeData,
  };

  const {
    numActiveReferrerReferrals,
    numActiveReferreeReferrals,
    numInactiveReferreeReferrals,
    inactiveReferrals,
    referralCode,
    referralAddress,
    loaded,
  } = data;

  if (!showExperiment("lootbox-referrals")) {
    return <></>;
  }

  return (
    <>
      <div>
        {/* Num Referrals */}
        <div>
          <Text>Referrals</Text>
          <Heading>{numActiveReferrerReferrals}</Heading>
        </div>

        {/* Referral Section */}
        <form>
          <input readOnly value={referralCode} />

          <button>Reveal Referral Link</button>
        </form>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            (async () => {
              await jsonPost(`/${network}/query/addReferral`, {
                referee: address,
                referrer_code: referralCode,
                referee_msg:
                  (await signBuffer?.(`${referralCode} 🌊 ${address}`)) ?? "",
              });
            })();
          }}
        >
          <label htmlFor="referrer" />
          <input readOnly name="referrer" value={referralCode} />
          <label htmlFor="address" />
          <input readOnly name="referee" value={address} />
          <GeneralButton buttonType="submit">submit</GeneralButton>
        </form>
      </div>

      <ReferralModal
        referrerClaimed={numActiveReferrerReferrals}
        refereeClaimed={numActiveReferreeReferrals}
        refereeUnclaimed={numInactiveReferreeReferrals}
        progress={inactiveReferrals[0]?.progress || 0}
        progressReq={10}
        referralCode={referralCode}
        loaded={loaded}
      />

      <AcceptReferralModal
        network={network}
        referralCode={clickedReferralCode}
        referrer={referralAddress}
      />
    </>
  );
};

export default Referral;
