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
  Heading,
  Video,
} from "@fluidity-money/surfing";
import AugmentedToken from "~/types/AugmentedToken";
import {
  addDecimalToBn,
  getTokenAmountFromUsd,
} from "~/util/chainUtils/tokens";
import { dayDifference } from ".";

import { Referral } from "~/queries";
import { BottleTiers, StakingEvent } from "../../query/dashboard/airdrop";
import { AnimatePresence, motion } from "framer-motion";

interface IBottleDistribution {
  bottles: BottleTiers;
  showBottleNumbers?: boolean;
  highlightBottleNumberIndex?: number;
  isMobile?: boolean;
}

const BottleDistribution = ({
  bottles,
  showBottleNumbers = true,
  highlightBottleNumberIndex,
  isMobile = false
}: IBottleDistribution) => (
  <div className="bottle-distribution-container"
    style={isMobile ? {
      maxWidth: '100%',
      overflowX: 'scroll',
      height: 160,
    } : {}}
  >
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
              bottom: "120px",
              zIndex: '5',
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
      <div style={{ position: "relative", border: "1px gray" }}>
        <div
          style={{
            position: "absolute",
            top: "-24px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <GeneralButton> Select All</GeneralButton>
          <GeneralButton> Withdraw</GeneralButton>
        </div>
        <div>
          {stakes.map(
            (
              {
                amount,
                durationDays,
                multiplier,
                insertedDate: insertedDateStr,
              },
              i
            ) => {
              const insertedDate = new Date(insertedDateStr);
              const stakedDays = dayDifference(new Date(), insertedDate);

              const endDate = new Date(insertedDate);
              endDate.setDate(endDate.getDate() + durationDays);

              return (
                <div
                  key={`stake-${i}`}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "0.2 0.6 0.1 0.1",
                  }}
                >
                  {/* Dates */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: "0.5em",
                    }}
                  >
                    <Text>Start Date</Text>
                    <Text prominent>
                      {insertedDate.toLocaleDateString("en-US")}
                    </Text>

                    <Text>End Date</Text>
                    <Text prominent>{endDate.toLocaleDateString("en-US")}</Text>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: "0.5em",
                    }}
                  >
                    <Heading as="h3">{numberToMonetaryString(amount)}</Heading>
                    <ProgressBar
                      value={stakedDays}
                      max={durationDays}
                      rounded
                      color={durationDays === stakedDays ? "holo" : "gray"}
                      size="sm"
                    />
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text prominent>{multiplier}x Multiplier</Text>
                      <Text prominent>
                        {durationDays - stakedDays} Days Left
                      </Text>
                    </div>
                  </div>
                  <div
                    style={{ alignSelf: "flex-end", marginBottom: "-0.2em" }}
                  >
                    <Text>Staked For</Text>
                    <Heading as="h2">{durationDays}</Heading>
                    <Text>Days</Text>
                  </div>
                  <div>
                    <input type="checkbox" />
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>
    </>
  );
};

interface IStakingNowModal {
  fluidTokens: Array<AugmentedToken>;
  baseTokens: Array<AugmentedToken>;
  stakeToken?: (
    lockDurationSeconds: BN,
    usdcAmt: BN,
    fusdc: BN,
    wethAmt: BN,
    slippage: BN
  ) => void;
}

type StakingAugmentedToken = AugmentedToken & {
  amount: string;
};

// Staking Multiplier Equation
export const stakingLiquidityMultiplierEq = (
  stakedDays: number,
  totalStakedDays: number
) =>
  (396 / 11315 - (396 * totalStakedDays) / 4129975) * stakedDays +
  (396 * totalStakedDays) / 133225 -
  31 / 365;

