import type { LoaderFunction } from "@remix-run/node";

import { json } from "@remix-run/node";
import { useLoaderData, useLocation, useNavigate } from "@remix-run/react";
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
  RecapModal,
  stakingLiquidityMultiplierEq,
  TestnetRewardsModal,
} from "./common";
import { motion } from "framer-motion";
import { useContext, useState, useEffect, useRef, useMemo } from "react";
import {
  getAddressExplorerLink,
  getUsdFromTokenAmount,
  Token,
  trimAddress,
} from "~/util";
import airdropStyle from "~/styles/dashboard/airdrop.css";
import { AirdropLoaderData, BottleTiers } from "../../query/dashboard/airdrop";
import { AirdropLeaderboardLoaderData } from "../../query/dashboard/airdropLeaderboard";
import { ReferralCountLoaderData } from "../../query/referrals";
import { AirdropLeaderboardEntry } from "~/queries/useAirdropLeaderboard";
import config from "~/webapp.config.server";
import AugmentedToken from "~/types/AugmentedToken";
import FluidityFacadeContext from "contexts/FluidityFacade";
import { useCache } from "~/hooks/useCache";
import Table, { IRow } from "~/components/Table";
import { ReferralBottlesCountLoaderData } from "../../query/referralBottles";
import { HowItWorksContent } from "~/components/ReferralModal";
import JoeFarmlandsOrCamelotKingdom from "~/components/JoeFarmlandsOrCamelotKingdom";
import { LootboxConfig } from "~/queries/useLootboxConfig";

const EPOCH_CURRENT_IDENTIFIER = "epoch_1";

const AIRDROP_MODALS = [
  "recap",
  "tutorial",
  "leaderboard",
  "referrals",
  "stake",
  "staking-stats",
];

type AirdropModalName = (typeof AIRDROP_MODALS)[number];

type RedeemableToken = {
  tokenId: string;
  amount: BN;
  decimals: number;
};

export const links = () => {
  return [{ rel: "stylesheet", href: airdropStyle }];
};

export const loader: LoaderFunction = async ({ params }) => {
  const network = params.network ?? "";

  // Staking Tokens
  const allowedTokenSymbols = new Set(["fUSDC", "USDC", "wETH"]);
  const { tokens } = config.config[network];

  const allowedTokens = tokens.filter(({ symbol }) =>
    allowedTokenSymbols.has(symbol)
  );

  return json({
    tokens: allowedTokens,
    network,
  } satisfies LoaderData);
};

