import type {
  StakingRatioRes,
  StakingDepositsRes,
} from "~/util/chainUtils/ethereum/transaction";
import { useState, useEffect, useContext, useMemo } from "react";
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
  numberToMonetaryString,
  SliderButton,
  LinkVerticalIcon,
} from "@fluidity-money/surfing";
import AugmentedToken from "~/types/AugmentedToken";
import {
  addDecimalToBn,
  getTokenAmountFromUsd,
  getUsdFromTokenAmount,
} from "~/util/chainUtils/tokens";
import { dayDifference } from ".";

import { Referral } from "~/queries";
import { BottleTiers } from "../../query/dashboard/airdrop";
import { AnimatePresence, motion } from "framer-motion";
import { TransactionResponse } from "~/util/chainUtils/instructions";
import FluidityFacadeContext from "contexts/FluidityFacade";
import { CopyGroup } from "~/components/ReferralModal";

const MAX_EPOCH_DAYS = 31;

const MIN_STAKING_DAYS = 31;
const MAX_STAKING_DAYS = 365;

interface IBottleDistribution extends React.HTMLAttributes<HTMLDivElement> {
  bottles: BottleTiers;
  showBottleNumbers?: boolean;
  highlightBottleNumberIndex?: number;
  numberPosition?: "absolute" | "relative";
  handleClickBottle?: (index: number) => void;
}

