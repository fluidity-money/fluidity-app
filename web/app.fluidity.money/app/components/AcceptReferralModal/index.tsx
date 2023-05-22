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
  network: string;
  referralCode: string;
  referrer: string;
};

const AcceptReferralModal = ({
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
      <div className="referrals-content" style={{ padding: 0 }}>
        <div className="referrals-header">
          <Text size="sm">ACCEPT REFERRAL</Text>
        </div>

        <Heading as={"h4"} className="referrals-heading">
          {isMobile ? trimAddressShort(referrer) : trimAddress(referrer)} has
          just referred you!
        </Heading>
        <Card
          rounded
          type="transparent"
          color="gray"
          border="dashed"
          className="how-it-works-infobox"
        >
          {/* How it works Box Left*/}
          <div className="how-it-works-half">
            <div className="how-it-works-title">
              <Text
                code
                size="md"
                className="single-line"
                style={{ textDecoration: "underline" }}
              >
                YOU GET
              </Text>
              &nbsp;💸
            </div>
            <Text prominent size="sm">
              <strong>10% of their airdrop</strong>
              <br />
              earnings throughout the entire Epoch.
            </Text>
          </div>
          {/* How it works Box Right*/}
          <div className="how-it-works-half">
            <div className="how-it-works-title">
              🍾&nbsp;
              <Text
                code
                size="md"
                className="single-line"
                style={{ textDecoration: "underline" }}
              >
                THEY GET
              </Text>
            </div>
            <Text prominent size="sm">
              <strong>10 Loot Bottles,</strong>
              <br />
              not affected by your 10% reward.
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
