import type { LoaderFunction } from "@remix-run/node";

import { json } from "@remix-run/node";
import { stakingLiquidityMultiplierEq } from "./common";
import { useLoaderData } from "@remix-run/react";
import BN from "bn.js";
import {
  Card,
  Form,
  Heading,
  TextButton,
  LabelledValue,
  LinkButton,
  Text,
  HeroCarousel,
  ProgressBar,
  GeneralButton,
  ArrowRight,
  Display,
  ProviderIcon,
  Provider,
  CardModal,
  Rarity,
  TabButton,
  BloomEffect,
  toSignificantDecimals,
  useViewport,
  numberToMonetaryString,
} from "@fluidity-money/surfing";
import {
  BottlesDetailsModal,
  BottleDistribution,
  ReferralDetailsModal,
  StakeNowModal,
  StakingStatsModal,
  TutorialModal,
} from "./common";
import { SplitContext } from "contexts/SplitProvider";
import { motion } from "framer-motion";
import { useContext, useState, useEffect, useRef } from "react";
import { getUsdFromTokenAmount, Token, trimAddress } from "~/util";
import airdropStyle from "~/styles/dashboard/airdrop.css";
import { AirdropLoaderData, BottleTiers } from "../../query/dashboard/airdrop";
import { AirdropLeaderboardLoaderData } from "../../query/dashboard/airdropLeaderboard";
import { ReferralCountLoaderData } from "../../query/referrals";
import { AirdropLeaderboardEntry } from "~/queries/useAirdropLeaderboard";
import config from "~/webapp.config.server";
import AugmentedToken from "~/types/AugmentedToken";
import FluidityFacadeContext from "contexts/FluidityFacade";
import { useCache } from "~/hooks/useCache";
import Table from "~/components/Table";

const EPOCH_DAYS_TOTAL = 31;
// temp: april 19th, 2023
const EPOCH_START_DATE = new Date(2023, 3, 20);

export const links = () => {
  return [{ rel: "stylesheet", href: airdropStyle }];
};

export const loader: LoaderFunction = async ({ params }) => {
  const network = params.network ?? "";

  const epochDays = dayDifference(new Date(), EPOCH_START_DATE);

  // Staking Tokens
  const allowedTokenSymbols = new Set(["fUSDC", "USDC", "wETH"]);
  const { tokens } = config.config[network];

  const allowedTokens = tokens.filter(({ symbol }) =>
    allowedTokenSymbols.has(symbol)
  );

  return json({
    tokens: allowedTokens,
    epochDaysTotal: EPOCH_DAYS_TOTAL,
    epochDays,
    network,
  } satisfies LoaderData);
};

type LoaderData = {
  tokens: Array<Token>;
  epochDaysTotal: number;
  epochDays: number;
  network: string;
};

const SAFE_DEFAULT_AIRDROP: AirdropLoaderData = {
  referralsCount: 0,
  bottleTiers: {
    [Rarity.Common]: 0,
    [Rarity.Uncommon]: 0,
    [Rarity.Rare]: 0,
    [Rarity.UltraRare]: 0,
    [Rarity.Legendary]: 0,
  },
  bottlesCount: 0,
  liquidityMultiplier: 0,
  stakes: [],
  wethPrice: 0,
  usdcPrice: 0,
  loaded: false,
};

const SAFE_DEFAULT_AIRDROP_LEADERBOARD: AirdropLeaderboardLoaderData = {
  leaderboard: [],
  loaded: false,
};

const SAFE_DEFAULT_REFERRALS: ReferralCountLoaderData = {
  numActiveReferrerReferrals: 0,
  numActiveReferreeReferrals: 0,
  numInactiveReferreeReferrals: 0,
  inactiveReferrals: [],
  referralCode: "",
  loaded: false,
};

