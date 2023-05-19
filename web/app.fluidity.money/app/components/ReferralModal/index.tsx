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
            handleClick={() =>
              navigate(`/${network}/dashboard/airdrop#tutorial`)
            }
            size={"small"}
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
            size={"small"}
            border="box"
          >
            X
          </GeneralButton>
        </div>

        <div>
          <Heading as={"h5"} className="referrals-heading">
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
              <ul
                style={{
                  paddingLeft: "0.5em",
                  paddingRight: "0.5em",
                  textDecoration: "underline dotted",
                  textUnderlineOffset: "0.25em",
                }}
              >
                ACTIVE REFERRALS
              </ul>
            </Hoverable>{" "}
            {referralsEmoji}
          </Heading>
          <Text size="md">Send more of your link to earn more rewards!</Text>
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
              border="dashed"
              color="white"
              rounded
              onClick={highlightText}
            >
              <Text
                code
                prominent
              >{`https://airdrop.fluidity.money/${referralCode}`}</Text>
            </Card>

            {/* Copy Button */}
            <GeneralButton
              className={"spread"}
              type={"secondary"}
              buttontype={"icon before"}
              handleClick={() => {
                navigator.clipboard.writeText(
                  `https://airdrop.fluidity.money/${referralCode}`
                );
                setLinkCopied(true);
              }}
              size={"large"}
              icon={<CopyIcon />}
            >
              {!linkCopied ? "Copy Link" : "Link Copied!"}
            </GeneralButton>
          </>
        ) : (
          <LoadingDots />
        )}

        {/*Share Button*/}
        <Text size="sm">
          Share to: &nbsp;
          <a
            target="_blank"
            href={generateReferralTweet(
              `https://airdrop.fluidity.money/${referralCode}`
            )}
          >
            <Text
              code
              prominent
              size={"sm"}
              style={{
                textDecoration: "underline dotted",
                textUnderlineOffset: "0.25em",
              }}
            >
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
            size={"medium"}
          >
            How It Works
          </GeneralButton>
          <GeneralButton
            type={!showHowItWorks ? "primary" : "secondary"}
            buttontype={"text"}
            handleClick={() => setShowHowItWorks(false)}
            size={"medium"}
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
            network={network}
            navigate={navigate}
          />
        )}
      </Card>
    </Card>
  );
};

const HowItWorksContent = () => (
  <div className="referrals-content referrals-inner-content">
    <div className="spread-center">
      <div className="single-line">
        <img style={{ width: "1.25em" }} src={"/images/icons/circle1.svg"} />
        <Text prominent size="md">
          Copy Your Link.
        </Text>
      </div>
      <div className="single-line">
        <img style={{ width: "1.25em" }} src={"/images/icons/circle2.svg"} />
        <Text prominent size="md">
          Share it with your friends.
        </Text>
      </div>
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
        <Text prominent size="lg" className="single-line">
          <ul>You Get</ul> 💸
        </Text>
        <Text prominent size="md">
          <strong>10% of their airdrop</strong>
          <br />
          earnings throughout
          <br />
          the entire Epoch.
        </Text>
      </div>
      {/* How it works Box Right*/}
      <div>
        <Text prominent size="lg" className="single-line">
          🍾<ul>They Get</ul>
        </Text>
        <Text prominent size="md">
          <strong>10 Loot Bottles,</strong>
          <br />
          not affected by
          <br />
          your 10% reward.
        </Text>
      </div>
    </Card>
    <div className="how-it-works-warning-container">
      <img style={{ width: "50px" }} src="/images/icons/circleInfo.svg" />
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
  network: string;
  navigate: NavigateFunction;
};

const LinksClickedContent = ({
  claimed,
  unclaimed,
  progress,
  progressReq,
  network,
  navigate,
}: ILinksClickedContent) => (
  <div className="referrals-content referrals-inner-content">
    <Text size="md" prominent>
      In order to claim your referral rewards, you must earn 10 Loot Bottles for{" "}
      <strong style={{ color: "yellow" }}>each</strong> unclaimed referral.
    </Text>
    <GeneralButton
      layout="after"
      size="large"
      type="secondary"
      icon={<ArrowRight />}
      handleClick={() => navigate(`/${network}/dashboard/airdrop`)}
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
        <Text size="lg">Until Next Claim</Text>
        <Display size={"xs"} style={{ margin: 0 }}>
          {progress}/{progressReq}
        </Display>
        <ProgressBar value={progress} max={progressReq} />
      </div>
    </div>
  </div>
);

export default ReferralModal;
