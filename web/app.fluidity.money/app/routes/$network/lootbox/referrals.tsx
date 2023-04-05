import type { LoaderFunction } from "@remix-run/node";
import type { ReferralCountData } from "../query/referrals";
import { LinksFunction } from "@remix-run/node";

import { json } from "@remix-run/node";
import { useCache } from "~/hooks/useCache";
import { useLoaderData } from "@remix-run/react";
import FluidityFacadeContext from "contexts/FluidityFacade";
import { useContext, useState } from "react";
import { jsonPost } from "~/util";
import { Text, Heading, GeneralButton } from "@fluidity-money/surfing";
import { SplitContext } from "contexts/SplitProvider";
import referralModalStyles from "~/components/ReferralModal/referralModal.css";
import ReferralModal from "~/components/ReferralModal";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: referralModalStyles }];
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

const SAFE_DEFAULT: ReferralCountData = {
  numReferrals: 0,
  referralCode: "",
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

  const data = {
    ...SAFE_DEFAULT,
    ...referralsData,
  };

  const { numReferrals, referralCode, loaded } = data;

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
        claimed={0}
        unclaimed={0}
        progress={0}
        progressReq={10}
        referralCode={referralCode}
        loaded={loaded}
      />
    </>
  );
};

export default Referral;