const Airdrop = () => {
  const {
    epochDaysTotal,
    epochDays,
    tokens: defaultTokens,
    network,
  } = useLoaderData<LoaderData>();

  const [tokens, setTokens] = useState<AugmentedToken[]>(
    defaultTokens.map((tok) => ({ ...tok, userTokenBalance: new BN(0) }))
  );

  const { showExperiment } = useContext(SplitContext);

  const showAirdrop = showExperiment("enable-airdrop-page");

  const [leaderboardFilterIndex, setLeaderboardFilterIndex] = useState(1);

  const {
    address,
    balance,
    stakeTokens,
    getStakingDeposits,
    testStakeTokens,
    getStakingRatios,
  } = useContext(FluidityFacadeContext);

  const { data: airdropData } = useCache<AirdropLoaderData>(
    address ? `/${network}/query/dashboard/airdrop?address=${address}` : ""
  );

  const { data: globalAirdropLeaderboardData } = useCache<AirdropLoaderData>(
    `/${network}/query/dashboard/airdropLeaderboard?period=${
      leaderboardFilterIndex === 0 ? "24" : "all"
    }`
  );

  const { data: userAirdropLeaderboardData } = useCache<AirdropLoaderData>(
    address
      ? `/${network}/query/dashboard/airdropLeaderboard?period=${
          leaderboardFilterIndex === 0 ? "24" : "all"
        }&address=${address}`
      : ""
  );

  const { data: referralData } = useCache<AirdropLoaderData>(
    address ? `/${network}/query/referrals?address=${address}` : ""
  );

  const { width } = useViewport();

  const mobileBreakpoint = 768;

  const isMobile = width < mobileBreakpoint;

  const data = {
    airdrop: {
      ...SAFE_DEFAULT_AIRDROP,
      ...airdropData,
    },
    airdropLeaderboard: {
      ...SAFE_DEFAULT_AIRDROP_LEADERBOARD,
      ...globalAirdropLeaderboardData,
    },
    userAirdropLeaderboard: {
      ...SAFE_DEFAULT_AIRDROP_LEADERBOARD,
      ...userAirdropLeaderboardData,
    },
    referrals: {
      ...SAFE_DEFAULT_REFERRALS,
      ...referralData,
    },
  };

  const {
    airdrop: {
      bottleTiers,
      liquidityMultiplier,
      bottlesCount,
      wethPrice,
      usdcPrice,
    },
    referrals: {
      numActiveReferreeReferrals,
      numActiveReferrerReferrals,
      numInactiveReferreeReferrals,
      inactiveReferrals,
    },
    airdropLeaderboard: {
      leaderboard: globalLeaderboardRows,
      loaded: globalLeaderboardLoaded,
    },
    userAirdropLeaderboard: {
      leaderboard: userLeaderboardRows,
      loaded: userLeaderboardLoaded,
    },
  } = data;

  const leaderboardRows = userLeaderboardLoaded
    ? userLeaderboardRows.concat(globalLeaderboardRows)
    : globalLeaderboardRows;

  const [currentModal, setCurrentModal] = useState<string | null>("stake-now");
  const [stakes, setStakes] = useState<
    Array<{
      fluidAmount: BN;
      baseAmount: BN;
      durationDays: number;
      depositDate: Date;
    }>
  >([]);

  const closeModal = () => {
    setCurrentModal(null);
  };

  useEffect(() => {
    // If we change page on mobile, reset the scroll position
    if (!isMobile) return;

    window.scrollTo(0, 0);
  }, [isMobile, currentModal]);

  // get token data once user is connected
  useEffect(() => {
    if (!address) {
      return setTokens(
        tokens.map((token) => ({
          ...token,
          userTokenBalance: new BN(0),
        }))
      );
    }

    (async () => {
      const userTokenBalance = await Promise.all(
        tokens.map(
          async ({ address }) => (await balance?.(address)) || new BN(0)
        )
      );

      return setTokens(
        tokens.map((token, i) => ({
          ...token,
          userTokenBalance: userTokenBalance[i],
        }))
      );
    })();

    (async () => {
      const stakingDeposits = (await getStakingDeposits?.(address)) ?? [];
      setStakes(stakingDeposits);
    })();
  }, [address]);

  const leaderboardRef = useRef<HTMLDivElement>(null);

  const Header = () => {
    return (
      <div
        className={`pad-main airdrop-header ${
          isMobile ? "airdrop-mobile" : ""
        }`}
      >
        <TabButton size="small" onClick={() => setCurrentModal(null)}>
          Airdrop Dashboard
        </TabButton>
        <TabButton size="small" onClick={() => setCurrentModal("tutorial")}>
          Airdrop Tutorial
        </TabButton>
        <TabButton
          size="small"
          onClick={() => {
            if (!isMobile) {
              leaderboardRef.current?.scrollIntoView({
                block: "start",
                behavior: "smooth",
              });
            }
            setCurrentModal("leaderboard");
          }}
        >
          Leaderboard
        </TabButton>
        <TabButton
          size="small"
          onClick={() => setCurrentModal("referral-details")}
        >
          Referrals
        </TabButton>
        <TabButton size="small" onClick={() => setCurrentModal("stake-now")}>
          Stake
        </TabButton>
      </div>
    );
  };

  if (!showAirdrop) return null;

  if (isMobile)
    return (
      <>
        <Header />
        <motion.div
          className={`pad-main ${
            currentModal === "leaderboard" ? "airdrop-leaderboard-mobile" : ""
          }`}
          style={{
            display: "flex",
            flexDirection: "column",
            gap:
              currentModal === "tutorial" || currentModal === "leaderboard"
                ? "0.5em"
                : "2em",
          }}
          key={`airdrop-mobile-${currentModal}`}
        >
          {currentModal === null && (
            <>
              <div>
                <Heading
                  as="h3"
                  style={{ marginBottom: "0.5em" }}
                  className={"no-margin"}
                >
                  Welcome to Fluidity&apos;s Airdrop Event!
                </Heading>
                <Text>
                  Fluidify your assets, transact them, and boost your rewards by
                  using your Fluid Assets on partnered protocols and staking
                  liquidity right here on Fluidity! Keep an eye on the
                  leaderboard as you compete with fellow Fluiders for the top
                  spot. Future Fluid Governance Tokens await!
                  <LinkButton
                    size="medium"
                    type="external"
                    handleClick={() => {
                      return;
                    }}
                  >
                    Learn more
                  </LinkButton>
                </Text>
              </div>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "1em",
                }}
              >
                <BottleProgress bottles={bottleTiers} isMobile />
                <TextButton className="bottles-earned-button">
                  Bottles Earned Since Last Checked <ArrowRight />
                </TextButton>
              </div>
              <AirdropStats
                seeReferralsDetails={() => setCurrentModal("referral-details")}
                seeBottlesDetails={() => setCurrentModal("bottles-details")}
                seeLeaderboardMobile={() => setCurrentModal("leaderboard")}
                epochMax={epochDaysTotal}
                epochDays={epochDays}
                activatedReferrals={numActiveReferrerReferrals}
                totalBottles={bottlesCount}
                isMobile
              />
              <MultiplierTasks />
              <MyMultiplier
                seeMyStakingStats={() => setCurrentModal("staking-stats")}
                seeStakeNow={() => setCurrentModal("stake-now")}
                liquidityMultiplier={liquidityMultiplier}
                stakes={stakes}
                wethPrice={wethPrice}
                usdcPrice={1}
                isMobile
              />
            </>
          )}
          {currentModal === "tutorial" && (
            <>
              <Heading as="h3" className="no-margin">
                Airdrop Tutorial
              </Heading>
              <TutorialModal isMobile />
            </>
          )}
          {currentModal === "leaderboard" && (
            <>
              <Leaderboard
                loaded={globalLeaderboardLoaded}
                data={leaderboardRows}
                filterIndex={leaderboardFilterIndex}
                setFilterIndex={setLeaderboardFilterIndex}
                userAddress={address || ""}
                isMobile
              />
            </>
          )}
          {currentModal === "stake-now" && (
            <>
              <Heading as="h3" className="no-margin">
                Stake Now
              </Heading>

              <StakeNowModal
                fluidTokens={tokens.filter((tok) =>
                  Object.prototype.hasOwnProperty.call(tok, "isFluidOf")
                )}
                baseTokens={tokens.filter(
                  (tok) =>
                    !Object.prototype.hasOwnProperty.call(tok, "isFluidOf")
                )}
                stakeTokens={stakeTokens}
                testStakeTokens={testStakeTokens}
                getRatios={getStakingRatios}
                isMobile={isMobile}
                wethPrice={wethPrice}
                usdcPrice={usdcPrice}
              />
              <Heading as="h3">My Staking Stats</Heading>
              <StakingStatsModal
                liqudityMultiplier={liquidityMultiplier}
                stakes={stakes}
                wethPrice={wethPrice}
                usdcPrice={usdcPrice}
              />
            </>
          )}
        </motion.div>
      </>
    );

  return (
    <>
      {/* Modals */}
      <CardModal
        id="referral-details"
        visible={currentModal === "referral-details"}
        closeModal={closeModal}
        style={{ gap: "1em" }}
      >
        <ReferralDetailsModal
          bottles={bottleTiers}
          totalBottles={bottlesCount}
          activeReferrerReferralsCount={numActiveReferrerReferrals}
          activeRefereeReferralsCount={numActiveReferreeReferrals}
          inactiveReferrerReferralsCount={numInactiveReferreeReferrals}
          nextInactiveReferral={inactiveReferrals[0]}
          isMobile={isMobile}
        />
      </CardModal>
      <CardModal
        id="bottles-details"
        visible={currentModal === "bottles-details"}
        closeModal={closeModal}
        style={{ gap: "1em" }}
      >
        <BottlesDetailsModal bottles={bottleTiers} />
      </CardModal>
      <CardModal
        id="stake-now"
        visible={currentModal === "stake-now"}
        closeModal={closeModal}
        style={{ gap: "2em" }}
      >
        <StakeNowModal
          fluidTokens={tokens.filter((tok) =>
            Object.prototype.hasOwnProperty.call(tok, "isFluidOf")
          )}
          baseTokens={tokens.filter(
            (tok) => !Object.prototype.hasOwnProperty.call(tok, "isFluidOf")
          )}
          stakeTokens={stakeTokens}
          testStakeTokens={testStakeTokens}
          getRatios={getStakingRatios}
          wethPrice={wethPrice}
          usdcPrice={usdcPrice}
          isMobile={isMobile}
        />
      </CardModal>
      <CardModal
        id="staking-stats"
        visible={currentModal === "staking-stats"}
        closeModal={closeModal}
      >
        <StakingStatsModal
          liqudityMultiplier={liquidityMultiplier}
          stakes={stakes}
          wethPrice={wethPrice}
          usdcPrice={usdcPrice}
        />
      </CardModal>
      <CardModal
        id="tutorial"
        visible={currentModal === "tutorial"}
        closeModal={closeModal}
      >
        <TutorialModal closeModal={closeModal} />
      </CardModal>

      {/* Page Content */}
      <Header />
      <div className="pad-main">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10%",
            maxWidth: 1200,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "2em",
              zIndex: 100,
            }}
          >
            <div>
              <Heading
                as="h2"
                className={"no-margin"}
                style={{ marginBottom: "0.5em" }}
              >
                Welcome to Fluidity&apos;s Airdrop Event!
              </Heading>
              <Text style={{ fontSize: 14 }}>
                Fluidify your assets, transact them, and boost your rewards by
                using your Fluid Assets on partnered protocols and staking
                liquidity right here on Fluidity! Keep an eye on the leaderboard
                as you compete with fellow Fluiders for the top spot. Future
                Fluid Governance Tokens await!
                <LinkButton
                  size="medium"
                  type="external"
                  style={{
                    display: "inline-flex",
                    textDecoration: "underline",
                    textUnderlineOffset: 2,
                  }}
                  handleClick={() => {
                    return;
                  }}
                >
                  Learn more
                </LinkButton>
              </Text>
            </div>
            <AirdropStats
              seeReferralsDetails={() => setCurrentModal("referral-details")}
              seeBottlesDetails={() => setCurrentModal("bottles-details")}
              seeLeaderboardMobile={() => setCurrentModal("leaderboard")}
              epochMax={epochDaysTotal}
              epochDays={epochDays}
              activatedReferrals={numActiveReferrerReferrals}
              totalBottles={bottlesCount}
            />
            <MultiplierTasks />
            <MyMultiplier
              seeMyStakingStats={() => setCurrentModal("staking-stats")}
              seeStakeNow={() => setCurrentModal("stake-now")}
              liquidityMultiplier={liquidityMultiplier}
              stakes={stakes}
              wethPrice={wethPrice}
              usdcPrice={usdcPrice}
            />
          </div>
          <BottleProgress bottles={bottleTiers} />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "2em",
          marginBottom: "3em",
        }}
      >
        <GeneralButton
          type="transparent"
          icon={
            <span style={{ fill: "none", transform: "rotate(90deg)" }}>
              <ArrowRight />
            </span>
          }
          onClick={() => {
            leaderboardRef.current?.scrollIntoView({
              block: "start",
              behavior: "smooth",
            });
          }}
        >
          LEADERBOARD
        </GeneralButton>
      </div>
      <div className="pad-main" id="#leaderboard" ref={leaderboardRef}>
        <Card
          className="leaderboard-container"
          type="transparent"
          border="solid"
          rounded
          color="white"
        >
          <Leaderboard
            loaded={globalLeaderboardLoaded}
            data={leaderboardRows}
            filterIndex={leaderboardFilterIndex}
            setFilterIndex={setLeaderboardFilterIndex}
            userAddress={address || ""}
          />
        </Card>
      </div>
    </>
  );
};