const BottleDistribution = ({
  bottles,
  showBottleNumbers = true,
  highlightBottleNumberIndex,
  numberPosition = "absolute",
  handleClickBottle,
  ...props
}: IBottleDistribution) => (
  <div className="bottle-distribution-container" {...props}>
    {Object.entries(bottles).map(([rarity, quantity], index) => {
      const highlightBottle =
        highlightBottleNumberIndex === undefined ||
        highlightBottleNumberIndex === index;

      return (
        <div
          key={index}
          className="lootbottle-container"
          onClick={() => handleClickBottle?.(index)}
        >
          <LootBottle
            size="lg"
            rarity={rarity}
            quantity={quantity}
            style={{
              marginBottom: "0.6em",
              opacity: !highlightBottle ? 0.2 : 1,
              ...(handleClickBottle ? { cursor: "pointer" } : {}),
            }}
          />
          <Text
            size="sm"
            style={{ whiteSpace: "nowrap", textTransform: "capitalize" }}
          >
            {rarity.replace("_", " ")}
          </Text>
          <Text
            prominent={highlightBottle}
            style={
              numberPosition === "absolute"
                ? {
                    position: "absolute",
                    bottom: "100px",
                    zIndex: "5",
                    ...(showBottleNumbers
                      ? highlightBottle
                        ? {
                            fontSize: "2.5em",
                          }
                        : {}
                      : highlightBottle
                      ? { fontSize: "2.5em" }
                      : { display: "none" }),
                  }
                : { fontSize: "1em" }
            }
          >
            {Math.round(quantity * 100) / 100}
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
  isMobile?: boolean;
  tooltipStyle?: "solid" | "frosted";
  showCopyGroup?: boolean;
  referralCode?: string;
}

const BottleSection = ({
  tooltipStyle,
  activeRefereeReferralsCount,
  totalBottles,
}: Partial<IReferralDetailsModal>) => (
  <div className="referral-details-container">
    <LabelledValue
      label={
        <Hoverable
          style={{ minWidth: 250 }}
          tooltipStyle={tooltipStyle}
          tooltipContent="The amount of users who have used your referral link and are earning Loot Bottles."
        >
          <Text className="helper-label" size="xs">
            Active Referrals <InfoCircle />
          </Text>
        </Hoverable>
      }
    >
      {activeRefereeReferralsCount}
    </LabelledValue>
    <LabelledValue
      label={
        <Hoverable
          style={{ minWidth: 250 }}
          tooltipStyle={tooltipStyle}
          tooltipContent="The amount of Loot Bottles you have earned from referring users with your link."
        >
          <Text className="helper-label" size="xs">
            Total Bottles earned from your link <InfoCircle />
          </Text>
        </Hoverable>
      }
    >
      {Math.round((totalBottles || 0) * 100) / 100}
    </LabelledValue>
  </div>
);

const ReferralDetailsModal = ({
  bottles,
  totalBottles,
  activeRefereeReferralsCount,
  inactiveReferrerReferralsCount,
  nextInactiveReferral,
  isMobile,
  referralCode,
  showCopyGroup = false,
}: IReferralDetailsModal) => {
  const tooltipStyle = isMobile ? "frosted" : "solid";

  return (
    <>
      {!isMobile && (
        <Display className="no-margin" size="xxxs">
          My Referral Link
        </Display>
      )}
      <BottleSection
        totalBottles={totalBottles}
        activeRefereeReferralsCount={activeRefereeReferralsCount}
        tooltipStyle={tooltipStyle}
      />
      {showCopyGroup && referralCode && (
        <CopyGroup referralCode={referralCode} />
      )}
      <Hoverable
        style={{ minWidth: 250 }}
        tooltipStyle={tooltipStyle}
        tooltipContent="The amount of Loot Bottles you have earned through your referral link based on their rarity."
      >
        <Text className="helper-label" size="xs">
          Bottle Distribution <InfoCircle />
        </Text>
      </Hoverable>
      <BottleDistribution
        numberPosition="relative"
        bottles={bottles}
        style={isMobile ? { overflowX: "scroll" } : {}}
      />
      <div
        style={{
          width: "100%",
          borderBottom: "1px solid grey",
        }}
      />
      <Display className={isMobile ? "" : "no-margin"} size="xxxs">
        Links I&apos;ve Clicked
      </Display>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr 1fr" : "auto auto auto auto",
          gap: isMobile ? "1em" : "3em",
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
            </div>
          }
        >
          {activeRefereeReferralsCount + inactiveReferrerReferralsCount}
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
                <Hoverable
                  style={{ minWidth: 250 }}
                  tooltipStyle={tooltipStyle}
                  tooltipContent="Number of referrals (and Loot Bottles!) you've claimed."
                >
                  <InfoCircle />
                </Hoverable>
              </div>
            }
          >
            {activeRefereeReferralsCount}
          </LabelledValue>
          <Text size="xs">{activeRefereeReferralsCount * 5} BOTTLES</Text>
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
                <Hoverable
                  style={{ minWidth: 250 }}
                  tooltipStyle={tooltipStyle}
                  tooltipContent="Number of referrals you have left to claim."
                >
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
                <Hoverable
                  style={{ minWidth: 250 }}
                  tooltipStyle={tooltipStyle}
                  tooltipContent="Number of Loot Bottles to earn before the next referral activates."
                >
                  <InfoCircle />
                </Hoverable>
              </div>
            }
          >
            {toSignificantDecimals(nextInactiveReferral?.progress || 0, 2)}/10
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
  );
};

interface IBottlesDetailsModal {
  bottles: BottleTiers;
  isMobile?: boolean;
  network: string;
  navigate: (path: string) => void;
}

const BottlesDetailsModal = ({
  navigate,
  network,
  bottles,
}: IBottlesDetailsModal) => (
  <>
    <BottleDistribution numberPosition="relative" bottles={bottles} />
    <GeneralButton
      icon={<ArrowRight />}
      layout="after"
      handleClick={() => {
        navigate(`/${network}/dashboard/rewards`);
      }}
      type="transparent"
      style={{
        alignSelf: "center",
      }}
    >
      SEE YOUR LOOTBOTTLE TX HISTORY
    </GeneralButton>
  </>
);

interface IStakingStatsModal {
  liqudityMultiplier: number;
  stakes: Array<{
    fluidAmount: BN;
    baseAmount: BN;
    durationDays: number;
    depositDate: Date;
  }>;
  wethPrice: number;
  usdcPrice: number;
}

const StakingStatsModal = ({
  stakes,
  wethPrice,
  usdcPrice,
}: IStakingStatsModal) => {
  const augmentedStakes = stakes.map((stake) => {
    const { fluidAmount, baseAmount, durationDays, depositDate } = stake;

    const stakedDays = dayDifference(new Date(), new Date(depositDate));
    const multiplier = stakingLiquidityMultiplierEq(stakedDays, durationDays);

    const fluidDecimals = 6;
    const fluidUsd = getUsdFromTokenAmount(
      fluidAmount,
      fluidDecimals,
      usdcPrice
    );

    const wethDecimals = 18;
    const usdcDecimals = 6;

    // If converting base amount by weth decimals (18) is smaller than $0.01,
    // then tentatively assume Token amount is USDC
    // A false hit would be a USDC deposit >= $100,000
    const baseUsd =
      getUsdFromTokenAmount(baseAmount, wethDecimals, wethPrice) < 0.01
        ? getUsdFromTokenAmount(baseAmount, usdcDecimals, usdcPrice)
        : getUsdFromTokenAmount(baseAmount, wethDecimals, wethPrice);

    return {
      stake,
      stakedDays,
      multiplier,
      fluidUsd,
      baseUsd,
    };
  });

  const canWithdraw = augmentedStakes.some(({ stake, stakedDays }) => {
    return stake.durationDays - stakedDays <= 0;
  });

  const sumLiquidityMultiplier = augmentedStakes.reduce(
    (sum, { multiplier, fluidUsd, baseUsd }) => {
      return sum + (fluidUsd + baseUsd) * multiplier;
    },
    0
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1em",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto auto auto",
          gap: "2em",
        }}
      >
        <LabelledValue
          label={<Text size="sm">Total Liquidity Multiplier</Text>}
        >
          <Text holo>{toSignificantDecimals(sumLiquidityMultiplier, 1)}x</Text>
        </LabelledValue>
        <LabelledValue label={<Text size="sm">My Stakes</Text>}>
          {stakes.length}
        </LabelledValue>
        <LabelledValue label={<Text size="sm">Total Amount Staked</Text>}>
          {numberToMonetaryString(
            augmentedStakes.reduce((sum, { fluidUsd, baseUsd }) => {
              return sum + fluidUsd + baseUsd;
            }, 0)
          )}
        </LabelledValue>
      </div>
      <div
        style={{
          position: "relative",
          border: "1px gray",
          width: "100%",
        }}
      >
        <GeneralButton disabled={!canWithdraw} style={{ right: "0" }}>
          Withdraw
        </GeneralButton>
        <div
          style={{
            paddingTop: "1em",
            overflowY: "scroll",
            overflowX: "hidden",
            maxHeight: "50vh",
          }}
        >
          {augmentedStakes.map(
            ({ stake, stakedDays, fluidUsd, baseUsd, multiplier }, i) => {
              const { durationDays, depositDate } = stake;

              const endDate = new Date(depositDate);
              endDate.setDate(endDate.getDate() + durationDays);

              return (
                <>
                  <div
                    key={`stake-${i}`}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 3fr 1fr",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "1em",
                    }}
                  >
                    {/* Dates */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5em",
                      }}
                    >
                      <Text>Start Date</Text>
                      <Text prominent>
                        {depositDate.toLocaleDateString("en-US")}
                      </Text>

                      <Text>End Date</Text>
                      <Text prominent>
                        {endDate.toLocaleDateString("en-US")}
                      </Text>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: "0.5em",
                      }}
                    >
                      <Heading as="h3" style={{ margin: "0.5em 0 0.5em 0" }}>
                        {numberToMonetaryString(fluidUsd + baseUsd)}
                      </Heading>
                      <ProgressBar
                        value={multiplier}
                        max={1}
                        rounded
                        color={multiplier === 1 ? "holo" : "gray"}
                        size="sm"
                      />
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          flexWrap: "wrap",
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text prominent>
                          {toSignificantDecimals(multiplier, 1)}x Multiplier
                        </Text>
                        <Text prominent>
                          {Math.max(0, Math.floor(durationDays - stakedDays))}{" "}
                          Days Left
                        </Text>
                      </div>
                    </div>
                    <div
                      style={{ alignSelf: "flex-end", marginBottom: "-0.2em" }}
                    >
                      <Text>Staked For</Text>
                      <Heading as="h2" style={{ margin: "0.5em 0 0.5em 0" }}>
                        {Math.floor(durationDays)}
                      </Heading>
                      <Text>Days</Text>
                    </div>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      border: "1px solid gray",
                      margin: "1em 0 1em 0",
                    }}
                  />
                </>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
};

