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
  Checkmark,
  CopyIcon,
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
import { SplitContext } from "contexts/SplitProvider";

// Epoch length
const MAX_EPOCH_DAYS = 31;

// Minimum/Maximum staking duration
const MIN_STAKING_DAYS = 31;
const MAX_STAKING_DAYS = 365;

// Minimum amount of Fluid USDC deposit
const MINIMUM_FLUID_LIQUIDITY_USD = 10;

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
  activeReferrerReferralsCount,
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
      {activeReferrerReferralsCount}
    </LabelledValue>
    <LabelledValue
      label={
        <Hoverable
          style={{ minWidth: 250 }}
          tooltipStyle={tooltipStyle}
          tooltipContent="The amount of Loot Bottles you have earned from referring users with your link, and Loot Bottles you have claimed by clicking on links and performing the claim task."
        >
          <Text className="helper-label" size="xs">
            Total Bottles earned from Clicked Links & Your Link <InfoCircle />
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
  activeReferrerReferralsCount,
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
        activeReferrerReferralsCount={activeReferrerReferralsCount}
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
  redeemableUsd: number;
  redeemableTokens: Array<{
    tokenId: string;
    amount: BN;
    decimals: number;
  }>;
  handleRedeemTokens: () => Promise<boolean | undefined>;
}