interface IAirdropStats {
  seeReferralsDetails: () => void;
  seeBottlesDetails: () => void;
  seeLeaderboardMobile?: () => void;
  epochDays: number;
  epochMax: number;
  activatedReferrals: number;
  totalBottles: number;
  isMobile?: boolean;
}

const AirdropStats = ({
  seeReferralsDetails,
  seeBottlesDetails,
  seeLeaderboardMobile,
  epochDays,
  epochMax,
  activatedReferrals,
  totalBottles,
  isMobile,
}: IAirdropStats) => {
  return (
    <div
      className="airdrop-stats"
      style={
        isMobile
          ? { flexWrap: "wrap-reverse", flexDirection: "row-reverse" }
          : {}
      }
    >
      {isMobile && (
        <div
          className="airdrop-stats-item see-the-leaderboard-button"
          onClick={() => {
            seeLeaderboardMobile?.();
          }}
        >
          <Text prominent size="xs">
            SEE THE LEADERBOARD
          </Text>
        </div>
      )}
      <div className="airdrop-stats-item">
        <LabelledValue label={<Text size="xs">EPOCH DAYS LEFT</Text>}>
          <Text prominent size="xl">
            {epochMax - epochDays}
          </Text>
        </LabelledValue>
        <div
          style={{
            display: "flex",
            gap: "1em",
            alignItems: "center",
          }}
        >
          <ProgressBar
            value={epochDays}
            max={epochMax}
            size="sm"
            rounded
            color="white"
          />
          <Text>{Math.floor((epochDays / epochMax) * 100)}%</Text>
        </div>
      </div>
      <div className="airdrop-stats-item">
        <LabelledValue label={<Text size="xs">REFERRALS</Text>}>
          <Text prominent size="xl">
            {activatedReferrals}
          </Text>
        </LabelledValue>
        <LinkButton
          color="gray"
          size="small"
          type="internal"
          handleClick={seeReferralsDetails}
          style={{
            marginLeft: -6,
          }}
        >
          SEE DETAILS
        </LinkButton>
      </div>
      <div className="airdrop-stats-item">
        <LabelledValue label={<Text size="xs">MY TOTAL BOTTLES</Text>}>
          <Text prominent size="xl">
            {toSignificantDecimals(totalBottles, 0)}
          </Text>
        </LabelledValue>
        <LinkButton
          color="gray"
          size="small"
          type="internal"
          handleClick={
            isMobile
              ? () => {
                  console.log("TODO REDIRECT");
                }
              : seeBottlesDetails
          }
          style={{
            marginLeft: -6,
          }}
        >
          {isMobile ? "SEE TX HISTORY" : "SEE DETAILS"}
        </LinkButton>
      </div>
    </div>
  );
};