interface IStakingNowModal {
  fluidTokens: Array<AugmentedToken>;
  baseTokens: Array<AugmentedToken>;
  // getRatios calls `deposit()` in Staking Contract
  // May return undefined if contract errors, or signer not found
  stakeTokens?: (
    lockDurationSeconds: BN,
    usdcAmt: BN,
    fusdc: BN,
    wethAmt: BN,
    slippage: BN,
    maxTimestamp: BN
  ) => Promise<TransactionResponse | undefined>;

  // getRatios simulates `deposit()` in Staking Contract
  // Used to determine if current inputs will succeed
  // May return undefined if contract errors, or signer not found
  testStakeTokens?: (
    lockDurationSeconds: BN,
    usdcAmt: BN,
    fusdc: BN,
    wethAmt: BN,
    slippage: BN,
    maxTimestamp: BN
  ) => Promise<StakingDepositsRes | undefined>;

  // getRatios calls `ratios()` in Staking Contract
  // Used to estimate accepted Base / Fluid token amounts
  // May return undefined if contract errors, or signer not found
  getRatios?: () => Promise<StakingRatioRes | undefined>;
  isMobile: boolean;
  wethPrice: number;
  usdcPrice: number;
  stakeCallback: () => void;
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
  getRatios,
  isMobile,
  wethPrice,
  usdcPrice,
  stakeCallback,
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

