import type {
  AddReferralBody,
  AddReferralRes,
} from "~/routes/$network/query/addReferral";

import { useNavigate } from "@remix-run/react";
import FluidityFacadeContext from "contexts/FluidityFacade";
import { useContext, useState } from "react";
import { jsonPost } from "~/util";
import {
  Text,
  Heading,
  Card,
  GeneralButton,
  LinkButton,
} from "@fluidity-money/surfing";

type IAcceptReferraModal = {
  network: string;
  referralCode: string;
  referrer: string;
};

const AcceptReferralModal = ({
  network,
  referralCode,
  referrer,
}: IAcceptReferraModal) => {
  const { address, connected, signBuffer } = useContext(FluidityFacadeContext);

  const navigate = useNavigate();

  const [acceptedReferral, setAcceptedReferral] = useState(false);

  const handleAcceptReferral = async () => {
    if (acceptedReferral) return;
    if (!address) return;

    const res = await jsonPost<AddReferralBody, AddReferralRes>(
      `/${network}/query/addReferral`,
      {
        address: address,
        referrer_code: referralCode,
        referee_msg:
          (await signBuffer?.(`${referralCode} 🌊 ${address}`)) ?? "",
      }
    );

    if (res.success) {
      setAcceptedReferral(true);
    }
  };

  return (
    <Card
      className="referrals-container"
      type="frosted"
      color="holo"
      border="solid"
      rounded
    >
      <div className="referrals-content">
        <div className="referrals-header">
          {/* Help Button */}
          <GeneralButton
            type={"secondary"}
            handleClick={() => navigate("./")}
            size={"medium"}
            border="box"
          >
            ?
          </GeneralButton>
          <Text bold size="lg">
            ACCEPT REFERRAL
          </Text>
          <GeneralButton
            type={"secondary"}
            handleClick={() => navigate("./")}
            size={"medium"}
            border="box"
          >
            X
          </GeneralButton>
        </div>

        <Heading as={"h4"} className="referrals-heading">
          {referrer} has just referred you!
        </Heading>
        <Card
          rounded
          type="transparent"
          color="holo"
          border="dashed"
          className="how-it-works-infobox"
        >
          {/* How it works Box Left*/}
          <div>
            <Text prominent size="xl" className="single-line">
              <ul>You Get</ul> 💸
            </Text>
            <Text prominent size="lg">
              <strong>10 Loot Bottles</strong>
            </Text>
          </div>
          {/* How it works Box Right*/}
          <div>
            <Text prominent size="xl" className="single-line">
              🍾<ul>They Get</ul>
            </Text>
            <Text prominent size="lg">
              <strong>10% of your airdrop</strong>
              <br />
              earnings throughout
              <br />
              the entire Epoch.
            </Text>
          </div>
        </Card>
        <GeneralButton
          version="primary"
          size="large"
          handleClick={handleAcceptReferral}
          disabled={!connected}
        >
          {!acceptedReferral ? "ACCEPT REFERRAL" : "ACCEPTED!"}
        </GeneralButton>
        <LinkButton size="large" type="internal" handleClick={() => 1}>
          Learn more
        </LinkButton>
      </div>
    </Card>
  );
};

export default AcceptReferralModal;