const MultiplierTasks = () => {
  const [tasks, setTasks] = useState<"1x" | "6x">("6x");

  const providers: Provider[] = [
    "Uniswap",
    "Sushiswap",
    "Camelot",
    "Saddle",
    "Chronos",
    "Kyber",
  ];
  return (
    <Card fill color="holo" rounded className="multiplier-tasks">
      <div className="multiplier-tasks-header">
        <Text style={{ color: "black" }} bold size="md">
          Multiplier Tasks
        </Text>
        <Text size="xs" style={{ color: "black" }}>
          Perform displayed tasks to earn the respective multipliers.
        </Text>
      </div>
      <div
        className="multiplier-tasks-multiplier"
        onClick={() => {
          setTasks((prev) => (prev === "1x" ? "6x" : "1x"));
        }}
        style={{ transform: "scale(0.6)" }}
      >
        <Form.Toggle
          color="black"
          direction="vertical"
          checked={tasks === "6x"}
        />
        <TextButton style={{ textDecorationThickness: "3px" }}>
          <motion.div
            key={tasks}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.4 } }}
            exit={{ opacity: 0, y: -10, transition: { duration: 0.4 } }}
          >
            <Display size="sm" style={{ color: "black", margin: 0 }}>
              {tasks}
            </Display>
          </motion.div>
        </TextButton>
      </div>
      {tasks === "1x" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.2 } }}
          exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
          className="multiplier-tasks-tasks"
        >
          <Text size="xs" style={{ color: "black" }}>
            Perform any type of fAsset transactions{" "}
            <b>in any on-chain protocol</b>, including sending{" "}
            <b>with any wallet</b>.
          </Text>
        </motion.div>
      )}
      {tasks === "6x" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.2 } }}
          exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
          className="multiplier-tasks-tasks"
        >
          {providers.map((provider, i) => {
            return (
              <a
                key={`airdrop-mx-provider-` + i}
                style={{
                  cursor: "pointer",
                  width: "24px",
                  height: "24px",
                  borderRadius: "32px",
                  backgroundColor: "black",
                  padding: "6px",
                }}
                href="#"
              >
                <ProviderIcon provider={provider} style={{ height: "100%" }} />
              </a>
            );
          })}
        </motion.div>
      )}
    </Card>
  );
};

