import type {
  StakingRatioRes,
  StakingDepositsRes,
} from "~/util/chainUtils/ethereum/transaction";

import { useState, useEffect } from "react";
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
  InfoCircle,
  TokenIcon,
  toSignificantDecimals,
  ArrowLeft,
  Heading,
  Video,
  Hoverable,
  Form,
} from "@fluidity-money/surfing";
import AugmentedToken from "~/types/AugmentedToken";
import {
  addDecimalToBn,
  getTokenAmountFromUsd,
} from "~/util/chainUtils/tokens";
import { dayDifference } from ".";

import { Referral } from "~/queries";
import { BottleTiers } from "../../query/dashboard/airdrop";
import { AnimatePresence, motion } from "framer-motion";

interface IBottleDistribution extends React.HTMLAttributes<HTMLDivElement> {
  bottles: BottleTiers;
  showBottleNumbers?: boolean;
  highlightBottleNumberIndex?: number;
  numberPosition?: "absolute" | "relative";
}

const BottleDistribution = ({
  bottles,
  showBottleNumbers = true,
  highlightBottleNumberIndex,
  numberPosition = "absolute",
  ...props
}: IBottleDistribution) => (
  <div className="bottle-distribution-container" {...props}>
    {Object.entries(bottles).map(([rarity, quantity], index) => {
      return (
        <div key={index} className="lootbottle-container">
          <LootBottle
            size="lg"
            rarity={rarity}
            quantity={quantity}
            style={{
              marginBottom: "0.6em",
              opacity:
                numberPosition === "relative" ||
                  highlightBottleNumberIndex === index
                  ? 1
                  : 0.2,
            }}
          />
          <Text
            size="sm"
            style={{ whiteSpace: "nowrap", textTransform: "capitalize" }}
          >
            {rarity.replace("_", " ")}
          </Text>
          <Text
            prominent={
              numberPosition === "relative" ||
              highlightBottleNumberIndex === index
            }
            style={
              numberPosition === "absolute"
                ? {
                  position: "absolute",
                  bottom: "100px",
                  zIndex: "5",
                  ...(showBottleNumbers
                    ? highlightBottleNumberIndex === index
                      ? {
                        fontSize: "2.5em",
                      }
                      : {}
                    : highlightBottleNumberIndex === index
                      ? { fontSize: "2.5em" }
                      : { display: "none" }),
                }
                : { fontSize: "1em" }
            }
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
  totalBottles: number;
  activeRefereeReferralsCount: number;
  activeReferrerReferralsCount: number;
  inactiveReferrerReferralsCount: number;
  nextInactiveReferral?: Referral;
  isMobile?: boolean
}

const ReferralDetailsModal = ({
  bottles,
  totalBottles,
  activeRefereeReferralsCount,
  activeReferrerReferralsCount,
  inactiveReferrerReferralsCount,
  nextInactiveReferral,
  isMobile
}: IReferralDetailsModal) => {

  const tooltipStyle = isMobile ? "frosted" : "solid"

  return (
    <>
      <div style={{ display: "flex", gap: "1em", alignItems: "center" }}>
        <Display className="no-margin" size="xxxs">
          My Referral Link
        </Display>
        {/* <Hoverable tooltipStyle={tooltipStyle} tooltipContent={"Lorem ipsum"}>
        <InfoCircle />
      </Hoverable> */}
      </div>
      <div className="referral-details-container">
        <LabelledValue
          label={
            <Hoverable tooltipStyle={tooltipStyle} tooltipContent="The amount of users who have used your referral link and are earning Loot Bottles.">
              <Text className="helper-label" size="xs">Active Referrals <InfoCircle />
              </Text>
            </Hoverable>
          }
        >
          {activeRefereeReferralsCount}
        </LabelledValue>
        <LabelledValue
          label={
            <Hoverable tooltipStyle={tooltipStyle} tooltipContent="The amount of Loot Bottles you have earned from referring users with your link.">
              <Text className="helper-label" size="xs">Total Bottles earned from your link <InfoCircle />
              </Text>
            </Hoverable>
          }
        >
          {totalBottles}
        </LabelledValue>
      </div>
      <Hoverable tooltipStyle={tooltipStyle} tooltipContent="The amount of Loot Bottles you have earned through your referral link based on their rarity.">
        <Text className="helper-label" size="xs">Bottle Distribution <InfoCircle />
        </Text>
      </Hoverable>
      <BottleDistribution numberPosition="relative" bottles={bottles} />
      <div
        style={{
          width: "100%",
          borderBottom: "1px solid white",
        }}
      />
      <div style={{ display: "flex", gap: "1em", alignItems: "center" }}>
        <Display className="no-margin" size="xxxs">
          Links I&apos;ve Clicked
        </Display>
        <Hoverable tooltipContent={"Lorem ipsum"}>
          <InfoCircle />
        </Hoverable>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto auto auto auto",
          gap: "3em",
          paddingBottom: "1em",
        }}
      >
        <LabelledValue
          label={
            <div
              className="helper-label"
              style={{ display: "flex", gap: "0.5em" }}
            >
              <Text size="xs">Total Clicked</Text>
              <Hoverable style={{ marginTop: -2 }} tooltipContent="Lorem ipsum">
                <InfoCircle />
              </Hoverable>
            </div>
          }
        >
          {activeReferrerReferralsCount + inactiveReferrerReferralsCount}
        </LabelledValue>
        <div>
          <LabelledValue
            label={
              <div
                className="helper-label"
                style={{ display: "flex", gap: "0.5em" }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 100,
                    backgroundColor: "#2af73b",
                    marginTop: 2,
                  }}
                />

                <Text size="xs">Claimed</Text>
                <Hoverable style={{ marginTop: -2 }} tooltipContent="Lorem ipsum">
                  <InfoCircle />
                </Hoverable>
              </div>
            }
          >
            {activeReferrerReferralsCount}
          </LabelledValue>
          <Text size="xs">{activeReferrerReferralsCount * 10} BOTTLES</Text>
        </div>
        <div>
          <LabelledValue
            label={
              <div
                className="helper-label"
                style={{ display: "flex", gap: "0.5em" }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 100,
                    backgroundColor: "red",
                    marginTop: 2,
                  }}
                />
                <Text size="xs">Unclaimed</Text>
                <Hoverable style={{ marginTop: -2 }} tooltipContent="Lorem ipsum">
                  <InfoCircle />
                </Hoverable>
              </div>
            }
          >
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
        <div>
          <LabelledValue
            label={
              <div
                className="helper-label"
                style={{ display: "flex", gap: "0.5em" }}
              >
                <Text size="xs">Until Next Claim</Text>
                <Hoverable style={{ marginTop: -2 }} tooltipContent="Lorem ipsum">
                  <InfoCircle />
                </Hoverable>
              </div>
            }
          >
            {nextInactiveReferral?.progress || 0}/10
          </LabelledValue>
          <ProgressBar
            value={nextInactiveReferral?.progress || 0}
            max={10}
            size="sm"
            color="holo"
            style={{
              marginTop: 6,
            }}
          />
        </div>
      </div>
    </>
  )
};