  // tokenRatios is the proportion of base tokens in the pool,
  // and maximum base token spread, to the factor of 12
  const [tokenRatios, setTokenRatios] = useState<StakingRatioRes | null>(null);

  // Force recommended token ratio
  const [lockRatio, setLockRatio] = useState(true);

  // Convert proportion of Base Tokens in Pool to Fluid:Base Token ratio
  // `prop` = base / (base + fluid)
  const calculateRatioFromProportion = (baseTokenProp: number) => {
    // `prop` * fluid == (1 - `prop`) * base
    const baseTokenRatio = 1 - baseTokenProp;

    // 1 fluid == ((1 - `prop`) / `prop`) * base
    const baseMultiplier = baseTokenRatio / baseTokenProp;

    return baseMultiplier;
  };

  // tokenRatios has factor of 12 in contract to avoid decimals
  const ratio = !tokenRatios
    ? 0
    : calculateRatioFromProportion(
        baseToken.symbol === "USDC"
          ? (tokenRatios.fusdcUsdcRatio.toNumber() -
              tokenRatios.fusdcUsdcSpread.toNumber() / 2) /
              1e12
          : (tokenRatios.fusdcWethRatio.toNumber() -
              tokenRatios.fusdcWethSpread.toNumber() / 2) /
              1e12
      );

  const fluidUsdMultiplier = usdcPrice;
  const baseUsdMultiplier = baseToken.symbol === "USDC" ? usdcPrice : wethPrice;