interface IMyMultiplier {
  liquidityMultiplier: number;
  stakes: Array<{
    fluidAmount: BN;
    baseAmount: BN;
    durationDays: number;
    depositDate: Date;
  }>;
  seeMyStakingStats: () => void;
  seeStakeNow: () => void;
  wethPrice: number;
  usdcPrice: number;
  isMobile?: boolean;
}

const MyMultiplier = ({
  seeMyStakingStats,
  seeStakeNow,
  liquidityMultiplier,
  stakes,
  wethPrice,
  usdcPrice,
  isMobile = false,
}: IMyMultiplier) => {
  return (
    <div
      className={`airdrop-my-multiplier ${isMobile ? "airdrop-mobile" : ""}`}
    >
      {isMobile && (
        <BloomEffect
          color="#d9abdf"
          width={20}
          className="mx-bloom"
          type="static"
        />
      )}
      <div>
        <LabelledValue
          align={isMobile ? "center" : "left"}
          className="mx-my-multiplier"
          label={<Text size="xs">MY TOTAL LIQUIDITY MULTIPLIER</Text>}
        >
          <Text size="xxl" holo>
            {liquidityMultiplier.toLocaleString()}x
          </Text>
        </LabelledValue>
      </div>
      <GeneralButton
        icon={<ArrowRight />}
        layout="after"
        size="small"
        type="secondary"
        handleClick={seeMyStakingStats}
        id="mx-see-my-staking-stats"
      >
        MY STAKING STATS
      </GeneralButton>
      {!isMobile && (
        <div id="mx-my-stakes">
          {stakes.map(
            ({ fluidAmount, baseAmount, durationDays, depositDate }) => {
              const stakedDays = dayDifference(
                new Date(),
                new Date(depositDate)
              );
              const multiplier = stakingLiquidityMultiplierEq(
                stakedDays,
                durationDays
              );

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
                getUsdFromTokenAmount(baseAmount, wethDecimals, wethPrice) <
                0.01
                  ? getUsdFromTokenAmount(baseAmount, usdcDecimals, usdcPrice)
                  : getUsdFromTokenAmount(baseAmount, wethDecimals, wethPrice);

              return (
                <>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: "0.5em",
                    }}
                  >
                    <Text prominent code>
                      {numberToMonetaryString(fluidUsd + baseUsd)} FOR{" "}
                      {Math.floor(durationDays)} DAYS
                    </Text>
                    <ProgressBar
                      value={stakedDays}
                      max={Math.floor(durationDays)}
                      rounded
                      color={
                        stakedDays >= Math.floor(durationDays) ? "holo" : "gray"
                      }
                      size="sm"
                    />
                  </div>
                  <div
                    style={{ alignSelf: "flex-end", marginBottom: "-0.2em" }}
                  >
                    <Text holo bold prominent>
                      {multiplier}X
                    </Text>
                  </div>
                </>
              );
            }
          )}
        </div>
      )}
      <GeneralButton
        icon={isMobile ? <ArrowRight /> : undefined}
        layout={"after"}
        buttontype="text"
        size="medium"
        version="primary"
        handleClick={seeStakeNow}
        id="mx-stake-now-button"
      >
        STAKE NOW
      </GeneralButton>
    </div>
  );
};

