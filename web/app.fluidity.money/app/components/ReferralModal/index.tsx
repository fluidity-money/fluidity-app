import { useLoaderData, useNavigate } from "@remix-run/react";
import FluidityFacadeContext from "contexts/FluidityFacade";
import { useContext, useState } from "react";
import {
  Text,
  Heading,
  Card,
  GeneralButton,
  LabelledValue,
  HoverButton,
  Twitter,
} from "@fluidity-money/surfing";
import { SplitContext } from "contexts/SplitProvider";

const ReferralModal = () => {
  const { showExperiment } = useContext(SplitContext);

  const { address, connected, signBuffer } = useContext(FluidityFacadeContext);

  const [referralCode, setReferralCode] = useState("");

  const [linkCopied, setLinkCopied] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(true);

  const navigate = useNavigate();

  const numActiveReferrals = 0;
  const referralsEmoji = numActiveReferrals ? "🎉" : "😔";

  return (
    <Card className="referrals-container" type="holobox" rounded>
      <div className="referrals-content">
        <div className="referrals-header">
          {/* Help Button */}
          <GeneralButton
            version={"secondary"}
            buttontype={"text"}
            handleClick={() => navigate("./")}
            size={"medium"}
          >
            ?
          </GeneralButton>
          <Text bold size="lg">
            REFERRAL SYSTEM
          </Text>
          <GeneralButton
            version={"secondary"}
            buttontype={"text"}
            handleClick={() => navigate("./")}
            size={"medium"}
          >
            X
          </GeneralButton>
        </div>

        <Heading as={"h4"} className="referrals-heading">
          YOU HAVE {numActiveReferrals}{" "}
          <HoverButton
            size="xlarge"
            hoverComp={
              <>Active Referrals are Referrals that have earned 10 Lootboxes</>
            }
          >
            active referrals!
          </HoverButton>{" "}
          {referralsEmoji}
        </Heading>
        <Text size="l">Send more of your link to earn more rewards!</Text>
        <br />
        <br />

        <Card>{referralCode ?? ""}</Card>
        {/* Copy Button */}
        <GeneralButton
          className={"spread"}
          version={"secondary"}
          buttontype={"icon before"}
          handleClick={() => navigate("./")}
          size={"large"}
          icon={<img src="/images/icons/copy.svg" />}
        >
          {!linkCopied ? "Copy Link" : "Link Copied!"}
        </GeneralButton>

        {/*Share Button*/}
        <div>
          <Text>
            Share to{"   "}
            <a href="https://twitter.com">
              <Text code prominent>
                <Twitter /> Twitter
              </Text>
            </a>
          </Text>
        </div>
      </div>

      {/* How It Works Divider / Links*/}
      <Card type="box-prominent" className="referrals-inner-box">
        <div className="referrals-inner-switcher">
          <GeneralButton
            version={showHowItWorks ? "primary" : "secondary"}
            buttontype={"text"}
            handleClick={() => setShowHowItWorks(true)}
            size={"small"}
          >
            How It Works
          </GeneralButton>
          <GeneralButton
            version={!showHowItWorks ? "primary" : "secondary"}
            buttontype={"text"}
            handleClick={() => setShowHowItWorks(false)}
            size={"small"}
          >
            Links I&apos;ve Clicked
          </GeneralButton>
        </div>
        {/*Contents*/}
        {showHowItWorks ? <HowItWorksContent /> : <LinksClickedContent />}
      </Card>
    </Card>
  );
};

const HowItWorksContent = () => (
  <div className="referrals-content">
    <div>
      <Text prominent>1. Copy Your Link</Text>
      <Text prominent>2. Share it with your friends.</Text>
    </div>
    <Card>
      {/* How it works Box Left*/}
      <div>
        <Text>
          <ul>You Get</ul> 💸
        </Text>
        <Text>
          <strong>10% of their airdrop</strong>
        </Text>
        <Text>earnings throughout</Text>
        <Text>the entire Epoch.</Text>
      </div>
      {/* How it works Box Right*/}
      <div>
        <Text>
          🍾 <ul>They Get</ul>
        </Text>
        <Text>
          <strong>10 Loot Bottles,</strong>
        </Text>
        <Text>not affected by</Text>
        <Text>your 10% reward.</Text>
      </div>
      <Text>
        !. They will have to earn 10 Loot Boxes for each referral in order to
        clain their reward and activate yours
      </Text>
    </Card>
  </div>
);

const LinksClickedContent = () => (
  <div>
    <Text>
      In order to claim your referral rewards, you must earn 10 Loot Bottles for{" "}
      <strong>each</strong> unclaimed referral.
    </Text>
    <GeneralButton buttontype={"text"} size="medium" version="secondary">
      Go to Fluidity Airdrop Page
    </GeneralButton>

    <div>
      <LabelledValue label={"Claimed"}></LabelledValue>

      <LabelledValue label="Unclaimed"></LabelledValue>

      <LabelledValue label="Until Next Claim"></LabelledValue>
    </div>
  </div>
);

export default ReferralModal;
