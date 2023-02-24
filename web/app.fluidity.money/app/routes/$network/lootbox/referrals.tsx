import type { LoaderFunction } from "@remix-run/node";
import type { ReferralCountData } from "../query/referrals";

import { json } from "@remix-run/node";
import { useCache } from "~/hooks/useCache";
import { useLoaderData } from "@remix-run/react";
import FluidityFacadeContext from "contexts/FluidityFacade";
import { useContext } from "react";
import { Text, Heading } from "@fluidity-money/surfing";
import { SplitContext } from "contexts/SplitProvider";
import { jsonPost } from "~/util";

type LoaderData = {
  network: string;
  referral: string;
};

export const loader: LoaderFunction = ({ request, params }) => {
  const { network } = params;

  const url = new URL(request.url);
  const referral = url.searchParams.get("referral") ?? "";

  return json({
    network,
    referral,
  } as LoaderData);
};

const SAFE_DEFAULT: ReferralCountData = {
  numReferrals: 0,
  loaded: false,
};

const Referral = () => {
  const { showExperiment } = useContext(SplitContext);

  const { network, referral } = useLoaderData<LoaderData>();

  const { address, connected } = useContext(FluidityFacadeContext);

  const referralsData_ = connected
    ? useCache(`/${network}/query/referrals?address=${address}`).data
    : SAFE_DEFAULT;

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
        <input
          readOnly
          value={`/${network}/dashboard/home?referral=${address}`}
        />
      </form>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          jsonPost(`/${network}/query/addReferral`, {
            referrer: referral,
            referee: address,
          });
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