interface IAirdropRankRow {
  data: AirdropLeaderboardEntry;
  index: number;
  isMobile?: boolean;
}

const AirdropRankRow: React.FC<IAirdropRankRow> = ({
  data,
  index,
  isMobile = false,
}: IAirdropRankRow) => {
  const { address } = useContext(FluidityFacadeContext);
  // const address = '0xb3701a61a9759d10a0fc7ce55354a8163496caec'
  const { user, rank, referralCount, liquidityMultiplier, bottles } = data;

  return (
    <motion.tr
      className={`airdrop-row ${isMobile ? "airdrop-mobile" : ""} ${
        address === user ? "highlighted-row" : ""
      }`}
      key={`${rank}-${index}`}
      variants={{
        enter: { opacity: [0, 1] },
        ready: { opacity: 1 },
        exit: { opacity: 0 },
        transitioning: {
          opacity: [0.75, 1, 0.75],
          transition: { duration: 1.5, repeat: Infinity },
        },
      }}
    >
      {/* Rank */}
      <td>
        <Text
          prominent
          style={
            address === user
              ? {
                  color: "black",
                }
              : {}
          }
        >
          {rank === -1 ? "???" : rank}
        </Text>
      </td>

      {/* User */}
      <td>
        <Text
          prominent
          style={
            address === user
              ? {
                  color: "black",
                }
              : {}
          }
        >
          {address === user ? "ME" : trimAddress(user)}
        </Text>
      </td>

      {/* Bottles */}
      <td>
        <Text
          prominent
          style={
            address === user
              ? {
                  color: "black",
                }
              : {}
          }
        >
          {toSignificantDecimals(bottles, 0)}
        </Text>
      </td>

      {/* Multiplier */}
      <td>
        <Text
          prominent
          style={
            address === user
              ? {
                  color: "black",
                }
              : {}
          }
        >
          {liquidityMultiplier.toLocaleString()}x
        </Text>
      </td>

      {/* Referrals */}
      <td>
        <Text
          prominent
          style={
            address === user
              ? {
                  color: "black",
                }
              : {}
          }
        >
          {referralCount}
        </Text>
      </td>
    </motion.tr>
  );
};