  useEffect(() => {
    const setRatio = async () => {
      const stakingRatios = (await getRatios?.()) ?? null;
      setTokenRatios(stakingRatios);
    };

    // Call `getRatios` immediately, then call every 10 seconds
    setRatio();
    const setRatioId = setInterval(setRatio, 10 * 1000);

    return () => {
      clearInterval(setRatioId);
    };
  }, []);

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
      setInput: (token: StakingAugmentedToken) => void,
      otherToken: StakingAugmentedToken,
      setOtherInput: (token: StakingAugmentedToken) => void,
      conversionRatio: number
    ): React.ChangeEventHandler<HTMLInputElement> =>
    (e) => {
      const numericChars = e.target.value.replace(/[^0-9.]+/, "");

      const [whole, dec] = numericChars.split(".");

      const tokenAmtStr =
        dec !== undefined
          ? [whole, dec.slice(0 - token.decimals)].join(".")
          : whole ?? "0";

      setInput({
        ...token,
        amount: tokenAmtStr,
      });

      if (!lockRatio) return;
      if (!tokenAmtStr) return;

      const otherTokenAmt = parseFloat(tokenAmtStr) * conversionRatio;

      setOtherInput({
        ...otherToken,
        amount: otherTokenAmt.toFixed(otherToken.decimals).replace(/\.0+$/, ""),
      });
    };

  const fluidTokenAmount = useMemo(
    () => parseSwapInputToTokenAmount(fluidToken.amount, fluidToken),
    [fluidToken]
  );

  const baseTokenAmount = useMemo(
    () => parseSwapInputToTokenAmount(baseToken.amount, baseToken),
    [baseToken]
  );

  const inputMaxBalance = () => {
    const maxFluidToken = snapToValidValue(
      fluidToken.userTokenBalance.toString(),
      fluidToken
    );

    const maxBaseToken = snapToValidValue(
      baseToken.userTokenBalance.toString(),
      baseToken
    );

    const matchingBaseTokenUsd =
      getUsdFromTokenAmount(maxFluidToken, fluidToken.decimals, usdcPrice) *
      ratio;

    const maxBaseTokenUsd = getUsdFromTokenAmount(
      maxBaseToken,
      baseToken.decimals,
      baseUsdMultiplier
    );

    // Enough Base tokens to match Max Fluid balance
    if (maxBaseTokenUsd >= matchingBaseTokenUsd) {
      setFluidToken({
        ...fluidToken,
        amount: addDecimalToBn(maxFluidToken, fluidToken.decimals),
      });

      setBaseToken({
        ...baseToken,
        amount: (matchingBaseTokenUsd / baseUsdMultiplier)
          .toFixed(baseToken.decimals)
          .replace(/\.0+$/, ""),
      });

      return;
    }

    const matchingFluidTokenUsd = maxBaseTokenUsd * (1 / ratio);

    setBaseToken({
      ...baseToken,
      amount: addDecimalToBn(maxBaseToken, baseToken.decimals),
    });

    setFluidToken({
      ...fluidToken,
      amount: (matchingFluidTokenUsd / fluidUsdMultiplier)
        .toFixed(fluidToken.decimals)
        .replace(/\.0+$/, ""),
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
      if (!(fluidToken.amount && fluidToken.amount)) {
        throw Error('reason="not enough liquidity"');
      }

      if (fluidTokenAmount.gt(fluidToken.userTokenBalance)) {
        throw Error('reason="Insufficient Fluid Funds"');
      }

      if (baseTokenAmount.gt(baseToken.userTokenBalance)) {
        throw Error('reason="Insufficient Base Funds"');
      }

      const res = await testStakeTokens?.(
        new BN(daysToSeconds(stakingDuration)),
        baseToken.symbol === "USDC" ? baseTokenAmount : new BN(0),
        fluidToken.symbol === "fUSDC" ? fluidTokenAmount : new BN(0),
        baseToken.symbol === "wETH" ? baseTokenAmount : new BN(0),
        new BN(slippage),
        new BN(Math.floor(new Date().valueOf() / 1000) + 30 * 60) // 30 Minutes after now
      );

      if (!res) return false;

      setStakeErr("");
      return true;
    } catch (e) {
      // Expect error on fail
      const errMsgMatchReason = /reason="[a-z0-9 :_]+/i;
      const stakingError = (e as { message: string }).message
        .match(errMsgMatchReason)?.[0]
        .slice(8);

      switch (stakingError) {
        case "not enough liquidity": {
          setStakeErr("");
          return false;
        }
        case "insufficient allowance":
        case "ERC20: transfer amount exceeds allowance": {
          setStakeErr("");
          return true;
        }
        case "CamelotRouter: INSUFFICIENT_A_AMOUNT": {
          setStakeErr(
            "Insufficient Base Tokens - Increase Slippage or Set Custom Amount"
          );
          return false;
        }
        case "CamelotRouter: INSUFFICIENT_B_AMOUNT": {
          setStakeErr(
            "Insufficient Fluid Tokens - Increase Slippage or Set Custom Amount"
          );
          return false;
        }
        default: {
          setStakeErr(stakingError ?? "Unknown Error - Try again later");
          return false;
        }
      }
    }
  };

  const handleStake = async () => {
    if (!stakeTokens) return;
    if (!canStake) return;

    setStakingState("staking");

    try {
      const receipt = await stakeTokens(
        new BN(daysToSeconds(stakingDuration)),
        baseToken.symbol === "USDC" ? baseTokenAmount : new BN(0),
        fluidToken.symbol === "fUSDC" ? fluidTokenAmount : new BN(0),
        baseToken.symbol === "wETH" ? baseTokenAmount : new BN(0),
        new BN(slippage),
        new BN(Math.floor(new Date().valueOf() / 1000) + 30 * 60) // 30 Minutes after now
      );

      if (receipt) {
        const success = await receipt.confirmTx();

        if (!success) {
          throw Error("Failed to Deposit - Try again later!");
        }

        setStakingState("complete");
      }

      stakeCallback();
    } catch (e) {
      setStakeErr(
        typeof e === "object" ? "User Rejected Transaction" : (e as string)
      );
      setStakingState("ready");
    }
  };

  const [showTokenSelector, setShowTokenSelector] = useState<
    "fluid" | "base" | ""
  >("base");

  const tooltipStyle = isMobile ? "frosted" : "solid";

  const [stakingState, setStakingState] = useState<
    "ready" | "staking" | "complete"
  >("ready");
  const buttonText = (() => {
    switch (stakingState) {
      case "staking":
        return "PROCESSING...";
      case "complete":
        return "SUCCESS! - STAKE MORE?";
      case "ready":
      default:
        return "SLIDE TO STAKE";
    }
  })();

  return (
    <>
      {!isMobile && (
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
            👀 TIP: Stake over 31 days for more rewards in future epochs &
            events! 🌊
          </Text>
        </Card>
      )}
      <div
        className={`airdrop-stake-container ${
          isMobile ? "airdrop-mobile" : ""
        }`}
      >
        {/* Staking Amount */}
        <div
          className="airdrop-stake-inputs-column"
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
              gap: "1em",
            }}
          >
            <Hoverable
              style={{ minWidth: 250 }}
              tooltipStyle={tooltipStyle}
              tooltipContent="How many fUSDC/USDC or fUSDC/wETH you want to stake."
            >
              <Text prominent={!isMobile} code className="helper-label">
                STAKE AMOUNT <InfoCircle />
              </Text>
            </Hoverable>
            <div className="airdrop-stake-buttons">
              <Hoverable
                style={{ minWidth: 200 }}
                tooltipStyle={tooltipStyle}
                tooltipContent="Enforce recommended token ratio."
              >
                <GeneralButton
                  type={lockRatio ? "primary" : "transparent"}
                  size="small"
                  handleClick={() => setLockRatio(!lockRatio)}
                  style={{
                    width: "2px",
                    padding: "0.5em 0.5em",
                  }}
                  icon={<LinkVerticalIcon />}
                ></GeneralButton>
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
            <div
              className={"staking-modal-input-container"}
              style={{
                position: "relative",
                borderColor: fluidTokenAmount.gt(fluidToken.userTokenBalance)
                  ? "red"
                  : "inherit",
              }}
            >
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
                onChange={handleChangeStakingInput(
                  fluidToken,
                  setFluidToken,
                  baseToken,
                  setBaseToken,
                  ratio
                )}
                placeholder="0"
                step="any"
              />
              <div
                className="staking-modal-token-insufficient"
                style={{
                  display: fluidTokenAmount.gt(fluidToken.userTokenBalance)
                    ? "flex"
                    : "none",
                }}
              >
                <Text prominent size="xxs">
                  INSUFFICIENT FUNDS
                </Text>
              </div>
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
            <div
              className={"staking-modal-input-container"}
              style={{
                position: "relative",
                borderColor: baseTokenAmount.gt(baseToken.userTokenBalance)
                  ? "red"
                  : "inherit",
              }}
            >
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
                onChange={handleChangeStakingInput(
                  baseToken,
                  setBaseToken,
                  fluidToken,
                  setFluidToken,
                  1 / ratio
                )}
                placeholder="0"
                step="any"
              />
              <div
                className="staking-modal-token-insufficient"
                style={{
                  display: baseTokenAmount.gt(baseToken.userTokenBalance)
                    ? "flex"
                    : "none",
                }}
              >
                <Text prominent size="xxs">
                  INSUFFICIENT FUNDS
                </Text>
              </div>
            </div>
          )}
          <Text>
            {baseToken.symbol} Balance:{" "}
            {addDecimalToBn(baseToken.userTokenBalance, baseToken.decimals)}
          </Text>
          <Text prominent>
            {fluidToken.symbol}/{baseToken.symbol} ratio:{" "}
            {ratio ? `1 : ${toSignificantDecimals(ratio, 2)}` : "Loading..."}
          </Text>
        </div>
        {/* Arrow */}
        {!isMobile && (
          <div className="staking-modal-arrow-container">
            <ArrowRight />
          </div>
        )}
        {/* Duration */}
        <div className="duration-column">
          <div className="duration-col-header">
            <Hoverable
              style={{ minWidth: 250 }}
              tooltipStyle={tooltipStyle}
              tooltipContent="The duration for how long you want to stake your liquidity, ranging from a minimum of 31 days to a maximum of 365 days."
            >
              <Text prominent={!isMobile} code className="helper-label">
                DURATION <InfoCircle />
              </Text>
            </Hoverable>
            {isMobile && (
              <Hoverable
                style={{ minWidth: 250 }}
                tooltipStyle={tooltipStyle}
                tooltipContent="The end date of staking, when you can reclaim your provided liquidity."
              >
                <Text code className="helper-label">
                  END:{" "}
                  <Text prominent>{endDate.toLocaleDateString("en-US")}</Text>{" "}
                  <InfoCircle />
                </Text>
              </Hoverable>
            )}
          </div>
          <Display className="no-margin">
            {stakingDuration} D{/* Scrollbar */}
          </Display>
          <Form.Slider
            min={MIN_STAKING_DAYS}
            max={MAX_STAKING_DAYS}
            step={1}
            valueCallback={(value: number) => setStakingDuration(value)}
          />
          {!isMobile && (
            <Hoverable
              style={{ minWidth: 250 }}
              tooltipStyle={tooltipStyle}
              tooltipContent="The end date of staking, when you can reclaim your provided liquidity."
            >
              <Text code className="helper-label">
                END:{" "}
                <Text prominent>{endDate.toLocaleDateString("en-US")}</Text>{" "}
                <InfoCircle />
              </Text>
            </Hoverable>
          )}
          <Hoverable
            style={{ minWidth: 250 }}
            tooltipStyle={tooltipStyle}
            tooltipContent="Your accepted % for slippage."
            className="slippage-tooltip"
          >
            <Text prominent={!isMobile} code className="helper-label">
              SLIPPAGE % <InfoCircle />
            </Text>
          </Hoverable>
          <input
            className={"staking-modal-token-input"}
            pattern="[0-9]*"
            min={1}
            value={slippage}
            max={50}
            onChange={(e) => {
              setSlippage(Math.floor(parseInt(e.target.value) || 0));
            }}
          />
        </div>
        {!isMobile && (
          <div
            style={{
              width: "100%",
              borderBottom: "1px solid white",
              gridColumn: "1 / span 3",
            }}
          />
        )}
        <div className="power-column">
          <Hoverable
            style={{ minWidth: 250 }}
            tooltipStyle={tooltipStyle}
            tooltipContent="The lootbox multiplier you will receive on the first day after staking your liquidity. It will increase linearly until the end of the epoch. The longer you lock, the higher your multiplier will be on day 1."
          >
            <Text size="xs" code className="helper-label">
              DAY 1 POWER <InfoCircle />
            </Text>
          </Hoverable>
          <Text
            prominent
            holo={stakingDuration >= MAX_STAKING_DAYS}
            size="xxl"
            className="power-text"
          >
            {toSignificantDecimals(
              ((getUsdFromTokenAmount(
                fluidTokenAmount,
                fluidToken.decimals,
                usdcPrice
              ) || 0) +
                (getUsdFromTokenAmount(
                  baseTokenAmount,
                  baseToken.decimals,
                  baseUsdMultiplier
                ) || 0)) *
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
        {!isMobile && (
          <div className="staking-modal-arrow-container">
            <ArrowRight />
          </div>
        )}
        <div className="power-column rhs">
          <Hoverable
            style={{ minWidth: 250 }}
            tooltipStyle={tooltipStyle}
            tooltipContent="The maximum multiplier you will receive from staking at the end of the epoch. The longer you lock, the faster you will receive this multiplier."
          >
            <Text size="xs" className="helper-label" code>
              DAY {MAX_EPOCH_DAYS} POWER <InfoCircle />
            </Text>
          </Hoverable>
          <Text prominent holo size="xl" className="power-text">
            {toSignificantDecimals(
              ((getUsdFromTokenAmount(
                fluidTokenAmount,
                fluidToken.decimals,
                usdcPrice
              ) || 0) +
                (getUsdFromTokenAmount(
                  baseTokenAmount,
                  baseToken.decimals,
                  baseUsdMultiplier
                ) || 0)) *
                stakingLiquidityMultiplierEq(MAX_EPOCH_DAYS, stakingDuration),
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
                stakingLiquidityMultiplierEq(MAX_EPOCH_DAYS, stakingDuration)
              )}
              X
            </Text>
          </Card>
        </div>
        <div className="stake-confirm-column">
          {stakingState === "complete" ? (
            <GeneralButton
              className={"staking-modal-complete"}
              handleClick={() => setStakingState("ready")}
            >
              {buttonText}
            </GeneralButton>
          ) : (
            <SliderButton
              disabled={!canStake}
              style={{ width: "100%" }}
              onSlideComplete={() => handleStake()}
            >
              <Text
                style={{
                  color: stakingState === "staking" ? "black" : "white",
                }}
              >
                {buttonText}
              </Text>
            </SliderButton>
          )}
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
        </div>
      </div>
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
    desc: (
      <Text size="md">
        To learn more about the Airdrop and Fluidity, check out the Airdrop
        announcement post:{" "}
        <LinkButton
          size="medium"
          type="external"
          style={{
            display: "inline-flex",
            textDecoration: "underline",
            textUnderlineOffset: 2,
          }}
          handleClick={() => {
            window.open(
              "https://blog.fluidity.money/introducing-the-fluidity-airdrop-and-fluid-token-5832f6cab0e4",
              "_blank"
            );
          }}
        >
          LEARN MORE
        </LinkButton>
      </Text>
    ),
    image: "AIRDROP_DEEP_DIVE",
  },
};

