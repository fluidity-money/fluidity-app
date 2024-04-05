import type { NavigateFunction } from "@remix-run/react";

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
  CopyIcon,
  TextButton,
  useViewport,
} from "@fluidity-money/surfing";
import { highlightText } from "~/util";
import { generateReferralTweet } from "~/util/tweeter";

type IReferraModal = {
  connected: boolean;
  network: string;
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

const CopyGroup = ({ referralCode }: { referralCode: string }) => {
  const [linkCopied, setLinkCopied] = useState(false);
  return (
    <div className="referrals-copy-group">
      <Card
        component="button"
        type="transparent"
        border="dashed"
        color="gray"
        rounded
        onClick={highlightText}
      >
        <Text
          className="referrals-copyable-link"
          code
        >{`https://airdrop.fluidity.money/${referralCode}`}</Text>
      </Card>

      {/* Copy Button */}
      <GeneralButton
        className={"referrals-copy-button"}
        type={"transparent"}
        buttontype={"icon before"}
        handleClick={() => {
          navigator.clipboard.writeText(
            `https://airdrop.fluidity.money/${referralCode}`
          );
          setLinkCopied(true);
        }}
        size={"medium"}
        icon={<CopyIcon />}
      >
        <Text size="lg" prominent bold style={{ color: "inherit" }}>
          {!linkCopied ? "Copy Link" : "Link Copied!"}
        </Text>
      </GeneralButton>
      {/*Share Button*/}
      <Text size="sm">
        Share to: &nbsp;
        <TextButton
          style={{ color: "white", marginTop: "1.5em" }}
          onClick={() => {
            window.open(
              generateReferralTweet(
                `https://airdrop.fluidity.money/${referralCode}`
              )
            );
          }}
        >
          <Text code prominent size={"sm"}>
            <Twitter
              style={{
                height: "1em",
                fill: "currentColor",
                translate: "0 2px",
                marginRight: 2,
              }}
            />
            TWITTER
          </Text>
        </TextButton>
      </Text>
    </div>
  );
};

const ReferralModal = ({
  connected,
  network,
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
  const [showHowItWorks, setShowHowItWorks] = useState(true);

  const navigate = useNavigate();

  const referralsEmoji = referrerClaimed ? "🎉" : "😔";

  const mobileBreakpoint = 768;
  const { width } = useViewport();

  const isMobile = width < mobileBreakpoint;

  return (
    <>
      <div className="referrals-content">
        <div className="referrals-header">
          {/* Help Button */}
          {/* <GeneralButton
            type={"secondary"}
            buttontype={"text"}
            handleClick={() =>
              navigate(`/${network}/dashboard/airdrop#tutorial`)
            }
            size={"small"}
            border="box"
          >
            ?
          </GeneralButton> */}
          <Text size="sm">REFERRAL SYSTEM</Text>
        </div>

        <div>
          <Heading as={"h5"} className="referrals-heading">
            YOU HAVE {referrerClaimed}&nbsp;
            <Hoverable
              style={{ minWidth: 250 }}
              tooltipStyle={isMobile ? "frosted" : "solid"}
              tooltipContent={
                <Text size="xs">
                  Active Referrals are Referrals that have earned 10 Loot
                  Bottles
                </Text>
              }
            >
              <TextButton
                style={{ textDecorationThickness: 1, textUnderlineOffset: 5 }}
              >
                ACTIVE REFERRALS
              </TextButton>
            </Hoverable>
            &nbsp;{referralsEmoji}
          </Heading>
          <Text size="sm">Send more of your link to earn more rewards!</Text>
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
          <CopyGroup referralCode={referralCode} />
        ) : (
          <LoadingDots />
        )}
      </div>

      {/* How It Works Divider / Links*/}
      <div className="referrals-inner-box">
        <div className="referrals-inner-switcher">
          <div className="referrals-inner-divider" />
          <GeneralButton
            type={showHowItWorks ? "primary" : "transparent"}
            buttontype={"text"}
            handleClick={() => setShowHowItWorks(true)}
            size={"small"}
          >
            <Text size="sm" code style={{ color: "inherit" }}>
              How It Works
            </Text>
          </GeneralButton>
          <div className="referrals-inner-divider" />
          <GeneralButton
            type={!showHowItWorks ? "primary" : "transparent"}
            buttontype={"text"}
            handleClick={() => setShowHowItWorks(false)}
            size={"small"}
          >
            <Text size="md" code style={{ color: "inherit" }}>
              Links I&apos;ve Clicked
            </Text>
          </GeneralButton>
          <div className="referrals-inner-divider" />
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
            network={network}
            navigate={navigate}
            closeModal={closeModal}
          />
        )}
      </div>
    </>
  );
};

