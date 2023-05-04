import { useState } from "react";
import BN from "bn.js";
import {
  Card,
  LabelledValue,
  LinkButton,
  Text,
  ProgressBar,
  GeneralButton,
  ArrowRight,
  Display,
  LootBottle,
  numberToMonetaryString,
  InfoCircle,
  TokenIcon,
  toSignificantDecimals,
  ArrowLeft,
} from "@fluidity-money/surfing";
import AugmentedToken from "~/types/AugmentedToken";
import {
  addDecimalToBn,
  getTokenAmountFromUsd,
} from "~/util/chainUtils/tokens";

import { Referral } from "~/queries";
import { BottleTiers, StakingEvent } from "../../query/dashboard/airdrop";
import { AnimatePresence, motion } from "framer-motion";

interface IBottleDistribution {
  bottles: BottleTiers;
  showBottleNumbers?: boolean;
  highlightBottleNumberIndex?: number;
}

const BottleDistribution = ({
  bottles,
  showBottleNumbers = true,
  highlightBottleNumberIndex,
}: IBottleDistribution) => (
  <div className="bottle-distribution-container">
    {Object.entries(bottles).map(([rarity, quantity], index) => {
      return (
        <div key={index} className="lootbottle-container">
          <LootBottle
            size="lg"
            rarity={rarity}
            quantity={quantity}
            style={{
              marginBottom: "0.6em",
            }}
          />
          <Text style={{ whiteSpace: "nowrap" }}>{rarity.toUpperCase()}</Text>
          <Text
            prominent
            style={{
              position: "absolute",
              bottom: "112px",
              ...(showBottleNumbers
                ? highlightBottleNumberIndex === index
                  ? {
                    fontSize: "2em",
                  }
                  : {}
                : highlightBottleNumberIndex === index
                  ? { fontSize: "2em" }
                  : { display: "none" }),
            }}
          >
            {toSignificantDecimals(quantity)}
          </Text>
        </div>
      );
    })}
  </div>
);

interface IReferralDetailsModal {
  bottles: BottleTiers;
  activeRefereeReferralsCount: number;
  activeReferrerReferralsCount: number;
  inactiveReferrerReferralsCount: number;
  nextInactiveReferral?: Referral;
}

const ReferralDetailsModal = ({
  bottles,
  activeRefereeReferralsCount,
  activeReferrerReferralsCount,
  inactiveReferrerReferralsCount,
  nextInactiveReferral,
}: IReferralDetailsModal) => (
  <>
    <Display size="xxxs">My Referral Link</Display>
    <div className="referral-details-container">
      <LabelledValue label={<Text size="sm">Active Referrals</Text>}>
        {activeRefereeReferralsCount}
      </LabelledValue>
      <LabelledValue
        label={<Text size="sm">Total Bottles earned from your link</Text>}
      >
        1,051
      </LabelledValue>
    </div>
    <Text size="sm">Bottle Distribution</Text>
    <BottleDistribution bottles={bottles} />
    <div
      style={{
        width: "100%",
        borderBottom: "1px solid white",
        margin: "1em 0",
      }}
    />
    <Display size="xxxs">Links I&apos;ve Clicked</Display>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "auto auto auto auto",
        gap: "1em",
        paddingBottom: "1em",
      }}
    >
      <LabelledValue label="Total Clicked">
        {activeReferrerReferralsCount + inactiveReferrerReferralsCount}
      </LabelledValue>
      <div>
        <LabelledValue label="Claimed">
          {activeReferrerReferralsCount}
        </LabelledValue>
        <Text>{activeReferrerReferralsCount * 10} BOTTLES</Text>
      </div>
      <div>
        <LabelledValue label="Unclaimed">
          {inactiveReferrerReferralsCount}
        </LabelledValue>
        <LinkButton
          handleClick={() => {
            return;
          }}
          color="gray"
          size="small"
          type="internal"
        >
          START CLAIMING
        </LinkButton>
      </div>
      {nextInactiveReferral && (
        <div>
          <LabelledValue label="Until Next Claim">
            {nextInactiveReferral.progress}/10
          </LabelledValue>
          <ProgressBar
            value={nextInactiveReferral.progress}
            max={10}
            size="sm"
            color="holo"
          />
        </div>
      )}
    </div>
  </>
);