const TutorialModal = ({
  isMobile,
  closeModal,
}: {
  isMobile?: boolean;
  closeModal?: () => void;
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const Navigation = () => {
    return (
      <div className="tutorial-nav">
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
          <Text size="md">{currentSlide + 1} / 5</Text>
        </div>
        {currentSlide !== 4 ? (
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
        ) : (
          !isMobile && (
            <GeneralButton
              type="primary"
              handleClick={closeModal}
              className="start-earning-button"
            >
              START EARNING
            </GeneralButton>
          )
        )}
      </div>
    );
  };

  return (
    <>
      {isMobile && <Navigation />}
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
            maxWidth: !isMobile ? 635 : "unset",
            gap: "1em",
            marginTop: isMobile ? 0 : "1em",
          }}
        >
          <Video
            type="cover"
            width={isMobile ? 550 : 635}
            height={isMobile ? 550 : 230}
            loop
            src={`/videos/airdrop/${isMobile ? `MOBILE` : `DESKTOP`}_-_${
              tutorialContent[currentSlide].image
            }.mp4`}
            className="tutorial-image"
            style={{ maxWidth: "100%" }}
          />
          <Display size="xxs" style={{ margin: 0, textAlign: "center" }}>
            {tutorialContent[currentSlide].title}
          </Display>
          {tutorialContent[currentSlide].desc}
        </motion.div>
      </AnimatePresence>
      {!isMobile && <Navigation />}
    </>
  );
};

