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
  trimAddress,
  trimAddressShort,
  useViewport,
} from "@fluidity-money/surfing";

type IAcceptReferraModal = {
  closeModal: () => void;
  network: string;
  referralCode: string;
  referrer: string;
};

const AcceptReferralModal = ({
  closeModal,
  network,
  referralCode,
  referrer,
}: IAcceptReferraModal) => {
  const { width } = useViewport();

  const isMobile = width <= 500 && width > 0;

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
    <>
      <div className="referrals-content">
        <div className="referrals-header">
          {/* Help Button */}
          <GeneralButton
            type={"secondary"}
            handleClick={() => navigate("./")}
            size={"small"}
            border="box"
          >
            ?
          </GeneralButton>
          <Text bold size="lg">
            ACCEPT REFERRAL
          </Text>
          <GeneralButton
            type={"secondary"}
            handleClick={closeModal}
            size={"small"}
            border="box"
          >
            X
          </GeneralButton>
        </div>

        <Heading as={"h4"} className="referrals-heading">
          {isMobile ? trimAddressShort(referrer) : trimAddress(referrer)} has
          just referred you!
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
            <Text prominent size="lg" className="single-line">
              <ul>You Get</ul> 💸
            </Text>
            <Text prominent size="md">
              <strong>10 Loot Bottles</strong>
              <br />
              on activating their referral
            </Text>
          </div>
          {/* How it works Box Right*/}
          <div>
            <Text prominent size="lg" className="single-line">
              🍾<ul>They Get</ul>
            </Text>
            <Text prominent size="md">
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
        <LinkButton
          size="medium"
          type="internal"
          handleClick={() => navigate(`/${network}/dashboard/airdrop#tutorial`)}
        >
          Learn more
        </LinkButton>
      </div>
    </>
  );
};

export default AcceptReferralModal;