interface IBottlesDetailsModal {
  bottles: BottleTiers;
}

const BottlesDetailsModal = ({ bottles }: IBottlesDetailsModal) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "1em",
      alignItems: "center",
    }}
  >
    <BottleDistribution bottles={bottles} />
    <GeneralButton
      icon={<ArrowRight />}
      layout="after"
      handleClick={() => {
        return;
      }}
      type="transparent"
    >
      SEE YOUR LOOTBOTTLE TX HISTORY
    </GeneralButton>
    <div
      style={{
        width: "100%",
        borderBottom: "1px solid white",
        margin: "1em 0",
      }}
    />
    <LabelledValue
      label={<Text size="sm">Bottles earned since last checked</Text>}
    >
      <LootBottle size="lg" rarity="legendary"></LootBottle>
    </LabelledValue>
  </div>
);

interface IStakingStatsModal {
  liqudityMultiplier: number;
  stakes: Array<StakingEvent>;
}
const StakingStatsModal = ({
  liqudityMultiplier,
  stakes,
}: IStakingStatsModal) => {
  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto auto auto",
          gap: "1em",
        }}
      >
        <LabelledValue
          label={<Text size="sm">Total Liquidity Multiplier</Text>}
        >
          <Text holo>{liqudityMultiplier.toLocaleString()}x</Text>
        </LabelledValue>
        <LabelledValue label={<Text size="sm">My Stakes</Text>}>
          {stakes.length}
        </LabelledValue>
        <LabelledValue label={<Text size="sm">Total Amount Staked</Text>}>
          {numberToMonetaryString(
            stakes.reduce((sum, { amount }) => sum + amount, 0)
          )}
        </LabelledValue>
      </div>
    </>
  );
};

interface IStakingNowModal {
  fluidTokens: Array<AugmentedToken>;
  baseTokens: Array<AugmentedToken>;
}

type StakingAugmentedToken = AugmentedToken & {
  amount: string;
};