const HowItWorksContent = ({ isMobile = false }: { isMobile?: boolean }) => (
  <div
    className={`referrals-inner-content ${isMobile ? "airdrop-mobile" : ""}`}
  >
    <div className="spread-center">
      <div className="single-line">
        <img style={{ width: "1.25em" }} src={"https://app-cdn.fluidity.money/images/icons/circle1.svg"} />
        <Text prominent size="sm">
          Copy Your Link.
        </Text>
      </div>
      <div className="single-line">
        <img style={{ width: "1.25em" }} src={"https://app-cdn.fluidity.money/images/icons/circle2.svg"} />
        <Text prominent size="sm">
          Share it with your friends.
        </Text>
      </div>
    </div>
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
          <strong>5 Loot Bottles,</strong>
          <br />
          not affected by your 10% reward.
        </Text>
      </div>
    </Card>
    <div className="how-it-works-warning-container">
      <img
        style={{ width: isMobile ? "auto" : "50px" }}
        src="https://app-cdn.fluidity.money/images/icons/circleInfo.svg"
      />
      <Text prominent size="sm" className="how-it-works-warning-text">
        They will have to earn 5 Loot Bottles for each referral in order to
        claim their reward and activate yours.
      </Text>
    </div>
  </div>
);

type ILinksClickedContent = {
  claimed: number;
  unclaimed: number;
  progress: number;
  progressReq: number;
  network: string;
  navigate: NavigateFunction;
  closeModal: () => void;
};

const LinksClickedContent = ({
  claimed,
  unclaimed,
  progress,
  progressReq,
  network,
  navigate,
  closeModal,
}: ILinksClickedContent) => (
  <div className="referrals-inner-content links-clicked-content">
    <Text size="sm" prominent>
      In order to claim your referral rewards, you must earn 10 Loot Bottles for{" "}
      <strong style={{ color: "yellow" }}>each</strong> unclaimed referral.
    </Text>
    <GeneralButton
      layout="after"
      size="small"
      type="transparent"
      icon={<ArrowRight />}
      handleClick={() => {
        navigate(`/${network}/dashboard/airdrop`);
        closeModal();
      }}
    >
      <Text style={{ color: "inherit" }} code size="sm">
        Go to Fluidity Airdrop Page
      </Text>
    </GeneralButton>

    <div className="links-clicked-stats">
      <div className="statistics-set">
        <Text size="sm" className="single-line">
          Claimed
          <div className="dot green" />
        </Text>
        <Display size={"xs"} style={{ margin: "0.2em 0 0.2em 0" }}>
          {claimed}
        </Display>
        <Text size="sm" code>
          {claimed * 5} BOTTLES
        </Text>
      </div>

      <div className="statistics-set">
        <Text size="sm" className="single-line">
          Unclaimed
          <div className="dot red" />
        </Text>
        <Display size={"xs"} style={{ margin: "0.2em 0 0.2em 0" }}>
          {unclaimed}
        </Display>
        <LinkButton
          size="small"
          type="internal"
          handleClick={() =>
            navigate(`/${network}/dashboard/airdrop#referrals`)
          }
        >
          Start Claiming
        </LinkButton>
      </div>

      <div className="statistics-set">
        <Text size="sm">Until Next Claim</Text>
        <Display size={"xs"} style={{ margin: "0.2em 0 0.2em 0" }}>
          {Math.floor(progress * 10) / 10}/{progressReq}
        </Display>
        <ProgressBar
          size="sm"
          value={progress}
          max={progressReq}
          style={{ marginTop: 10 }}
        />
      </div>
    </div>
  </div>
);

export default ReferralModal;
export { CopyGroup, HowItWorksContent };