type LoaderData = {
  tokens: Array<Token>;
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
  wethPrice: 0,
  usdcPrice: 0,
  programBegin: new Date("2023-05-01T12:00:00+02:00"),
  programEnd: new Date("2023-06-28 T12:00:00+02:00"),
  epochDaysTotal: 30,
  epochDaysElapsed: 30,
  epochIdentifier: "epoch_1",
  ethereumApplication: "none",
  epochFound: false,
  loaded: false
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

const SAFE_DEFAULT_REFERRAL_LOOTBOTTLES: ReferralBottlesCountLoaderData = {
  bottleTiers: {
    [Rarity.Common]: 0,
    [Rarity.Uncommon]: 0,
    [Rarity.Rare]: 0,
    [Rarity.UltraRare]: 0,
    [Rarity.Legendary]: 0,
  },
  bottlesCount: 0,
  loaded: false,
};

const GLOBAL_AIRDROP_BOTTLE_TIERS = {
  [Rarity.Common]: 327394,
  [Rarity.Uncommon]: 83233,
  [Rarity.Rare]: 11010,
  [Rarity.UltraRare]: 812,
  [Rarity.Legendary]: 5,
};

const Airdrop = () => {
  const { tokens: defaultTokens, network } = useLoaderData<LoaderData>();

  if (network !== "arbitrum") {
    return (
      <div className="pad-main">
        <Heading as="h1" className="no-margin">
          Airdrop
        </Heading>
        <Text>
          Wrap, Transact and Earn using $fUSDC, provide liquidity for even more rewards!
        </Text>
      </div>
    );
  }

  const [redeemableTokens, setRedeemableTokens] = useState<RedeemableToken[]>(
    []
  );

  const redeemableTokensUsd = useMemo(
    () =>
      redeemableTokens.reduce(
        (sum, { amount, decimals }) =>
          sum + getUsdFromTokenAmount(amount, decimals),
        0
      ),
    [redeemableTokens]
  );

  const [tokens, setTokens] = useState<AugmentedToken[]>(
    defaultTokens.map((tok) => ({ ...tok, userTokenBalance: new BN(0) }))
  );

  const [leaderboardFilterIndex, setLeaderboardFilterIndex] = useState(1);

  const {
    address,
    balance,
    stakeTokens,
    getStakingDeposits,
    testStakeTokens,
    getStakingRatios,
    redeemableTokens: getRedeemableTokens,
    redeemTokens,
  } = useContext(FluidityFacadeContext);

  const { width } = useViewport();

  const navigate = useNavigate();

  const mobileBreakpoint = 768;

  const isMobile = width < mobileBreakpoint;

  const { data: airdropData } = useCache<AirdropLoaderData>(
    address ? `/${network}/query/dashboard/airdrop?address=${address}&epoch=${EPOCH_CURRENT_IDENTIFIER}` : ""
  );

  const { data: airdropLeaderboardData } = useCache<AirdropLoaderData>(
    `/${network}/query/dashboard/airdropLeaderboard?period=${
      leaderboardFilterIndex === 0 ? "24" : "all"
    }&address=${address ?? ""}${
      leaderboardFilterIndex === 0 ? "&provider=${currentApplication}" : ""
    }&epoch=${EPOCH_CURRENT_IDENTIFIER}`
  );

  const { data: referralData } = useCache<AirdropLoaderData>(
    address ? `/${network}/query/referrals?address=${address}&epoch=${EPOCH_CURRENT_IDENTIFIER}` : ""
  );

  const { data: referralLootboxData } =
    useCache<ReferralBottlesCountLoaderData>(
      address ? `/${network}/query/referralBottles?address=${address}&epoch=${EPOCH_CURRENT_IDENTIFIER}` : ""
    );

  const data = {
    airdrop: {
      ...SAFE_DEFAULT_AIRDROP,
      ...airdropData,
    },
    airdropLeaderboard: {
      ...SAFE_DEFAULT_AIRDROP_LEADERBOARD,
      ...airdropLeaderboardData,
    },
    referrals: {
      ...SAFE_DEFAULT_REFERRALS,
      ...referralData,
    },
    referralBottles: {
      ...SAFE_DEFAULT_REFERRAL_LOOTBOTTLES,
      ...referralLootboxData,
    },
  };

  const {
    airdrop: {
      bottleTiers,
      liquidityMultiplier,
      bottlesCount,
      wethPrice,
      usdcPrice,
      programBegin,
      programEnd,
      epochDaysTotal,
      epochDaysElapsed,
      epochIdentifier,
      ethereumApplication,
      epochFound,
    },
    referrals: {
      numActiveReferreeReferrals,
      numActiveReferrerReferrals,
      numInactiveReferreeReferrals,
      inactiveReferrals,
      referralCode,
    },
    airdropLeaderboard: {
      leaderboard: leaderboardRows,
      loaded: leaderboardLoaded,
    },
    referralBottles: {
      bottleTiers: referralBottleTiers,
      bottlesCount: referralBottlesCount,
    },
  } = data;

  const location = useLocation();

  const destModal = location.hash.replace("#", "");

  const [currentModal, setCurrentModal] = useState<AirdropModalName | null>(
    isAirdropModal(destModal) ? destModal : null
  );

  useEffect(() => {
    if (destModal === currentModal) return;
    setCurrentModal(isAirdropModal(destModal) ? destModal : null);
  }, [location.hash]);

  const [stakes, setStakes] = useState<
    Array<{
      fluidAmount: BN;
      baseAmount: BN;
      durationDays: number;
      depositDate: Date;
    }>
  >([]);

  const fetchUserTokenBalance = async () => {
    const userTokenBalance = await Promise.all(
      tokens.map(async ({ address }) => (await balance?.(address)) || new BN(0))
    );

    return setTokens(
      tokens.map((token, i) => ({
        ...token,
        userTokenBalance: userTokenBalance[i],
      }))
    );
  };

  const fetchUserRedeemableTokens = async (address: string) => {
    const redeemableTokens = await getRedeemableTokens?.(address);

    if (!redeemableTokens) return;

    return setRedeemableTokens(
      Object.entries(redeemableTokens)
        .map(([key, amount]) => {
          // Get rid of 'Redeemable' in key
          const tokenSymbol = key.slice(0, -10).toLowerCase();
          const matchingToken = tokens.find(
            ({ symbol }) => symbol.toLowerCase() === tokenSymbol
          );

          if (!matchingToken)
            return {
              tokenId: "",
              amount: new BN(0),
              decimals: 0,
            };

          return {
            tokenId: matchingToken.symbol,
            amount: amount,
            decimals: matchingToken.decimals,
          };
        })
        .filter(({ tokenId, amount }) => !!tokenId && amount.gt(new BN(0)))
    );
  };

  useEffect(() => {
    if (!currentModal) {
      navigate(`${location.pathname}${location.search}`, { replace: true });
      return;
    }
    navigate(`#${currentModal}`, { replace: true });
  }, [currentModal]);

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

    fetchUserTokenBalance();

    fetchUserRedeemableTokens(address);
  }, [address]);

  // will throw error on revert
  const handleRedeemTokens = async () => {
    if (!address) return;

    const res = await (await redeemTokens?.())?.confirmTx();

    fetchUserTokenBalance();
    fetchUserRedeemableTokens(address);

    return res;
  };

  const [localCookieConsent, setLocalCookieConsent] = useState<
    boolean | undefined
  >(false);

  const setLocalBottleCount = useState<number | undefined>(undefined)[1];

  const [localShouldShowBottleNumbers, setLocalShouldShowBottleNumbers] =
    useState<boolean | undefined>(undefined);

  const [localShouldShowTutorial, setLocalShouldShowTutorial] = useState<
    boolean | undefined
  >(undefined);

  const [localShouldShowRecapIntro, setLocalShouldShowRecapIntro] = useState<
    boolean | undefined
  >(undefined);

  useEffect(() => {
    if (!window) return;
    const cookieConsent = window.localStorage.getItem("cookieConsent");

    if (cookieConsent === "false") {
      setLocalCookieConsent(false);
      return;
    } else {
      setLocalCookieConsent(true);
    }

    const airdropHasVisited = window.localStorage.getItem("airdropHasVisited");

    const airdropBottleCount =
      window.localStorage.getItem("airdropBottleCount");

    const airdropShouldShowBottleNumbers = window.localStorage.getItem(
      "airdropShouldShowBottleNumbers"
    );

    if (airdropBottleCount) {
      setLocalBottleCount(parseInt(airdropBottleCount));
    } else {
      setLocalBottleCount(0);
    }

    if (airdropShouldShowBottleNumbers) {
      setLocalShouldShowBottleNumbers(
        airdropShouldShowBottleNumbers === "true"
      );
    } else {
      setLocalShouldShowBottleNumbers(true);
    }

    const airdropShouldShowRecapIntro = window.localStorage.getItem(
      "airdropShouldShowRecapIntro"
    );

    setLocalShouldShowRecapIntro(!airdropShouldShowRecapIntro);
    setLocalShouldShowTutorial(!airdropHasVisited);
  }, []);

  useEffect(() => {
    if (!window || !localCookieConsent) return;
    if (localShouldShowBottleNumbers === undefined) return;
    window.localStorage.setItem(
      "airdropShouldShowBottleNumbers",
      localShouldShowBottleNumbers.toString()
    );
  }, [localShouldShowBottleNumbers]);

  useEffect(() => {
    if (!window || !localCookieConsent) return;
    if (localShouldShowRecapIntro !== false) return;
    window.localStorage.setItem("airdropShouldShowRecapIntro", "false");
    setLocalShouldShowRecapIntro(false);
  }, [localShouldShowRecapIntro]);

  useEffect(() => {
    if (!window || !localCookieConsent) return;
    if (localShouldShowTutorial === undefined) return;
    window.localStorage.setItem("airdropHasVisited", "true");

    const urlParams = new URLSearchParams(window.location.search);
    const hasUrlParams = urlParams.toString().length > 0;

    if (localShouldShowTutorial && !isMobile && !hasUrlParams) {
      setTimeout(() => {
        setCurrentModal("tutorial");
      }, 2000);
    }
  }, [localShouldShowTutorial]);

  const leaderboardRef = useRef<HTMLDivElement>(null);

  const Header = () => {
    return (
      <div
        className={`pad-main airdrop-header ${
          isMobile ? "airdrop-mobile" : ""
        }`}
      >
        <TabButton
          size="small"
          onClick={() => setCurrentModal("recap")}
          groupId="airdrop"
          isSelected={currentModal === "recap"}
        >
          Epoch 1 Recap
        </TabButton>
        <TabButton
          size="small"
          onClick={() => setCurrentModal(null)}
          groupId="airdrop"
          isSelected={
            isMobile ? currentModal === null : currentModal !== "recap"
          }
        >
          Airdrop Dashboard
        </TabButton>
        <TabButton
          size="small"
          onClick={() => setCurrentModal("tutorial")}
          groupId="airdrop"
          isSelected={isMobile && currentModal === "tutorial"}
        >
          Airdrop Tutorial
        </TabButton>
        <TabButton
          size="small"
          onClick={async () => {
            if (!isMobile) {
              if (currentModal !== null) {
                setCurrentModal(null);
                await new Promise((resolve) => setTimeout(resolve, 1000));
              }

              leaderboardRef.current?.scrollIntoView({
                block: "start",
                behavior: "smooth",
              });
            } else {
              setCurrentModal("leaderboard");
            }
          }}
          groupId="airdrop"
          isSelected={isMobile && currentModal === "leaderboard"}
        >
          Leaderboard
        </TabButton>
        <TabButton
          size="small"
          onClick={() => setCurrentModal("referrals")}
          groupId="airdrop"
          isSelected={isMobile && currentModal === "referrals"}
        >
          Referrals
        </TabButton>
        <TabButton
          size="small"
          onClick={() => setCurrentModal("testnet-rewards")}
          groupId="airdrop"
          isSelected={isMobile && currentModal === "testnet-rewards"}
        >
          Testnet Rewards
        </TabButton>
        <TabButton
          size="small"
          groupId="airdrop"
        >
          <a href="https://dune.com/neogeo/fluidity-airdrop-v2" target="_blank">
            Dune
          </a>
        </TabButton>
      </div>
    );
  };

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
              currentModal === "tutorial" ||
              currentModal === "leaderboard" ||
              currentModal === "stake"
                ? "0.5em"
                : currentModal === "referrals"
                ? "1em"
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
                  Airdrop V2: Arbitrum&apos;s Space Expedition.
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
                <BottleProgress
                  bottles={bottleTiers}
                  isMobile
                  shouldShowBottleNumbers={
                    localShouldShowBottleNumbers === undefined
                      ? true
                      : localShouldShowBottleNumbers
                  }
                  setShouldShowBottleNumbers={setLocalShouldShowBottleNumbers}
                />
              </div>
              <AirdropStats
                seeReferralsDetails={() => setCurrentModal("referrals")}
                seeBottlesDetails={() => setCurrentModal("bottles-details")}
                seeLeaderboardMobile={() => setCurrentModal("leaderboard")}
                epochMax={epochDaysTotal}
                epochDays={epochDaysElapsed}
                activatedReferrals={numActiveReferrerReferrals}
                totalBottles={bottlesCount}
                network={network}
                navigate={navigate}
                isMobile
              />
              <MultiplierTasks />
              <MyMultiplier
                seeMyStakingStats={() => {
                  setCurrentModal("stake");
                  // would just useRef here but the ref doesn't exist at this point
                  // timeout is needed to counterract the scroll to top
                  setTimeout(() => {
                    window.scrollTo(0, 1000);
                  }, 500);
                }}
                seeStakeNow={() => setCurrentModal("stake")}
                liquidityMultiplier={liquidityMultiplier}
                stakes={stakes}
                wethPrice={wethPrice}
                usdcPrice={1}
                isMobile
              />
            </>
          )}
          {currentModal === "recap" && (
            <RecapModal
              totalVolume={11390000}
              bottlesLooted={424781}
              bottles={GLOBAL_AIRDROP_BOTTLE_TIERS}
              userRecap={{
                bottles: SAFE_DEFAULT_AIRDROP.bottleTiers,
                bottlesEarned: 0,
                multiplier: 0,
                linksClicked: 0,
                referees: 0,
                referralBottles: 0,
              }}
              isMobile={isMobile}
              shouldShowIntro={localShouldShowRecapIntro}
              onIntroFinished={() => setLocalShouldShowRecapIntro(false)}
              navigate={navigate}
            />
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
                loaded={leaderboardLoaded}
                data={leaderboardRows}
                filterIndex={leaderboardFilterIndex}
                setFilterIndex={setLeaderboardFilterIndex}
                userAddress={address || ""}
                isMobile
              />
            </>
          )}
          {currentModal === "stake" && (
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
                stakeCallback={() => {
                  fetchUserTokenBalance();
                }}
              />
              <Heading as="h3">My Staking Stats</Heading>
              <StakingStatsModal
                liqudityMultiplier={liquidityMultiplier}
                stakes={stakes}
                wethPrice={wethPrice}
                usdcPrice={usdcPrice}
                redeemableUsd={redeemableTokensUsd}
                redeemableTokens={redeemableTokens}
                handleRedeemTokens={handleRedeemTokens}
              />
            </>
          )}
          {currentModal === "referrals" && (
            <>
              <Heading as="h3" className="no-margin">
                My Referral Link
              </Heading>
              <ReferralDetailsModal
                referralCode={referralCode}
                bottles={referralBottleTiers}
                totalBottles={referralBottlesCount}
                activeReferrerReferralsCount={numActiveReferrerReferrals}
                activeRefereeReferralsCount={numActiveReferreeReferrals}
                inactiveReferrerReferralsCount={numInactiveReferreeReferrals}
                nextInactiveReferral={inactiveReferrals[0]}
                isMobile
                showCopyGroup
              />
              <div
                style={{
                  width: "100%",
                  borderBottom: "1px solid grey",
                }}
              />
              <Display size="xxxs">How It Works</Display>
              <HowItWorksContent isMobile />
            </>
          )}
          {currentModal === "testnet-rewards" && (
            <>
              <TestnetRewardsModal />
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
        visible={currentModal === "referrals"}
        closeModal={closeModal}
        style={{ gap: "1em" }}
      >
        <ReferralDetailsModal
          bottles={referralBottleTiers}
          totalBottles={referralBottlesCount}
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
        <BottlesDetailsModal
          bottles={bottleTiers}
          navigate={navigate}
          network={network}
        />
      </CardModal>
      <CardModal
        id="stake"
        visible={currentModal === "stake"}
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
          stakeCallback={() => {
            fetchUserTokenBalance();
          }}
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
          redeemableUsd={redeemableTokensUsd}
          redeemableTokens={redeemableTokens}
          handleRedeemTokens={handleRedeemTokens}
        />
      </CardModal>
      <CardModal
        id="tutorial"
        visible={currentModal === "tutorial"}
        closeModal={closeModal}
      >
        <TutorialModal closeModal={closeModal} />
      </CardModal>
      <CardModal
        id="testnet-rewards"
        visible={currentModal === "testnet-rewards"}
        closeModal={closeModal}
      >
        <TestnetRewardsModal />
      </CardModal>

      {/* Page Content */}
      <Header />
      {currentModal === "recap" ? (
        <RecapModal
          totalVolume={11390000}
          bottlesLooted={424781}
          bottles={GLOBAL_AIRDROP_BOTTLE_TIERS}
          userRecap={{
            bottles: SAFE_DEFAULT_AIRDROP.bottleTiers,
            bottlesEarned: 0,
            multiplier: 0,
            linksClicked: 0,
            referees: 0,
            referralBottles: 0,
          }}
          isMobile={isMobile}
          shouldShowIntro={localShouldShowRecapIntro}
          onIntroFinished={() => setLocalShouldShowRecapIntro(false)}
          navigate={navigate}
        />
      ) : (
        <>
          <div className="pad-main">
            <div style={{ paddingTop: "10px", paddingBottom: "20px" }}>
              <img
                style={{
                  maxWidth: "1110px",
                  borderRadius: "10px",
                  borderStyle: "solid",
                  borderWidth: "1px",
                  borderColor: "white"
                }}
                width="100%"
                src="/images/epoch2AirdropBanner.png"
              />
            </div>
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
                    Airdrop V2: Arbitrum&apos;s Space Expedition.
                  </Heading>
                  <Text style={{ fontSize: 14 }}>
                    Fluidify your assets, transact them, and boost your rewards
                    by using your Fluid Assets on partnered protocols and
                    staking liquidity right here on Fluidity! Keep an eye on the
                    leaderboard as you compete with fellow Fluiders for the top
                    spot. Future Fluid Governance Tokens await!
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
                      Learn more
                    </LinkButton>
                  </Text>
                </div>
                <AirdropStats
                  seeReferralsDetails={() => setCurrentModal("referrals")}
                  seeBottlesDetails={() => setCurrentModal("bottles-details")}
                  seeLeaderboardMobile={() => setCurrentModal("leaderboard")}
                  epochMax={epochDaysTotal}
                  epochDays={epochDaysElapsed}
                  activatedReferrals={numActiveReferrerReferrals}
                  totalBottles={bottlesCount}
                  network={network}
                  navigate={navigate}
                />
                <MultiplierTasks />
                <MyMultiplier
                  seeMyStakingStats={() => setCurrentModal("staking-stats")}
                  seeStakeNow={() => setCurrentModal("stake")}
                  liquidityMultiplier={liquidityMultiplier}
                  stakes={stakes}
                  wethPrice={wethPrice}
                  usdcPrice={usdcPrice}
                />
              </div>
              <BottleProgress
                shouldShowBottleNumbers={
                  localShouldShowBottleNumbers === undefined
                    ? true
                    : localShouldShowBottleNumbers
                }
                setShouldShowBottleNumbers={setLocalShouldShowBottleNumbers}
                bottles={bottleTiers}
              />
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
              icon={<ArrowRight />}
              className="scroll-to-leaderboard-button"
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
                loaded={leaderboardLoaded}
                data={leaderboardRows}
                filterIndex={leaderboardFilterIndex}
                setFilterIndex={setLeaderboardFilterIndex}
                userAddress={address || ""}
              />
            </Card>
          </div>
        </>
      )}
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
  network: string;
  navigate: (path: string) => void;
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
  network,
  navigate,
  isMobile,
}: IAirdropStats) => {
  const dayDiff = epochMax - epochDays;
  const epochDaysLeft = dayDiff > 0 ? dayDiff : 0;
  const percentage = Math.floor((epochDays / epochMax) * 100);
  const epochPercentage = percentage < 100 ? percentage : 100;

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
            {epochDaysLeft}
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
          <Text>{epochPercentage}%</Text>
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
            {Math.round(totalBottles * 100) / 100}
          </Text>
        </LabelledValue>
        <LinkButton
          color="gray"
          size="small"
          type="internal"
          handleClick={
            isMobile
              ? () => {
                  navigate(`/${network}/dashboard/rewards`);
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

  const providerLinks: { provider: Provider; link: string }[] = [
    { provider: "Jumper", link: "https://app.uniswap.org/#/swap" },
    {
      provider: "Uniswap",
      link: "https://app.uniswap.org/#/swap"
    },
    { provider: "Trader Joe", link: "https://app.camelot.exchange/" },
    { provider: "Camelot", link: "https://saddle.exchange/#/" },
    { provider: "Sushiswap", link: "https://app.chronos.exchange/" },
    {
      provider: "Ramses",
      link: "https://kyberswap.com/swap/arbitrum/fusdc-to-usdc",
    },
  ];

  return (
    <Card fill color="holo" rounded className="multiplier-tasks">
      <div className="multiplier-tasks-header">
        <Text style={{ color: "black" }} bold size="md">
          Multiplier Tasks
        </Text>
        <Text size="xs" style={{ color: "black" }}>
          Transact fUSDC on listed platforms to earn more!
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
          {providerLinks.map(({ provider, link }, i) => {
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
                href={link}
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
  stakes,
  wethPrice,
  usdcPrice,
  isMobile = false,
}: IMyMultiplier) => {
  const sumLiquidityMultiplier = stakes.reduce(
    (sum, { fluidAmount, baseAmount, durationDays, depositDate }) => {
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

      const stakedDays = dayDifference(new Date(), new Date(depositDate));

      const multiplier = stakingLiquidityMultiplierEq(stakedDays, durationDays);

      return sum + (fluidUsd + baseUsd) * multiplier;
    },
    0
  );

  // if there are no stakes, this renders an empty stake on the dashboard which is A PART OF THE DESIGN SPEC
  if (stakes.length === 0)
    stakes = [
      {
        fluidAmount: new BN(0),
        baseAmount: new BN(0),
        durationDays: 0,
        depositDate: new Date(),
      },
    ];

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
      <GeneralButton
        icon={<ArrowRight />}
        layout="after"
        size="small"
        type="secondary"
        handleClick={seeMyStakingStats}
        id="mx-see-my-staking-stats"
      >
        MY EPOCH 1 STAKING STATS
      </GeneralButton>
      <div>
        <div className="airdrop-arb-multipliers-container">
          <Text size="md" holo={true}>
            Provide $fUSDC Liquidity to earn $ARB and Multipliers!
          </Text>
        </div>
        <JoeFarmlandsOrCamelotKingdom />
      </div>
    </div>
  );
};

const airdropRankRow = (
  data: AirdropLeaderboardEntry,
  isMobile = false
): IRow => {
  const { address } = useContext(FluidityFacadeContext);
  const { user, rank, referralCount, fusdcEarned, arbEarned, bottles } = data;

  return {
    className: `airdrop-row ${isMobile ? "airdrop-mobile" : ""} ${
      address === user ? "highlighted-row" : ""
    }`,
    RowElement: ({ heading }: { heading: string }) => {
      switch (heading) {
        case "RANK":
          return (
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
          );
        case "USER":
          return (
            <td>
              <a
                className="table-address"
                target="_blank"
                href={getAddressExplorerLink("arbitrum", user)}
                rel="noreferrer"
              >
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
              </a>
            </td>
          );
        case "BOTTLES":
          return (
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
          );
        case "$fUSDC EARNED":
          return (
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
                {fusdcEarned}
              </Text>
            </td>
          );
        case "$ARB EARNED":
          return (
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
                {arbEarned}
              </Text>
            </td>
          );
        case "REFERRALS":
          return (
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
          );
        default:
          return <></>;
      }
    },
  };
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
  if (
    loaded &&
    userAddress &&
    !data.find((entry) => entry.user === userAddress)
  ) {
    const userEntry = {
      user: userAddress,
      rank: -1,
      referralCount: 0,
      liquidityMultiplier: 0,
      bottles: 0,
      highestRewardTier: 0,
      fusdcEarned: 0,
      arbEarned: 0
    };

    data.push(userEntry);
  }

  return (
    <>
      <div className={`leaderboard-header ${isMobile ? "airdrop-mobile" : ""}`}>
        <div className="leaderboard-header-text">
          <div className="leaderboard-header-title-row">
            <Heading as="h3">Leaderboard</Heading>
            {filterIndex === 0 && (
              <GeneralButton
                icon={<ProviderIcon provider="Kyber" />}
                type="secondary"
                disabled
                className="leaderboard-provider-button"
              >
                <Text code style={{ color: "inherit" }}>
                  KYBERSWAP
                </Text>
              </GeneralButton>
            )}
          </div>
          <Text prominent>
            This leaderboard shows your rank among other users
            {filterIndex === 0 ? " using KyberSwap " : " "}
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
          {/* <GeneralButton
            type={filterIndex === 0 ? "primary" : "transparent"}
            handleClick={() => setFilterIndex(0)}
            icon={<ProviderIcon provider="Kyber" />}
          >
            <Text code size="sm" style={{ color: "inherit" }}>
              24 HOURS
            </Text>
          </GeneralButton> */}
          <GeneralButton
            type={filterIndex === 1 ? "primary" : "transparent"}
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
          { name: "$fUSDC EARNED" },
          { name: "$ARB EARNED" },
          { name: "REFERRALS" },
        ]}
        pagination={{
          paginate: false,
          page: 1,
          rowsPerPage: 11,
        }}
        count={0}
        data={data}
        renderRow={(data) => airdropRankRow(data, isMobile)}
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
  shouldShowBottleNumbers,
  setShouldShowBottleNumbers,
}: {
  bottles: BottleTiers;
  isMobile?: boolean;
  shouldShowBottleNumbers: boolean;
  setShouldShowBottleNumbers: (shouldShow: boolean) => void;
}) => {
  const [imgIndex, setImgIndex] = useState(0);

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
        showBottleNumbers={shouldShowBottleNumbers}
        highlightBottleNumberIndex={imgIndex}
      />
      {!isMobile && (
        <div style={{ display: "flex", flexDirection: "row", gap: "1em" }}>
          <Form.Toggle
            checked={shouldShowBottleNumbers}
            onClick={() => setShouldShowBottleNumbers(!shouldShowBottleNumbers)}
            style={{
              opacity: shouldShowBottleNumbers ? 1 : 0.3,
            }}
          />

          <Text size="sm" prominent={shouldShowBottleNumbers}>
            ALWAYS SHOW BOTTLE NUMBERS
          </Text>
        </div>
      )}
    </div>
  );
};

export const dayDifference = (date1: Date, date2: Date) =>
  Math.round(Math.abs(date1.valueOf() - date2.valueOf()) / 1000 / 60 / 60 / 24);

const isAirdropModal = (modal: string): modal is AirdropModalName =>
  AIRDROP_MODALS.includes(modal as AirdropModalName);

export default Airdrop;