const StakeNowModal = ({
  fluidTokens,
  baseTokens,
  stakeToken,
}: IStakingNowModal) => {
  const [fluidToken, setFluidToken] = useState<StakingAugmentedToken>({
    ...fluidTokens[0],
    amount: "",
  });
  const [baseToken, setBaseToken] = useState<StakingAugmentedToken>({
    ...baseTokens[0],
    amount: "",
  });

  const [stakingDuration, setStakingDuration] = useState(31);

  const endDate = new Date();
  endDate.setDate(endDate.getDate() + stakingDuration);

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

  const handleStake = async () => {
    if (!stakeToken) return;
    if (!canStake()) return;

    try {
      // await stakeToken();
    } catch (e) {
      // Expect error on fail
      console.log(e);
      return;
    }
  };

  const [showTokenSelector, setShowTokenSelector] = useState<
    "fluid" | "base" | ""
  >("base");

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
            <GeneralButton
              type="secondary"
              size="small"
              handleClick={() => inputMaxBalance()}
            >
              Max
            </GeneralButton>
          </div>
          {showTokenSelector === "fluid" ? (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "1em",
                background: "black",
              }}
            >
              {fluidTokens.map((token) => (
                <div
                  key={`${token.symbol}`}
                  onClick={() => {
                    if (fluidToken.symbol != token.symbol) {
                      setFluidToken({
                        ...token,
                        amount: "",
                      });
                    }
                    setShowTokenSelector("");
                  }}
                >
                  <TokenIcon
                    key={token.symbol}
                    token={token.symbol}
                    className={"staking-modal-token-icon"}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className={"staking-modal-input-container"}>
              <div onClick={() => setShowTokenSelector("fluid")}>
                <TokenIcon
                  className={"staking-modal-token-icon"}
                  token={fluidToken.symbol}
                />
              </div>
              <input
                className={"staking-modal-token-input"}
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
          )}
          {showTokenSelector === "base" ? (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "1em",
                background: "black",
              }}
            >
              {baseTokens.map((token) => (
                <div
                  key={`${token.symbol}`}
                  onClick={() => {
                    if (baseToken.symbol != token.symbol) {
                      setBaseToken({
                        ...token,
                        amount: "",
                      });
                    }
                    setShowTokenSelector("");
                  }}
                >
                  <TokenIcon
                    className={"staking-modal-token-icon"}
                    key={token.symbol}
                    token={token.symbol}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className={"staking-modal-input-container"}>
              <div onClick={() => setShowTokenSelector("base")}>
                <TokenIcon
                  className={"staking-modal-token-icon"}
                  token={baseToken.symbol}
                />
              </div>
              <input
                className={"staking-modal-token-input"}
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
          )}
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
              END: <Text>{endDate.toLocaleDateString("en-US")}</Text>{" "}
              <InfoCircle />
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
        handleClick={() => handleStake()}
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
    title: 'WHAT ARE LOOT BOTTLES?',
    desc: 'Welcome to the Fluidity Airdrop! Use Fluid Assets and earn Loot Bottles. Loot Bottles contain $FLUID tokens. They have different rarities, from common to legendary. The higher the rarity, the more $FLUID tokens it contains. ',
    image: 'REFERRALS',
  },
  "1": {
    title: 'HOW TO EARN LOOT BOTTLES?',
    desc: 'To participate in the airdrop, all you need to do is Fluidify your tokens and start transacting with them. The more Fluid Transactions you perform, the more Loot Bottles you get and the higher your chances of receiving rarer Loot Bottles. ',
    image: 'REFERRALS',
  },
  "2": {
    title: 'MULTIPLIERS',
    desc: <>
      <Text size="md">You can increase your chances of receiving Loot Bottles by doing the following:</Text>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          columnGap: "2em",
          rowGap: "1em",
          alignItems: "center",
        }}
      >
        <Text prominent code holo>
          <Display style={{margin:0, textAlign: 'right'}} size="xs">2x</Display> 
        </Text>
        <Text size="md" holo>
          Transacting fAssets using our supported DEXs
        </Text>
        <LootBottle
          size="sm"
          style={{width: 40, height: 40}}
          rarity="rare"
          quantity={100}
        />
        <Text prominent size="md">
          Staking liquidity for the maximum time
        </Text>
        <LootBottle
          size="sm"
          style={{width: 40, height: 40}}
          rarity="legendary"
          quantity={10}
        />
        <Text size="md" prominent>
          Contributing volume
        </Text>
        <LootBottle
          size="sm"
          style={{width: 40, height: 40}}
          rarity="ultra_rare"
          quantity={10}
        />
        <Text size="md" prominent>
          Participating in the Testnet
        </Text>
      </div>
    </>,
    image: 'MULTIPLIER',
  },
  "3": {
    title: 'REFERRALS',
    desc: 'You can generate your own referral link and invite your friends to try out Fluidity! In exchange you will receive 10% of their airdrop earnings throughout the entire epoch. Your friend will receive 10 Loot Bottles after performing certain actions. ',
    image: 'REFERRALS',
  },
  "4": {
    title: 'LEARN MORE',
    desc: 'To learn more about the Airdrop and Fluidity, check out the Airdrop announcement post.',
    image: 'AIRDROP_DEEP_DIVE',
  },
}

const TutorialModal = ({ isMobile }: {isMobile?: boolean}) => {
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
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
        gap: '1em',
      }}
    >
      <Video 
        type="cover"
        width={isMobile ? 550 : (1270/2)}
        height={isMobile ? 550 : (460/2)}
        loop
        src={`/videos/airdrop/${isMobile ? `MOBILE` : `DESKTOP`}_-_${tutorialContent[currentSlide].image}.mp4`} 
        className='tutorial-image'
      />
      <Display size="xxs" style={{margin: 0}}>{ tutorialContent[currentSlide].title }</Display>
      { tutorialContent[currentSlide].desc }
    </motion.div>
    </AnimatePresence>

    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '1em'
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
        type="transparent"
        disabled={currentSlide === 4}
      >
        Next
      </GeneralButton>
    </div>
  </>;
};

export {
  BottleDistribution,
  TutorialModal,
  StakeNowModal,
  StakingStatsModal,
  BottlesDetailsModal,
  ReferralDetailsModal,
};