interface IBottlesDetailsModal {
  bottles: BottleTiers;
}

const BottlesDetailsModal = ({ bottles }: IBottlesDetailsModal) => (
  <>
    <BottleDistribution numberPosition="relative" bottles={bottles} />
    <GeneralButton
      icon={<ArrowRight />}
      layout="after"
      handleClick={() => {
        return;
      }}
      type="transparent"
      style={{
        alignSelf: "center",
      }}
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
    <div className="helper-label" style={{ display: "flex", gap: "0.5em" }}>
      <Text size="sm">Bottles earned since last checked</Text>
      <Hoverable tooltipContent="Lorem ipsum">
        <InfoCircle />
      </Hoverable>
    </div>
    <div>
      {/* TODO POPULATE THIS WITH LOCAL STORAGE STUFF */}
      <LootBottle size="lg" rarity="legendary"></LootBottle>
      <Text prominent size="lg">
        x22
      </Text>
    </div>
  </>
);

interface IStakingStatsModal {
  liqudityMultiplier: number;
  stakes: Array<{ amount: BN; durationDays: number; depositDate: Date }>;
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
          $
          {addDecimalToBn(
            stakes.reduce((sum, { amount }) => sum.add(amount), new BN(0)),
            6
          )}
        </LabelledValue>
      </div>
      <div style={{ position: "relative", border: "1px gray" }}>
        <GeneralButton disabled={true} style={{ right: "0" }}>
          Withdraw
        </GeneralButton>
        <div>
          {stakes.map(({ amount, durationDays, depositDate }, i) => {
            const stakedDays = dayDifference(new Date(), depositDate);
            const multiplier = stakingLiquidityMultiplierEq(
              stakedDays,
              durationDays
            );

            const endDate = new Date(depositDate);
            endDate.setDate(endDate.getDate() + durationDays);

            return (
              <div
                key={`stake-${i}`}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 3fr 1fr",
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
                    {depositDate.toLocaleDateString("en-US")}
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
                  <Heading as="h3">{addDecimalToBn(amount, 6)}</Heading>
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
                    <br />
                    <Text prominent>{durationDays - stakedDays} Days Left</Text>
                  </div>
                </div>
                <div style={{ alignSelf: "flex-end", marginBottom: "-0.2em" }}>
                  <Text>Staked For</Text>
                  <Heading as="h2">{Math.floor(durationDays)}</Heading>
                  <Text>Days</Text>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

interface IStakingNowModal {
  fluidTokens: Array<AugmentedToken>;
  baseTokens: Array<AugmentedToken>;
  stakeTokens?: (
    lockDurationSeconds: BN,
    usdcAmt: BN,
    fusdc: BN,
    wethAmt: BN,
    slippage: BN,
    maxTimestamp: BN
  ) => Promise<StakingDepositsRes | undefined>;
  testStakeTokens?: (
    lockDurationSeconds: BN,
    usdcAmt: BN,
    fusdc: BN,
    wethAmt: BN,
    slippage: BN,
    maxTimestamp: BN
  ) => Promise<StakingDepositsRes | undefined>;
  ratios: StakingRatioRes | null;
  isMobile: boolean
}

type StakingAugmentedToken = AugmentedToken & {
  amount: string;
};

// Staking Multiplier Equation
export const stakingLiquidityMultiplierEq = (
  stakedDays: number,
  totalStakedDays: number
) =>
  Math.max(
    0,
    Math.min(
      1,
      (396 / 11315 - (396 * totalStakedDays) / 4129975) * stakedDays +
      (396 * totalStakedDays) / 133225 -
      31 / 365
    )
  );

const StakeNowModal = ({
  fluidTokens,
  baseTokens,
  stakeTokens,
  testStakeTokens,
  ratios,
  isMobile
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
  const [slippage, setSlippage] = useState(5);
  const [stakeErr, setStakeErr] = useState("");

  const minDurationDays = 31;
  const maxDurationDays = 365;

  const endDate = new Date();
  endDate.setDate(endDate.getDate() + stakingDuration);

  const daysToSeconds = (days: number) => days * 24 * 60 * 60;

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

  const [canStake, setCanStake] = useState(false);

  useEffect(() => {
    (async () => {
      setCanStake(await testStake());
    })();
  }, [baseToken, fluidToken, slippage]);

  const testStake = async (): Promise<boolean> => {
    try {
      await testStakeTokens?.(
        new BN(daysToSeconds(stakingDuration)),
        baseToken.symbol === "USDC"
          ? snapToValidValue(baseToken.amount, baseToken)
          : new BN(0),
        fluidToken.symbol === "fUSDC"
          ? snapToValidValue(fluidToken.amount, fluidToken)
          : new BN(0),
        baseToken.symbol === "wETH"
          ? snapToValidValue(baseToken.amount, baseToken)
          : new BN(0),
        new BN(slippage),
        new BN(Math.floor(new Date().getMilliseconds() / 1000) + 30 * 60) // 30 Minutes after now
      );

      setStakeErr("");
      return true;
    } catch (e) {
      // Expect error on fail
      const errMsgMatchReason = /reason="[a-z :_]+/i;
      const stakingError = (e as { message: string }).message
        .match(errMsgMatchReason)?.[0]
        .slice(8);

      if (stakingError) {
        setStakeErr(stakingError);
      }
      return false;
    }
  };

  const handleStake = async () => {
    if (!stakeTokens) return;
    if (!canStake) return;

    try {
      await stakeTokens(
        new BN(daysToSeconds(stakingDuration)),
        baseToken.symbol === "USDC"
          ? snapToValidValue(baseToken.amount, baseToken)
          : new BN(0),
        fluidToken.symbol === "fUSDC"
          ? snapToValidValue(fluidToken.amount, fluidToken)
          : new BN(0),
        baseToken.symbol === "wETH"
          ? snapToValidValue(baseToken.amount, baseToken)
          : new BN(0),
        new BN(slippage),
        new BN(Math.floor(new Date().getMilliseconds() / 1000) + 30 * 60) // 30 Minutes after now
      );
    } catch (e) {
      // Expect error on fail
      console.log(e);
      return;
    }
  };

  const [showTokenSelector, setShowTokenSelector] = useState<
    "fluid" | "base" | ""
  >("");

  const tooltipStyle = isMobile ? "frosted" : "solid"

  return (
    <>
      <Card
        type="opaque"
        rounded
        color="holo"
        fill
        style={{
          textAlign: "center",
          marginTop: "1em",
          padding: "0.5em",
          borderRadius: "0.5em",
        }}
      >
        <Text style={{ color: "black" }} size="sm">
          👀 TIP: Stake over 31 days for more rewards in future epochs & events!
          🌊
        </Text>
      </Card>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto auto 160px",
          columnGap: "4em",
          rowGap: "2em",
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
            <Hoverable tooltipStyle={tooltipStyle} tooltipContent="How many fUSDC/USDC or fUSDC/wETH you want to stake.">
              <Text prominent code className="helper-label">
                STAKE AMOUNT <InfoCircle />
              </Text>
            </Hoverable>
            <GeneralButton
              type="transparent"
              size="small"
              handleClick={() => inputMaxBalance()}
              style={{
                padding: "0.5em 1em",
                borderRadius: "100px",
              }}
            >
              <Text size="sm">MAX</Text>
            </GeneralButton>
          </div>
          {showTokenSelector === "fluid" ? (
            <div className="staking-modal-token-selector">
              {fluidTokens.map((token) => (
                <button
                  style={{ background: "none", border: "none" }}
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
                </button>
              ))}
            </div>
          ) : (
            <div className={"staking-modal-input-container"}>
              <div
                onClick={() => setShowTokenSelector("fluid")}
                style={{ height: 60 }}
              >
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
          <Text>
            {fluidToken.symbol} Balance:{" "}
            {addDecimalToBn(fluidToken.userTokenBalance, fluidToken.decimals)}
          </Text>
          {showTokenSelector === "base" ? (
            <div className="staking-modal-token-selector">
              {baseTokens.map((token) => (
                <button
                  style={{ background: "none", border: "none" }}
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
                </button>
              ))}
            </div>
          ) : (
            <div className={"staking-modal-input-container"}>
              <div
                onClick={() => setShowTokenSelector("base")}
                style={{ height: 60 }}
              >
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
          <Text>
            {baseToken.symbol} Balance:{" "}
            {addDecimalToBn(baseToken.userTokenBalance, baseToken.decimals)}
          </Text>
          <Text prominent>
            {fluidToken.symbol}/{baseToken.symbol} ratio:{" "}
            {ratios?.fusdcUsdcRatio.toString()}
          </Text>
        </div>
        {/* Arrow */}
        <div className="staking-modal-arrow-container">
          <ArrowRight />
        </div>
        {/* Duration */}
        <div className="duration-column">
          <Hoverable tooltipStyle={tooltipStyle} tooltipContent="The duration for how long you want to stake your liquidity, ranging from a minimum of 31 days to a maximum of 365 days.">
            <Text prominent code className="helper-label">
              DURATION <InfoCircle />
            </Text>
          </Hoverable>
          <Display className="no-margin">
            {stakingDuration} D{/* Scrollbar */}
          </Display>
          <Form.Slider
            min={minDurationDays}
            max={maxDurationDays}
            step={1}
            valueCallback={(value: number) => setStakingDuration(value)}
          />
          <Hoverable tooltipStyle={tooltipStyle} tooltipContent="The end date of staking, when you can reclaim your provided liquidity.">
            <Text code className="helper-label">
              END: <Text prominent>{endDate.toLocaleDateString("en-US")}</Text>{" "}
              <InfoCircle />
            </Text>
          </Hoverable>
          <div>
            <Text prominent code>
              SLIPPAGE % <InfoCircle />
              <input
                type="number"
                pattern="[0-9]"
                min={1}
                value={slippage}
                max={50}
                step="1"
                onChange={(e) =>
                  setSlippage(Math.floor(e.target.valueAsNumber))
                }
              />
            </Text>
          </div>
        </div>
        <div
          style={{
            width: "100%",
            borderBottom: "1px solid white",
            gridColumn: "1 / span 3",
          }}
        />
        <div className="power-column">
          <Hoverable tooltipStyle={tooltipStyle} tooltipContent="The lootbox multiplier you will receive on the first day after staking your liquidity. It will increase linearly until the end of the epoch. The longer you lock, the higher your multiplier will be on day 1.">
            <Text size="xs" code className="helper-label">
              DAY 1 POWER <InfoCircle />
            </Text>
          </Hoverable>
          <Text
            prominent
            holo={stakingDuration === maxDurationDays}
            size="xxl"
            className="power-text"
          >
            {toSignificantDecimals(
              stakingLiquidityMultiplierEq(1, stakingDuration),
              1
            )}
          </Text>
          {stakingLiquidityMultiplierEq(1, stakingDuration) < 1 ? (
            <Text size="xs" prominent code>
              @ MULTIPLIER{" "}
              {toSignificantDecimals(
                stakingLiquidityMultiplierEq(1, stakingDuration)
              )}
              X
            </Text>
          ) : (
            <Card
              type="opaque"
              color="holo"
              style={{ padding: "4px 8px 4px 8px", borderRadius: 4 }}
            >
              <Text size="xs" style={{ color: "black" }}>
                @ MULTIPLIER 1X
              </Text>
            </Card>
          )}
        </div>
        <div className="staking-modal-arrow-container">
          <ArrowRight />
        </div>
        <div className="power-column rhs">
          <Hoverable tooltipStyle={tooltipStyle} tooltipContent="The maximum multiplier you will receive from staking at the end of the epoch. The longer you lock, the faster you will receive this multiplier.">
            <Text size="xs" className="helper-label" code>
              DAY 31 POWER <InfoCircle />
            </Text>
          </Hoverable>
          <Text prominent holo size="xl" className="power-text">
            {toSignificantDecimals(
              stakingLiquidityMultiplierEq(31, stakingDuration),
              1
            )}
          </Text>
          <Card
            type="opaque"
            color="holo"
            style={{
              padding: "4px 8px 4px 8px",
              borderRadius: 4,
              whiteSpace: "nowrap",
            }}
          >
            <Text size="xs" style={{ color: "black" }}>
              @ MULTIPLIER{" "}
              {toSignificantDecimals(
                stakingLiquidityMultiplierEq(31, stakingDuration)
              )}
              X
            </Text>
          </Card>
        </div>
      </div>
      <GeneralButton
        type="secondary"
        disabled={!canStake}
        style={{ width: "95%" }}
        handleClick={() => handleStake()}
      >
        Stake
      </GeneralButton>
      <Text
        style={{
          textAlign: "center",
          display: stakeErr ? "false" : "",
          color: "red",
          textTransform: "capitalize",
        }}
      >
        {stakeErr}
      </Text>
    </>
  );
};

type TutorialSlide = {
  title: string;
  desc: React.ReactNode;
  image: string;
};

const tutorialContent: {
  [key: number]: TutorialSlide;
} = {
  "0": {
    title: "WHAT ARE LOOT BOTTLES?",
    desc: "Welcome to the Fluidity Airdrop! Use Fluid Assets and earn Loot Bottles. Loot Bottles contain $FLUID tokens. They have different rarities, from common to legendary. The higher the rarity, the more $FLUID tokens it contains. ",
    image: "WHAT_ARE_LOOT_BOTTLES",
  },
  "1": {
    title: "HOW TO EARN LOOT BOTTLES?",
    desc: "To participate in the airdrop, all you need to do is Fluidify your tokens and start transacting with them. The more Fluid Transactions you perform, the more Loot Bottles you get and the higher your chances of receiving rarer Loot Bottles. ",
    image: "HOW_TO_EARN",
  },
  "2": {
    title: "MULTIPLIERS",
    desc: (
      <>
        <Text size="md">
          You can increase your chances of receiving Loot Bottles by doing the
          following:
        </Text>
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
            <Display style={{ margin: 0, textAlign: "right" }} size="xs">
              6x
            </Display>
          </Text>
          <Text size="md" holo>
            Transacting fAssets using our Boosted Protocols
          </Text>
          <LootBottle
            size="sm"
            style={{ width: 40, height: 40 }}
            rarity="rare"
            quantity={100}
          />
          <Text prominent size="md">
            Staking liquidity for the maximum time
          </Text>
          <LootBottle
            size="sm"
            style={{ width: 40, height: 40 }}
            rarity="legendary"
            quantity={10}
          />
          <Text size="md" prominent>
            Contributing volume
          </Text>
          <LootBottle
            size="sm"
            style={{ width: 40, height: 40 }}
            rarity="ultra_rare"
            quantity={10}
          />
          <Text size="md" prominent>
            Participating in the Testnet
          </Text>
        </div>
      </>
    ),
    image: "MULTIPLIER",
  },
  "3": {
    title: "REFERRALS",
    desc: "You can generate your own referral link and invite your friends to try out Fluidity! In exchange you will receive 10% of their airdrop earnings throughout the entire epoch. Your friend will receive 10 Loot Bottles after performing certain actions. ",
    image: "REFERRALS",
  },
  "4": {
    title: "LEARN MORE",
    desc: "To learn more about the Airdrop and Fluidity, check out the Airdrop announcement post.",
    image: "AIRDROP_DEEP_DIVE",
  },
};

const TutorialModal = ({ isMobile, closeModal }: { isMobile?: boolean, closeModal?: () => void }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={`tutorial-slide-${currentSlide}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
          className={"tutorial-slide-container"}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
            maxWidth: isMobile ? 550 : 635,
            gap: "1em",
            marginTop: '1em'
          }}
        >
          <Video
            type="cover"
            width={isMobile ? 550 : 635}
            height={isMobile ? 550 : 230}
            loop
            src={`/videos/airdrop/${isMobile ? `MOBILE` : `DESKTOP`}_-_${tutorialContent[currentSlide].image
              }.mp4`}
            className="tutorial-image"
          />
          <Display size="xxs" style={{ margin: 0 }}>
            {tutorialContent[currentSlide].title}
          </Display>
          {tutorialContent[currentSlide].desc}
        </motion.div>
      </AnimatePresence>

      <div
        className="tutorial-nav"
      >
        <GeneralButton
          icon={<ArrowLeft />}
          layout="before"
          handleClick={() => {
            setCurrentSlide(currentSlide - 1);
          }}
          type="transparent"
          disabled={currentSlide === 0}
        >
          PREV
        </GeneralButton>
        <div className="tutorial-nav-status">
          <Text size="md">
            {currentSlide + 1} / 5
          </Text>
        </div>
        {
          currentSlide !== 4 ? (
            <GeneralButton
              icon={<ArrowRight />}
              layout="after"
              handleClick={() => {
                setCurrentSlide(currentSlide + 1);
              }}
              type="transparent"
              disabled={currentSlide === 4}
            >
              Next
            </GeneralButton>
          ) : !isMobile && (
            <GeneralButton
              type="primary"
              handleClick={closeModal}
              className="start-earning-button"
            >
              START EARNING
            </GeneralButton>
          )
        }
      </div>
    </>
  );
};

export {
  BottleDistribution,
  TutorialModal,
  StakeNowModal,
  StakingStatsModal,
  BottlesDetailsModal,
  ReferralDetailsModal,
};
