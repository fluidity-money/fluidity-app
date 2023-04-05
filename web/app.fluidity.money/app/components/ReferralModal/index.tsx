import { useLoaderData, useNavigate } from "@remix-run/react";
import FluidityFacadeContext from "contexts/FluidityFacade";
import { useContext, useState } from "react";
import {
  Text,
  Heading,
  Display,
  Card,
  GeneralButton,
  LabelledValue,
  Twitter,
  LinkButton,
  ArrowRight,
  LoadingDots,
} from "@fluidity-money/surfing";
import { SplitContext } from "contexts/SplitProvider";

type IReferraModal = {
  claimed: number;
  unclaimed: number;
  progress: number;
  progressReq: number;
  referralCode: string;
  loaded: boolean;
};

const ReferralModal = ({
  claimed,
  unclaimed,
  progress,
  progressReq,
  referralCode,
  loaded,
}: IReferraModal) => {
  const { showExperiment } = useContext(SplitContext);

  const { address, connected, signBuffer } = useContext(FluidityFacadeContext);

  const [linkCopied, setLinkCopied] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

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
            border="box"
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
            border="box"
          >
            X
          </GeneralButton>
        </div>

        <div>
          <Heading as={"h4"} className="referrals-heading">
            YOU HAVE {numActiveReferrals}{" "}
            {/*<HoverButton
              size="large"
              hoverComp={
                <div className="referral-hover-comp">
                  <Text prominent>
                    Active Referrals are Referrals that have earned 10 Lootboxes
                  </Text>
                </div>
              }
            >
              active referrals!
            </HoverButton>{" "}*/}
            {referralsEmoji}
          </Heading>
          <Text size="lg">Send more of your link to earn more rewards!</Text>
        </div>

        {loaded ? (
          <>
            <Card type="box-prominent" disabled={linkCopied} rounded dashed>
              {`https://airdrop.fluidity.money/${referralCode}`}
            </Card>

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
          </>
        ) : (
          <LoadingDots />
        )}

        {/*Share Button*/}
        <div>
          <Text size="lg">
            Share to:{" "}
            <a href="https://twitter.com">
              <Text code prominent>
                <Twitter /> TWITTER
              </Text>
            </a>
          </Text>
        </div>
      </div>

      {/* How It Works Divider / Links*/}
      <Card type="box-prominent" className="referrals-inner-box" rounded>
        <div className="referrals-inner-switcher">
          <GeneralButton
            version={showHowItWorks ? "primary" : "secondary"}
            buttontype={"text"}
            handleClick={() => setShowHowItWorks(true)}
            size={"large"}
          >
            How It Works
          </GeneralButton>
          <GeneralButton
            version={!showHowItWorks ? "primary" : "secondary"}
            buttontype={"text"}
            handleClick={() => setShowHowItWorks(false)}
            size={"large"}
          >
            Links I&apos;ve Clicked
          </GeneralButton>
        </div>
        {/*Contents*/}
        {showHowItWorks ? (
          <HowItWorksContent />
        ) : (
          <LinksClickedContent
            claimed={claimed}
            unclaimed={unclaimed}
            progress={progress}
            progressReq={progressReq}
          />
        )}
      </Card>
    </Card>
  );
};

const HowItWorksContent = () => (
  <div className="referrals-content">
    <div className="spread-center">
      <Text prominent size="lg">
        1. Copy Your Link.
      </Text>
      <Text prominent size="lg">
        2. Share it with your friends.
      </Text>
    </div>
    <Card rounded dashed type="holobox" className="how-it-works-infobox">
      {/* How it works Box Left*/}
      <div>
        <Text prominent size="xl" className="single-line">
          <ul>You Get</ul> 💸
        </Text>
        <Text prominent size="lg">
          <strong>10% of their airdrop</strong>
          <br />
          earnings throughout
          <br />
          the entire Epoch.
        </Text>
      </div>
      {/* How it works Box Right*/}
      <div>
        <Text prominent size="xl" className="single-line">
          🍾<ul>They Get</ul>
        </Text>
        <Text prominent size="lg">
          <strong>10 Loot Bottles,</strong>
          <br />
          not affected by
          <br />
          your 10% reward.
        </Text>
      </div>
    </Card>
    <Text prominent size="md">
      ! They will have to earn 10 Loot Boxes for each referral in order to claim
      their reward and activate yours
    </Text>
  </div>
);

type ILinksClickedContent = {
  claimed: number;
  unclaimed: number;
  progress: number;
  progressReq: number;
};

const LinksClickedContent = ({
  claimed,
  unclaimed,
  progress,
  progressReq,
}: ILinksClickedContent) => (
  <div className="referrals-content">
    <Text size="md" prominent>
      In order to claim your referral rewards, you must earn 10 Loot Bottles for{" "}
      <strong>each</strong> unclaimed referral.
    </Text>
    <GeneralButton
      buttontype={"icon after"}
      size="large"
      version="secondary"
      icon={<ArrowRight />}
    >
      Go to Fluidity Airdrop Page
    </GeneralButton>

    <div className="links-clicked-stats">
      <div className="statistics-set">
        <Text size="lg" className="single-line">
          Claimed
          <div className="dot green" />
        </Text>
        <Display size={"xs"} style={{ margin: 0 }}>
          {claimed}
        </Display>
        <Text size="md" code>
          {claimed * progressReq} BOTTLES
        </Text>
      </div>

      <div className="statistics-set">
        <Text size="lg" className="single-line">
          Unclaimed
          <div className="dot red" />
        </Text>
        <Display size={"xs"} style={{ margin: 0 }}>
          {unclaimed}
        </Display>
        <LinkButton size="small" type="internal">
          Start Claiming
        </LinkButton>
      </div>

      <div className="statistics-set">
        <Text size="lg">Until Next Claim</Text>
        <Display size={"xs"} style={{ margin: 0 }}>
          {progress}/{progressReq}
        </Display>
      </div>
    </div>
  </div>
);

export default ReferralModal;
