import { useNavigate } from "@remix-run/react";
import { useState } from "react";
import {
  Text,
  Heading,
  Display,
  Card,
  GeneralButton,
  Twitter,
  LinkButton,
  ArrowRight,
  LoadingDots,
  Hoverable,
  ProgressBar,
} from "@fluidity-money/surfing";

type IReferraModal = {
  connected: boolean;
  connectWallet: () => void;
  closeModal: () => void;
  referrerClaimed: number;
  refereeClaimed: number;
  refereeUnclaimed: number;
  progress: number;
  progressReq: number;
  referralCode: string;
  loaded: boolean;
};

const ReferralModal = ({
  connected,
  connectWallet,
  closeModal,
  referrerClaimed,
  refereeClaimed,
  refereeUnclaimed,
  progress,
  progressReq,
  referralCode,
  loaded,
}: IReferraModal) => {
  const [linkCopied, setLinkCopied] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(true);

  const navigate = useNavigate();

  const referralsEmoji = referrerClaimed ? "🎉" : "😔";

  return (
    <Card
      onClick={(e: MouseEvent) => {
        e.stopPropagation();
      }}
      className="referrals-container"
      type="frosted"
      border="solid"
      color="holo"
      rounded
    >
      <div className="referrals-content">
        <div className="referrals-header">
          {/* Help Button */}
          <GeneralButton
            type={"secondary"}
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
            type={"secondary"}
            buttontype={"text"}
            handleClick={closeModal}
            size={"medium"}
            border="box"
          >
            X
          </GeneralButton>
        </div>

        <div>
          <Heading as={"h4"} className="referrals-heading">
            YOU HAVE {referrerClaimed}
            <Hoverable
              tooltipContent={
                <div className="referral-hover-comp">
                  <Text prominent>
                    Active Referrals are Referrals that have earned 10 Lootboxes
                  </Text>
                </div>
              }
            >
              <ul style={{ paddingLeft: "0.5em", paddingRight: "0.5em" }}>
                ACTIVE REFERRALS
              </ul>
            </Hoverable>{" "}
            {referralsEmoji}
          </Heading>
          <Text size="lg">Send more of your link to earn more rewards!</Text>
        </div>

        {!connected ? (
          <GeneralButton
            type={"primary"}
            size={"medium"}
            handleClick={connectWallet}
          >
            Connect Wallet
          </GeneralButton>
        ) : loaded ? (
          <>
            <Card
              component="button"
              type="transparent"
              disabled={linkCopied}
              border="dashed"
              color="white"
              rounded
            >
              {`https://airdrop.fluidity.money/${referralCode}`}
            </Card>

            {/* Copy Button */}
            <GeneralButton
              className={"spread"}
              type={"secondary"}
              buttontype={"icon before"}
              handleClick={() => {
                setLinkCopied(true);
              }}
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
        <Text size="lg">
          Share to: &nbsp;
          <a href="https://twitter.com">
            <Text code prominent>
              <Twitter /> TWITTER
            </Text>
          </a>
        </Text>
      </div>

      {/* How It Works Divider / Links*/}
      <Card
        type="transparent"
        className="referrals-inner-box"
        border="solid"
        color="white"
        rounded
      >
        <div className="referrals-inner-switcher">
          <GeneralButton
            type={showHowItWorks ? "primary" : "secondary"}
            buttontype={"text"}
            handleClick={() => setShowHowItWorks(true)}
            size={"large"}
          >
            How It Works
          </GeneralButton>
          <GeneralButton
            type={!showHowItWorks ? "primary" : "secondary"}
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
            claimed={refereeClaimed}
            unclaimed={refereeUnclaimed}
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
      <Circle1 />
      <Text prominent size="lg">
        Copy Your Link.
      </Text>
      <Circle2 />
      <Text prominent size="lg">
        2. Share it with your friends.
      </Text>
    </div>
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
    <div className="how-it-works-warning-container">
      <CircleInfo />
      <Text prominent size="md" className="how-it-works-warning-text">
        They will have to earn 10 Loot Boxes for each referral in order to claim
        their reward and activate yours
      </Text>
    </div>
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
      <strong style={{ color: "yellow" }}>each</strong> unclaimed referral.
    </Text>
    <GeneralButton
      layout="after"
      size="large"
      type="secondary"
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
        <LinkButton size="small" type="internal" handleClick={() => 1}>
          Start Claiming
        </LinkButton>
      </div>

      <div className="statistics-set">
        <Text size="lg">Until Next Claim</Text>
        <Display size={"xs"} style={{ margin: 0 }}>
          {progress}/{progressReq}
        </Display>
        <ProgressBar value={progress} max={progressReq} />
      </div>
    </div>
  </div>
);

const Circle1 = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.07038 4.384C7.07038 4.699 6.92638 4.924 6.62938 4.924H5.60338V5.599H6.62038C6.81838 5.599 6.96238 5.563 7.05238 5.482V10H7.80838V3.7H7.07038V4.384Z"
      fill="white"
    />
    <circle cx="7" cy="7" r="6.5" stroke="#D9D9D9" />
  </svg>
);

const Circle2 = () => (
  <svg
    width="14"
    height="19"
    viewBox="0 0 14 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.7898 13H9.1278V12.307H5.8338L7.7238 10.705C8.4708 10.066 9.0828 9.472 9.0828 8.527C9.0828 7.393 8.2908 6.646 6.9318 6.646C5.6628 6.646 4.8258 7.492 4.8258 8.68V8.842H5.5818V8.725C5.5818 7.861 6.1218 7.321 6.9318 7.321C7.7688 7.321 8.3088 7.771 8.3088 8.563C8.3088 9.247 7.8228 9.733 7.2378 10.237L4.7898 12.361V13Z"
      fill="white"
    />
    <circle cx="7" cy="10" r="6.5" stroke="#D9D9D9" />
  </svg>
);

const CircleInfo = () => (
  <svg
    width="27"
    height="27"
    viewBox="0 0 27 27"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.42526 14.91L8.54526 10H7.66526L7.79526 14.91H8.42526ZM7.53526 16.5C7.53526 16.84 7.77526 17.06 8.10526 17.06C8.43526 17.06 8.67526 16.84 8.67526 16.5C8.67526 16.16 8.43526 15.94 8.10526 15.94C7.77526 15.94 7.53526 16.16 7.53526 16.5Z"
      fill="#FDF76B"
    />
    <circle cx="8" cy="14" r="7.5" stroke="#FDF76B" />
  </svg>
);

export default ReferralModal;