interface IAirdropLeaderboard {
  loaded: boolean;
  data: Array<AirdropLeaderboardEntry>;
  filterIndex: number;
  setFilterIndex: (index: number) => void;
  userAddress: string;
  isMobile?: boolean;
}

const Leaderboard = ({
  loaded,
  data,
  filterIndex,
  setFilterIndex,
  userAddress,
  isMobile = false,
}: IAirdropLeaderboard) => {
  // This adds a dummy user entry to the leaderboard if the user's address isn't found
  if (loaded && !data.find((entry) => entry.user === userAddress)) {
    const userEntry = {
      user: userAddress,
      rank: -1,
      referralCount: 0,
      liquidityMultiplier: 0,
      bottles: 0,
      highestRewardTier: 0,
    };

    data.push(userEntry);
  }

  return (
    <>
      <div className={`leaderboard-header ${isMobile ? "airdrop-mobile" : ""}`}>
        <div className="leaderboard-header-text">
          <Heading as="h3">Leaderboard</Heading>
          <Text prominent>
            This leaderboard shows your rank among other users{" "}
            {filterIndex === 0 ? " per" : " for"}
            &nbsp;
            {filterIndex === 0 ? (
              <span className="airdrop-ldb-time-filter">24 HOURS</span>
            ) : (
              <span className="airdrop-ldb-time-filter">ALL TIME</span>
            )}
          </Text>
        </div>
        <div className="leaderboard-header-filters">
          <GeneralButton
            type={filterIndex === 0 ? "primary" : "secondary"}
            handleClick={() => setFilterIndex(0)}
          >
            <Text code size="sm" style={{ color: "inherit" }}>
              24 HOURS
            </Text>
          </GeneralButton>
          <GeneralButton
            type={filterIndex === 1 ? "primary" : "secondary"}
            handleClick={() => setFilterIndex(1)}
          >
            <Text code size="sm" style={{ color: "inherit" }}>
              ALL TIME
            </Text>
          </GeneralButton>
        </div>
      </div>
      <Table
        itemName=""
        headings={[
          { name: "RANK" },
          { name: "USER" },
          { name: "BOTTLES" },
          { name: "MULTIPLIER" },
          { name: "REFERRALS" },
        ]}
        pagination={{
          paginate: false,
          page: 1,
          rowsPerPage: 11,
        }}
        count={0}
        data={data}
        renderRow={(data) => (
          <AirdropRankRow
            data={data.data}
            index={data.index}
            isMobile={isMobile}
          />
        )}
        freezeRow={(data) => {
          return data.user === userAddress;
        }}
        onFilter={() => true}
        activeFilterIndex={0}
        filters={[]}
        loaded={loaded}
      />
    </>
  );
};