const TestnetRewardsModal = () => {
  const {
    confirmAccountOwnership,
    signOwnerAddress,
    address: signerAddress,
  } = useContext(FluidityFacadeContext);
  const [address, setAddress] = useState("");
  const [ropstenAddress, setRopstenAddress] = useState("");
  const [signature, setSignature] = useState("");
  const [manualSignature, setManualSignature] = useState("");
  const [finalised, setFinalised] = useState(false);

  if (!confirmAccountOwnership || !signOwnerAddress) return <></>;

  if (finalised) {
    return (
      <div>
        <Heading>Claim Testnet Rewards</Heading>
        <Text prominent size="md">
          Congratulations! You have successfully confirmed your ownership of the
          testnet address {ropstenAddress}. If this address participated in the
          Fluidity Ropsten testnet, you will receive free loot bottles during
          the Fluidity Airdrop!
        </Text>
      </div>
    );
  }

  if (!signature || !address) {
    return (
      <div>
        <Heading>Claim Testnet Rewards</Heading>
        <Text prominent size="md">
          If you participated in Fluidity&#39;s Ropsten testnet, you are
          eligible for free bottles! To begin, switch your wallet to the address
          that you used on Ropsten. Then, enter your <strong>mainnet</strong>{" "}
          address in the box below.{" "}
          <strong>
            Ensure you don&#39;t change the active network away from Arbitrum!
          </strong>
          . Click the button to prompt a signature from your wallet. If you have
          already generated a signature previously, enter it in the signature
          box, as well as the address.
        </Text>

        <Heading>ADDRESS</Heading>
        <input
          value={address}
          onChange={(v) => setAddress(v.target.value)}
        ></input>
        <GeneralButton
          layout="after"
          handleClick={() => {
            setRopstenAddress(signerAddress ?? "");
            signOwnerAddress(address).then((sig) => setSignature(sig ?? ""));
          }}
          type="transparent"
        >
          Confirm Owner Address
        </GeneralButton>
        <Heading>SIGNATURE</Heading>
        <input
          value={manualSignature}
          onChange={(v) => setManualSignature(v.target.value)}
        ></input>
        <GeneralButton
          layout="after"
          handleClick={() => {
            setSignature(manualSignature);
          }}
          type="transparent"
        >
          Confirm signature
        </GeneralButton>
      </div>
    );
  } else {
    return (
      <div>
        <Heading>Claim Testnet Rewards</Heading>
        <Heading>SIGNATURE</Heading>
        <input value={signature} disabled={true}></input>
        {signerAddress?.toLowerCase() === address.toLowerCase() ? (
          <>
            <Text prominent size="md">
              Click to confirm your ownership of the testnet address{" "}
              {ropstenAddress}
            </Text>
            <GeneralButton
              layout="after"
              handleClick={() => {
                confirmAccountOwnership(signature, address).then(() =>
                  setFinalised(true)
                );
              }}
              type="transparent"
            >
              Confirm Account Ownership
            </GeneralButton>
          </>
        ) : (
          <>
            <Text prominent size="md">
              Change your wallet account to {address} to finalise confirmation.
              Currently signed in as {signerAddress}
            </Text>
          </>
        )}
      </div>
    );
  }
};

export {
  BottleDistribution,
  TutorialModal,
  BottleSection,
  StakeNowModal,
  StakingStatsModal,
  BottlesDetailsModal,
  ReferralDetailsModal,
  TestnetRewardsModal,
};