const StakeNowModal = ({ fluidTokens, baseTokens }: IStakingNowModal) => {
  const [fluidToken, setFluidToken] = useState<StakingAugmentedToken>({
    ...fluidTokens[0],
    amount: "",
  });
  const [baseToken, setBaseToken] = useState<StakingAugmentedToken>({
    ...baseTokens[0],
    amount: "",
  });
  const [stakingDuration, setStakingDuration] = useState(31);

  // Staking Multiplier Equation
  // Reference: https://www.notion.so/fluidity/Fluidity-Airdrops-Loot-bottles-5d1bcf986d5a45a7a29bfc200fbfbb20?pvs=4#f47a040e934a41bbbb1793a7349146b6
  const stakingLiquidityMultiplierEq = (
    stakedDays: number,
    totalStakedDays: number
  ) =>
    (396 / 11315 - (396 * totalStakedDays) / 4129975) * stakedDays +
    (396 * totalStakedDays) / 133225 -
    31 / 365;

  const parseSwapInputToTokenAmount = (
    input: string,
    token: StakingAugmentedToken
  ): BN => {
    const [whole, dec] = input.split(".");

    const wholeBn = getTokenAmountFromUsd(new BN(whole || 0), token);

    if (dec === undefined) {
      return wholeBn;
    }

    const decimalsBn = new BN(dec).mul(
      new BN(10).pow(new BN(token.decimals - dec.length))
    );

    return wholeBn.add(decimalsBn);
  };

  // Snap the smallest of token balance, remaining mint limit, or swap amt
  const snapToValidValue = (
    input: string,
    token: StakingAugmentedToken
  ): BN => {
    const usdBn = parseSwapInputToTokenAmount(input, token);

    return BN.min(usdBn, token.userTokenBalance);
  };

  const handleChangeStakingInput =
    (
      token: StakingAugmentedToken,
      setInput: (token: StakingAugmentedToken) => void
    ): React.ChangeEventHandler<HTMLInputElement> =>
      (e) => {
        const numericChars = e.target.value.replace(/[^0-9.]+/, "");

        const [whole, dec] = numericChars.split(".");

        const unpaddedWhole = whole === "" ? "" : parseInt(whole) || 0;

        if (dec === undefined) {
          return setInput({
            ...token,
            amount: `${unpaddedWhole}`,
          });
        }

        const limitedDecimals = dec.slice(0 - token.decimals);

        return setInput({
          ...token,
          amount: [whole, limitedDecimals].join("."),
        });
      };

  const inputMaxBalance = () => {
    setFluidToken({
      ...fluidToken,
      amount: addDecimalToBn(
        snapToValidValue(fluidToken.userTokenBalance.toString(), fluidToken),
        fluidToken.decimals
      ),
    });

    setBaseToken({
      ...baseToken,
      amount: addDecimalToBn(
        snapToValidValue(baseToken.userTokenBalance.toString(), baseToken),
        baseToken.decimals
      ),
    });
  };

  const canStake = () => false;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "2em",
      }}
    >
      <Card
        type="opaque"
        rounded
        color="holo"
        fill
        style={{
          color: "black",
          textAlign: "center",
        }}
      >
        👀 TIP: Stake over 31 days for more rewards in future epochs & events!
        🌊
      </Card>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 2fr",
          gap: "1em",
        }}
      >
        {/* Staking Amount */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1em",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text prominent code>
              STAKE AMOUNT <InfoCircle />
            </Text>
            <GeneralButton type="secondary" size="small">
              Max
            </GeneralButton>
          </div>
          <div
            style={{
              border: "1px solid gray",
              display: "flex",
              padding: "5px",
              borderRadius: "5em 14px 14px 5em",
            }}
          >
            <TokenIcon style={{ width: "64px" }} token={fluidToken.symbol} />
            <input
              style={{
                background: "none",
                border: "none",
                width: "100%",
                color: "white",
                fontSize: "2em",
                outline: "none",
              }}
              className={"staking-input"}
              min={""}
              value={fluidToken.amount}
              onBlur={(e) =>
                setFluidToken({
                  ...fluidToken,
                  amount: addDecimalToBn(
                    snapToValidValue(e.target.value, fluidToken),
                    fluidToken.decimals
                  ),
                })
              }
              onChange={handleChangeStakingInput(fluidToken, setFluidToken)}
              placeholder="0"
              step="any"
            />
          </div>
          <div
            style={{
              border: "1px solid gray",
              display: "flex",
              padding: "5px",
              borderRadius: "5em 14px 14px 5em",
            }}
          >
            <TokenIcon style={{ width: "64px" }} token={baseToken.symbol} />
            <input
              style={{
                background: "none",
                border: "none",
                color: "white",
                fontSize: "2em",
                outline: "none",
              }}
              className={"staking-input"}
              min={""}
              value={baseToken.amount}
              onBlur={(e) =>
                setBaseToken({
                  ...baseToken,
                  amount: addDecimalToBn(
                    snapToValidValue(e.target.value, baseToken),
                    baseToken.decimals
                  ),
                })
              }
              onChange={handleChangeStakingInput(baseToken, setBaseToken)}
              placeholder="0"
              step="any"
            />
          </div>
        </div>
        {/* Arrow */}
        <div>
          <ArrowRight />
        </div>
        {/* Duration */}
        <div>
          <Text prominent code>
            DURATION <InfoCircle />
          </Text>
          <Display>
            {stakingDuration} D{/* Scrollbar */}
          </Display>
          <input
            type="range"
            min={31}
            value={stakingDuration}
            max={365}
            step="1"
            onChange={(e) => setStakingDuration(e.target.valueAsNumber)}
          />
          <div>
            <Text>
              END: <Text>{Date.now() + stakingDuration}</Text> <InfoCircle />
            </Text>
          </div>
        </div>
      </div>
      <div style={{ border: "1px white dashed" }} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 2fr",
          gap: "1em",
        }}
      >
        <div>
          <LabelledValue
            label={
              <Text code>
                DAY 1 POWER <InfoCircle />
              </Text>
            }
          >
            {toSignificantDecimals(
              stakingLiquidityMultiplierEq(1, stakingDuration)
            )}
          </LabelledValue>
          <Text prominent code>
            @ MULTIPLIER{" "}
            {toSignificantDecimals(
              stakingLiquidityMultiplierEq(1, stakingDuration)
            )}
            X
          </Text>
        </div>
        <div>
          <ArrowRight />
        </div>
        <div>
          <LabelledValue
            label={
              <Text code>
                DAY 31 POWER <InfoCircle />
              </Text>
            }
          >
            {toSignificantDecimals(
              stakingLiquidityMultiplierEq(31, stakingDuration)
            )}
          </LabelledValue>
          <Card
            type="opaque"
            color="holo"
            style={{ padding: "4px 8px 4px 8px", color: "black" }}
          >
            @ MULTIPLIER{" "}
            {toSignificantDecimals(
              stakingLiquidityMultiplierEq(31, stakingDuration)
            )}
            X
          </Card>
        </div>
      </div>
      <GeneralButton
        type="secondary"
        disabled={!canStake()}
        style={{ width: "95%" }}
      >
        Stake
      </GeneralButton>
    </div>
  );
};