const StakingStatsModal = ({
  stakes,
  wethPrice,
  usdcPrice,
  redeemableUsd,
  redeemableTokens,
  handleRedeemTokens,
}: IStakingStatsModal) => {
  const { showExperiment } = useContext(SplitContext);
  const [redeeming, setRedeeming] = useState(false);

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

  const canWithdraw =
    showExperiment("enable-withdraw-stakes") &&
    augmentedStakes.some(({ stake, stakedDays }) => {
      return stake.durationDays - stakedDays <= 0;
    });

  const sumLiquidityMultiplier = augmentedStakes.reduce(
    (sum, { multiplier, fluidUsd, baseUsd }) => {
      return sum + (fluidUsd + baseUsd) * multiplier;
    },
    0
  );

  const handleWithdraw = async () => {
    setRedeeming(true);
    try {
      await handleRedeemTokens();
    } catch (e) {
      setRedeeming(false);
    }
  };

  return (
    <div className={"staking-stats-container"}>
      {/*Stats row*/}
      <div className={"staking-stats-header"}>
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

      {/*Withdraw Row*/}
      <div className={"staking-stats-withdraw"}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {redeemableTokens.length ? (
            <Hoverable
              tooltipStyle={"frosted"}
              tooltipContent={
                <div className={"redeemable-token-container"}>
                  {redeemableTokens.map(({ tokenId, amount, decimals }) => {
                    return (
                      <div className={"redeemable-token"} key={tokenId}>
                        <TokenIcon token={tokenId} height={"24"} />{" "}
                        <Text prominent size={"lg"}>
                          {tokenId}: {addDecimalToBn(amount, decimals)}
                        </Text>
                      </div>
                    );
                  })}
                </div>
              }
            >
              <Text size={"lg"} prominent>
                Total Redeemable: {numberToMonetaryString(redeemableUsd)}{" "}
                <InfoCircle />
              </Text>
            </Hoverable>
          ) : augmentedStakes.length ? (
            <Text size={"lg"} prominent>
              {
                augmentedStakes
                  .map(({ stake, stakedDays }) =>
                    Math.max(0, Math.floor(stake.durationDays - stakedDays))
                  )
                  .sort((daysLeftA, daysLeftB) =>
                    daysLeftA < daysLeftB ? -1 : daysLeftA === daysLeftB ? 0 : 1
                  )[0]
              }{" "}
              days until next Withdrawal
            </Text>
          ) : (
            <></>
          )}
          <GeneralButton
            disabled={!canWithdraw}
            handleClick={() => handleWithdraw()}
          >
            {!redeeming ? "Withdraw" : "Redeeming..."}
          </GeneralButton>
        </div>

        {/*Stakes list*/}
        <div className={"staking-stats-stakes-container"}>
          {augmentedStakes.map(
            ({ stake, stakedDays, fluidUsd, baseUsd, multiplier }, i) => {
              const { durationDays, depositDate } = stake;

              const endDate = new Date(depositDate);
              endDate.setDate(endDate.getDate() + durationDays);

              return (
                <>
                  <div key={`stake-${i}`} className={"stake"}>
                    {/* Dates */}
                    <div className={"stake-date"}>
                      <Text>Start Date</Text>
                      <Text prominent>
                        {depositDate.toLocaleDateString("en-US")}
                      </Text>

                      <Text>End Date</Text>
                      <Text prominent>
                        {endDate.toLocaleDateString("en-US")}
                      </Text>
                    </div>
                    <div className={"stake-amount"}>
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
                      <div className={"stake-multiplier"}>
                        <Text prominent>
                          {toSignificantDecimals(multiplier, 1)}x Multiplier
                        </Text>
                        <Text prominent>
                          {Math.max(0, Math.floor(durationDays - stakedDays))}{" "}
                          Days Left
                        </Text>
                      </div>
                    </div>
                    <div className={"stake-date"}>
                      <Text>Staked For</Text>
                      <Heading as="h2" style={{ margin: "0.5em 0 0.5em 0" }}>
                        {Math.floor(durationDays)}
                      </Heading>
                      <Text>Days</Text>
                    </div>
                  </div>
                  <div className={"bottom-border"} />
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

  // stakingDuration is length of lockup time, in days
  const [stakingDuration, setStakingDuration] = useState(31);

  // slippage % is the allowance of the base token
  const [slippage, setSlippage] = useState(15);

  // stakeErr is the UI response on a failed test stake
  const [stakeErr, setStakeErr] = useState("");

  // tokenRatios is the proportion of base tokens in the pool,
  // and maximum base token spread, to the factor of 12
  const [tokenRatios, setTokenRatios] = useState<StakingRatioRes | null>(null);

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
      (baseToken.symbol === "USDC"
        ? tokenRatios.fusdcUsdcRatio.toNumber() -
        tokenRatios.fusdcUsdcSpread.toNumber() / 2
        : tokenRatios.fusdcWethRatio.toNumber() -
        tokenRatios.fusdcWethSpread.toNumber() / 2) / 1e12
    );

  // usdMultiplier x tokenAmount = USD
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

        if (!ratio) return;
        if (!(whole || dec)) return;

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
        amount: (matchingBaseTokenUsd / baseUsdMultiplier || 0)
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
      amount: (matchingFluidTokenUsd / fluidUsdMultiplier || 0)
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
      if (!(fluidToken.amount && baseToken.amount)) {
        throw Error('reason="not enough liquidity"');
      }

      if (
        getUsdFromTokenAmount(
          fluidTokenAmount,
          fluidToken.decimals,
          fluidUsdMultiplier
        ) < MINIMUM_FLUID_LIQUIDITY_USD
      ) {
        throw Error('reason="not enough liquidity (At Least 10 fUSDC)"');
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
      const errMsgMatchReason = /reason="[a-z0-9 :_()]+/i;
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

    const testRes = await testStake();

    if (!testRes) return setStakingState("ready");

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
          className={"staking-modal-banner"}
        >
          <Text style={{ color: "black" }} size="sm">
            👀 TIP: Stake over 31 days for more rewards in future epochs &
            events! 🌊
          </Text>
        </Card>
      )}
      <div
        className={`airdrop-stake-container ${isMobile ? "airdrop-mobile" : ""
          }`}
      >
        {/* Staking Amount */}
        <div className="airdrop-stake-inputs-column">
          <div className={"stake-inputs-header"}>
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
              <GeneralButton
                type="transparent"
                size="small"
                handleClick={inputMaxBalance}
                className={"max-button"}
              >
                <Text size="sm">MAX</Text>
              </GeneralButton>
            </div>
          </div>
          {showTokenSelector === "fluid" ? (
            <div className="staking-modal-token-selector">
              {fluidTokens.map((token) => (
                <button
                  className={"staking-modal-selector-token-icon"}
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
              DAY 0 POWER <InfoCircle />
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
              stakingLiquidityMultiplierEq(0, stakingDuration),
              1
            )}
          </Text>
          {stakingLiquidityMultiplierEq(1, stakingDuration) < 1 ? (
            <Text size="xs" prominent code>
              @ MULTIPLIER{" "}
              {toSignificantDecimals(
                stakingLiquidityMultiplierEq(0, stakingDuration)
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
    desc: "You can generate your own referral link and invite your friends to try out Fluidity! In exchange you will receive 10% of their airdrop earnings throughout the entire epoch. Your friend will receive 5 Loot Bottles after performing certain actions. ",
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
            src={`/videos/airdrop/${isMobile ? `MOBILE` : `DESKTOP`}_-_${tutorialContent[currentSlide].image
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
  const [finalised, setFinalised] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  if (!confirmAccountOwnership || !signOwnerAddress) return <></>;

  return (
    <div className="claim-ropsten">
      {/* {
        JSON.stringify({
          signature,
          error,
          ropstenAddress,
          signerAddress,
          address,
          finalised,
          manualSignature,
        }, null, 2)
      } */}
      <img src="/images/testnetBanner.png" />
      <div className="ropsten-header">
        <Heading as="h3">Claim Testnet Rewards</Heading>
        <Text prominent size="sm">
          If you participated in Fluidity&#39;s Ropsten testnet, you are
          eligible for free bottles!
        </Text>
      </div>
      {!signerAddress ? (
        <>
          <Text prominent size="sm">
            Please connect your wallet to begin.
          </Text>
        </>
      ) : finalised ? (
        <Text prominent size="sm">
          Congratulations! You have successfully confirmed your ownership of the
          testnet address:
          <GeneralButton
            type="transparent"
            size="small"
            className="ropsten-address-btn"
            disabled
            onClick={() => {
              return;
            }}
          >
            <Text prominent size="sm" code style={{ color: "inherit " }}>
              {ropstenAddress}
            </Text>
          </GeneralButton>
          <br />
          <br />
          If this address participated in the Fluidity Ropsten testnet, you will
          receive free loot bottles during the Fluidity Airdrop!
        </Text>
      ) : signature ? (
        signerAddress.toLowerCase() === address.toLowerCase() ? (
          <>
            <Text prominent size="sm">
              You are verifying ownership of the following testnet address:{" "}
              <GeneralButton
                type="transparent"
                size="small"
                className="ropsten-address-btn"
                disabled
                onClick={() => {
                  return;
                }}
              >
                <Text prominent size="sm" code style={{ color: "inherit " }}>
                  {ropstenAddress}
                </Text>
              </GeneralButton>
            </Text>
            <GeneralButton
              layout="after"
              handleClick={() => {
                confirmAccountOwnership(signature, address)
                  // .then((tx) => tx.confirmTx())
                  .then(() => {
                    setFinalised(true);
                  })
                  .catch((e) => {
                    const errMsgMatchReason = /message":"[a-z0-9 :_()]+/gi;
                    const stakingError = (e as { message: string }).message
                      .match(errMsgMatchReason)?.[1]
                      .slice(10);

                    setError(stakingError ?? "");
                    setFinalised(false);
                  })
                  .finally(() => setSignature(""));
              }}
              type="transparent"
            >
              Confirm Account Ownership
            </GeneralButton>
          </>
        ) : (
          <>
            <Text prominent size="sm">
              Change your wallet account to{" "}
              <GeneralButton
                type="transparent"
                size="small"
                className="ropsten-address-btn"
                disabled
                onClick={() => {
                  return;
                }}
              >
                <Text prominent size="sm" code style={{ color: "inherit " }}>
                  {address}
                </Text>
              </GeneralButton>{" "}
              to finalise confirmation. Currently signed in as{" "}
              <GeneralButton
                type="transparent"
                size="small"
                className="ropsten-address-btn"
                disabled
                onClick={() => {
                  return;
                }}
              >
                <Text prominent size="sm" code style={{ color: "inherit " }}>
                  {signerAddress}
                </Text>
              </GeneralButton>
            </Text>
          </>
        )
      ) : (
        <>
          <Text prominent size="sm" style={{ margin: "1em 0" }}>
            <ol>
              <li>
                Copy your Arbitrum One address.
                <div style={{ display: "inline-block", width: "1em" }} />
                <GeneralButton
                  className="ropsten-address-btn"
                  size="small"
                  icon={
                    copied ? (
                      <span className="ropsten-check">
                        <Checkmark />
                      </span>
                    ) : (
                      <CopyIcon />
                    )
                  }
                  type="transparent"
                  layout="after"
                  handleClick={() => {
                    navigator.clipboard.writeText(signerAddress);
                    setCopied(true);
                  }}
                >
                  <Text code size="sm" style={{ color: "inherit" }}>
                    {signerAddress}
                  </Text>
                </GeneralButton>
              </li>
              <li>
                Switch your wallet to the address that you used on Ropsten.{" "}
                <br />
                (If you are using the same address as you used on Ropsten
                continue to Step 3)
              </li>
              <li>Enter your Arbitrum One address in the box below.</li>
              <li>
                Click the confirmation button to prompt a signature from your
                wallet.
              </li>
              <Card className="ropsten-warning" border="solid">
                <Text size="sm">
                  <InfoCircle />
                  Ensure you don&#39;t change the active network away from
                  Arbitrum One!
                </Text>
              </Card>
            </ol>
          </Text>
          <div className="claim-ropsten-form">
            <div className="claim-ropsten-input">
              <Text size="xs" className="helper-label">
                ARBITRUM ONE ADDRESS
              </Text>
              <input
                value={address}
                onChange={(v) => setAddress(v.target.value)}
              ></input>
              <GeneralButton
                layout="after"
                handleClick={() => {
                  setRopstenAddress(signerAddress ?? "");
                  signOwnerAddress(address).then((sig) =>
                    setSignature(sig ?? "")
                  );
                }}
                type="transparent"
              >
                <Text style={{ color: "inherit" }} code>
                  Confirm Owner Address
                </Text>
              </GeneralButton>
            </div>
          </div>
          {error && (
            <Card className="ropsten-warning danger">
              <Text prominent size="xs" style={{ color: "inherit" }}>
                <InfoCircle />
                {error}
              </Text>
            </Card>
          )}
        </>
      )}
    </div>
  );
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
