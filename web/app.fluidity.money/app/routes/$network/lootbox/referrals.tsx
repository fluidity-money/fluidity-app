import type { LoaderFunction } from "@remix-run/node";
import type { ReferralCountData } from "../query/referrals";

import { json } from "@remix-run/node";
import { useCache } from "~/hooks/useCache";
import { useLoaderData } from "@remix-run/react";
import FluidityFacadeContext from "contexts/FluidityFacade";
import { useContext, useState } from "react";
import { Text, Heading, Card, GeneralButton, LabelledValue } from "@fluidity-money/surfing";
import { SplitContext } from "contexts/SplitProvider";

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

  const numActiveReferrals = 0;
  const referralsEmoji = numActiveReferrals ? "🎉" : "😔";

  const [linkCopied, setLinkCopied] = useState(false);

  const HowItWorksContent = () => (
    <div className="referrals-content">
      <div>
        <Text prominent>
          1. Copy Your Link
        </Text>
        <Text prominent>
          2. Share it with your friends.
        </Text>
      </div>
      <Card>
        {/* How it works Box Left*/}
        <div>
          <Text><ul>You Get</ul> 💸</Text>
          <Text><strong>10% of their airdrop</strong></Text>
          <Text>earnings throughout</Text>
          <Text>the entire Epoch.</Text>
        </div>
        {/* How it works Box Right*/}
        <div>
          <Text>🍾 <ul>They Get</ul></Text>
          <Text><strong>10 Loot Bottles,</strong></Text>
          <Text>not affected by</Text>
          <Text>your 10% reward.</Text>
        </div>
        <Text>!. They will have to earn 10 Loot Boxes for each referral in order to clain their reward and activate yours</Text>
      </Card>
    </div>
  );

  const LinksClickedContent = () => (
    <div>
      <Text>In order to claim your referral rewards, you must earn 10 Loot Bottles for <strong>each</strong> unclaimed referral.</Text>
      <GeneralButton buttontype={"text"} size="medium" version="secondary">Go to Fluidity Airdrop Page</GeneralButton>

      <div>
        <LabelledValue label={"Claimed"}>
        </LabelledValue>

        <LabelledValue label="Unclaimed">
        </LabelledValue>

        <LabelledValue label="Until Next Claim">
        </LabelledValue>
      </div>
    </div>
  );

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

    <Card className="referrals-container">
      <div>
        {/* Help Button */}
        <GeneralButton>?</GeneralButton>
          <Text>Referral System</Text>
        <GeneralButton>X</GeneralButton>
      </div>

      <Heading as={"h4"}>You have {numActiveReferrals} <HoverButton>active referrals!</HoverButton> {referralsEmoji}</Heading>
      <Text>Send more of your link to earn more rewards!</Text>

      <textarea readOnly>
        {referralCode ?? ""}
      </textarea>
      {/* Copy Button */}
      <GeneralButton>{copyButtonText}</GeneralButton>

      {/*Share Button*/}
      <div>
      <Text>Share to <Text code>Twitter</Text></Text>
      </div>

      {/* How It Works Divider / Links*/}
      <Card>
        <div>
          <GeneralButton>How It Works</GeneralButton>
          <GeneralButton>Links I've Clicked</GeneralButton>
        </div>
        {/*Contents*/}
      </Card>
    </Card>
  </>
  );
};

export default Referral;