const BottleProgress = ({
  bottles,
  isMobile,
}: {
  bottles: BottleTiers;
  isMobile?: boolean;
}) => {
  const [imgIndex, setImgIndex] = useState(0);
  const [showBottleNumbers, setShowBottleNumbers] = useState(false);

  const handleHeroPageChange = (index: number) => {
    setImgIndex(index);
  };

  return (
    <div
      style={{
        maxWidth: isMobile ? "100%" : 450,
        display: "flex",
        flexDirection: "column",
        gap: "1em",
      }}
    >
      <HeroCarousel
        title="BOTTLES I'VE EARNED"
        onSlideChange={handleHeroPageChange}
        controlledIndex={imgIndex}
        style={isMobile ? { flexDirection: "column-reverse", gap: "2em" } : {}}
      >
        <Card type="frosted" fill shimmer rounded>
          <img src="/images/hero/common.png" />
        </Card>
        <Card type="frosted" fill shimmer rounded>
          <img src="/images/hero/uncommon.png" />
        </Card>
        <Card type="frosted" fill shimmer rounded>
          <img src="/images/hero/rare.png" />
        </Card>
        <Card type="frosted" fill shimmer rounded>
          <img src="/images/hero/ultra_rare.png" />
        </Card>
        <Card type="frosted" fill shimmer rounded>
          <img src="/images/hero/legendary.png" />
        </Card>
      </HeroCarousel>
      <BottleDistribution
        handleClickBottle={(index) => {
          setImgIndex(index);
        }}
        style={{
          height: !isMobile ? 100 : "auto",
          overflowX: isMobile ? "scroll" : "visible",
        }}
        numberPosition={isMobile ? "relative" : "absolute"}
        bottles={bottles}
        showBottleNumbers={showBottleNumbers}
        highlightBottleNumberIndex={imgIndex}
      />
      {!isMobile && (
        <div style={{ display: "flex", flexDirection: "row", gap: "1em" }}>
          <Form.Toggle
            checked={showBottleNumbers}
            onClick={() =>
              setShowBottleNumbers((showBottleNumbers) => !showBottleNumbers)
            }
            style={{
              opacity: showBottleNumbers ? 1 : 0.3,
            }}
          />

          <Text size="sm" prominent={showBottleNumbers}>
            ALWAYS SHOW BOTTLE NUMBERS
          </Text>
        </div>
      )}
    </div>
  );
};

export const dayDifference = (date1: Date, date2: Date) =>
  Math.ceil(Math.abs(date1.getTime() - date2.getTime()) / 1000 / 60 / 60 / 24);

export default Airdrop;