type TutorialSlide = {
  title: string;
  desc: React.ReactNode;
  image: string;
}

const tutorialContent: {
  [key: number]: TutorialSlide
} = {
  "0": {
    title: 'What are Loot Bottles?',
    desc: '',
    image: '/images/placeholderAirdrop1.png',
  },
  "1": {
    title: 'How to earn Loot Bottles',
    desc: '',
    image: '/images/placeholderAirdrop2.png',
  },
  "2": {
    title: 'Multipliers',
    desc: '',
    image: '/images/placeholderAirdrop3.png',
  },
  "3": {
    title: 'Referrals',
    desc: '',
    image: '/images/placeholderAirdrop1.png',
  },
  "4": {
    title: 'Learn More',
    desc: '',
    image: '/images/placeholderAirdrop2.png',
  },
}

const TutorialModal = () => {
  const [currentSlide, setCurrentSlide] = useState(0)


  return <>
  <AnimatePresence
    mode="wait"
  >
    <motion.div
      key={`tutorial-slide-${currentSlide}`}
      initial={{ opacity: 0 }}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
      transition={{duration: 0.1}}

      className={'tutorial-slide-container'}
    >
      <img src={tutorialContent[currentSlide].image} className='tutorial-image'/>
      { tutorialContent[currentSlide].title }
      { tutorialContent[currentSlide].desc }
    </motion.div>
    </AnimatePresence>

    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <GeneralButton
        icon={<ArrowLeft />}
        layout="before"
        handleClick={() => {
          setCurrentSlide(currentSlide - 1)
        }}
        type="transparent"
        disabled={currentSlide === 0}
      >
        PREV
      </GeneralButton>
      { currentSlide + 1 } / 5
      <GeneralButton
        icon={<ArrowRight />}
        layout="after"
        handleClick={() => {
          setCurrentSlide(currentSlide + 1)
        }}
        type="secondary"
        disabled={currentSlide === 4}
      >
        Next
      </GeneralButton>
    </div>
  </>;
};



const TutorialContent = () => {
  return <motion.div>
    
  </motion.div>
}

export {
  BottleDistribution,
  TutorialModal,
  StakeNowModal,
  StakingStatsModal,
  BottlesDetailsModal,
  ReferralDetailsModal,
};
