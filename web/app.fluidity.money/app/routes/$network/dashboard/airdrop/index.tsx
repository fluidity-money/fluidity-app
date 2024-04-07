/* eslint-disable no-irregular-whitespace */

import type { LoaderFunction } from "@remix-run/node";

import { json } from "@remix-run/node";
import { useLoaderData, useLocation, useNavigate } from "@remix-run/react";
import BN from "bn.js";
import {
  Card,
  Heading,
  TextButton,
  LabelledValue,
  LinkButton,
  Text,
  Modal,
  HeroCarousel,
  ProgressBar,
  GeneralButton,
  ArrowRight,
  ArrowTopRight,
  Display,
  ProviderIcon,
  Provider,
  Form,
  CardModal,
  Rarity,
  TabButton,
  BloomEffect,
  toSignificantDecimals,
  numberToCommaSeparated,
  useViewport,
  numberToMonetaryString,
  toDecimalPlaces,
} from "@fluidity-money/surfing";
import {
  BottlesDetailsModal,
  BottleDistribution,
  ReferralDetailsModal,
  StakeNowModal,
  StakingStatsModal,
  TutorialModal,
  RecapModal,
  TestnetRewardsModal,
} from "./common";
import { motion } from "framer-motion";
import {
  useContext,
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
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
import { useFLYOwedForAddress } from "~/queries";
import config from "~/webapp.config.server";
import AugmentedToken from "~/types/AugmentedToken";
import FluidityFacadeContext from "contexts/FluidityFacade";
import { FlyStakingContext } from "contexts/FlyStakingProvider";
import { useCache } from "~/hooks/useCache";
import Table, { IRow } from "~/components/Table";
import { ReferralBottlesCountLoaderData } from "../../query/referralBottles";
import { HowItWorksContent } from "~/components/ReferralModal";
import JoeFarmlandsOrCamelotKingdom from "~/components/JoeFarmlandsOrCamelotKingdom";
import { redirect } from "react-router-dom";

export const EPOCH_CURRENT_IDENTIFIER = "epoch_3";

const AIRDROP_BLOG_POST =
  "https://blog.fluidity.money/announcing-the-fluidity-airdrop-and-ico-4c72172acb64";

const AIRDROP_TGE_CLAIM = "/arbitrum/dashboard/airdrop#recap";

const AIRDROP_MODALS = [
  "recap",
  "tutorial",
  "leaderboard",
  "referrals",
  "stake",
  "staking-stats",
  "claim",
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

  const redirectTarget = redirect("/");
  const ethereumWallets = config.config["ethereum"].wallets;

  if (!network || !Object.keys(config.drivers).includes(network)) {
    return redirectTarget;
  }

  return json({
    tokens: allowedTokens,
    network,
    ethereumWallets
  } satisfies LoaderData);
};

type LoaderData = {
  tokens: Array<Token>;
  network: string;
  ethereumWallets: typeof config.config["ethereum"]["wallets"],
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
  epochIdentifier: "",
  ethereumApplication: "none",
  epochFound: false,
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
  [Rarity.Common]: 39000000,
  [Rarity.Uncommon]: 7200000,
  [Rarity.Rare]: 500000,
  [Rarity.UltraRare]: 6400,
  [Rarity.Legendary]: 0,
};

const Airdrop = () => {
  const { tokens: defaultTokens, network } = useLoaderData<LoaderData>();

  const {
    address,
    balance,
    stakeTokens,
    testStakeTokens,
    getStakingRatios,
    redeemableTokens: getRedeemableTokens,
    getStakingDeposits,
    redeemTokens,
  } = useContext(FluidityFacadeContext);

  const { toggleVisibility: toggleStakingVisibility } = useContext(FlyStakingContext);

  if (network !== "arbitrum") {
    // assuming this is solana

    const [flyAmountOwed, setFLYAmountOwed] = useState(0);

    const [showTGEDetails, setShowTGEDetails] = useState(true);

    const [
      checkYourEligibilityButtonEnabled,
      setCheckYourEligibilityButtonEnabled,
    ] = useState(false);

    useEffect(() => {
      (async () => {
        if (address) {
          const resp = await useFLYOwedForAddress(address);
          if (!resp) {
            console.warn(`Invalid response for airdrop request: ${resp}`);
            return;
          }
          const { amount, error } = resp;
          if (error) throw new Error(`Airdrop request error: ${error}`);
          setFLYAmountOwed(amount);
          setCheckYourEligibilityButtonEnabled(true);
        }
      })();
    }, [address, useFLYOwedForAddress, setFLYAmountOwed]);

    const handleCheckEligibility = () => {
      // grey out the button here
      setCheckYourEligibilityButtonEnabled(false);

      // check if the request to get information on the airdrop is
      // done, if it is, then show the tge details
      setShowTGEDetails(false);
    };

    const ShowSolanaPrompt = () => {
      return (
        <div className="recap-fly-count-block">
          <div className="recap-fly-count-header">
            <Text size="md" code={true} as="p">
              FLUIDITY AIRDROP WAVE 1 & 2: ELIGIBILITY CHECK
            </Text>
            <Heading>The Fluidity $FLY-Wheel Begins</Heading>
          </div>
          <div className="recap-fly-count-thank-you-solana">
            <Text>
              Thank you for riding with us this Wave. It has come to an end,
              check your eligibility for rewards from your bottles, and how you
              surfed.
            </Text>
          </div>
          <div className="recap-fly-count-buttons-spread-container">
            <div className="recap-fly-count-buttons-spread">
              <GeneralButton
                handleClick={handleCheckEligibility}
                disabled={!checkYourEligibilityButtonEnabled}
              >
                Check your eligibility
              </GeneralButton>
              <GeneralButton
                handleClick={() => window?.open(AIRDROP_BLOG_POST, "_blank")}
                icon={<ArrowTopRight />}
              >
                See criteria
              </GeneralButton>
            </div>
          </div>
        </div>
      );
    };

    const YoureNotEligible = () => {
      return (
        <div className="recap-fly-count-block">
          <div className="recap-fly-count-header">
            <Text size="md" code={true} as="p">
              FLUIDITY AIRDROP WAVE 1 & 2
            </Text>
            <Heading>You are not eligible</Heading>
          </div>
          <div className="recap-fly-count-thank-you-solana">
            <Text>
              Keep transferring with Fluid Assets and participating in our
              upcoming Airdrops, to earn more rewards and multipliers! The next
              one will be even bigger!
            </Text>
          </div>
          <div className="recap-fly-count-buttons-spread-container">
            <div className="recap-fly-count-buttons-spread">
              <GeneralButton
                type="primary"
                icon={<ArrowTopRight />}
                layout="after"
                handleClick={() => window?.open(AIRDROP_BLOG_POST, "_blank")}
              >
                <Text size="sm" prominent code style={{ color: "inherit" }}>
                  Learn more
                </Text>
              </GeneralButton>
            </div>
          </div>
        </div>
      );
    };

    const YouAreEligible = () => {
      return (
        <div className="recap-fly-count-block-solana">
          <div className="recap-fly-count-header-solana">
            <Text size="md" code={true}>
              Congratulations! You are eligible to claim 25% of your tokens at TGE
            </Text>
            <Heading>$FLY {numberToCommaSeparated(flyAmountOwed)}</Heading>
            <Text>
              The association window for Solana users is now over. Please create
              a support ticket before the 2nd of April in the Discord (
              <a href="https://discord.gg/fluidity" rel="noopener noreferrer">
                https://discord.gg/fluidity
              </a>
              ) to receive your Solana airdrop.
            </Text>
            <div className="recap-you-are-eligible-claim-at-tge-button-container">
              <GeneralButton
                size="medium"
                type="secondary"
                className="recap-you-are-eligible-claim-at-tge-button rainbow"
                handleClick={() => window?.open(AIRDROP_TGE_CLAIM)}
              >
                <Text size="sm">
                  You will be able to claim your rewards at Fluidity&apos;s TGE
                  in the Arbitrum Portal &rarr;
                </Text>
              </GeneralButton>
            </div>
          </div>
          <div className="recap-fly-count-buttons-spread-container-solana">
            <LinkButton
              handleClick={() => window?.open(AIRDROP_BLOG_POST, "_blank")}
              color="white"
              size="medium"
              type="external"
            >
              Click here to learn more
            </LinkButton>
          </div>
        </div>
      );
    };

    const TGEDisplay = () => {
      return (
        <div className="recap-fly-count-child-solana">
          {(() => {
            switch (true) {
              case showTGEDetails:
                return <ShowSolanaPrompt />;
              case flyAmountOwed > 0:
                return <YouAreEligible />;
              default:
                return <YoureNotEligible />;
            }
          })()}
        </div>
      );
    };

    const [termsAndConditionsModalVis, setTermsAndConditionsModalVis] =
      useState(false);

    const closeWithEsc = useCallback(
      (event: { key: string }) => {
        event.key === "Escape" &&
          setTermsAndConditionsModalVis &&
          setTermsAndConditionsModalVis(false);
      },
      [termsAndConditionsModalVis, setTermsAndConditionsModalVis]
    );

    useEffect(() => {
      document.addEventListener("keydown", closeWithEsc);
      return () => document.removeEventListener("keydown", closeWithEsc);
    }, [termsAndConditionsModalVis, closeWithEsc]);

    return (
      <div className="pad-main">
        <Modal id="terms-and-conditions" visible={termsAndConditionsModalVis}>
          <div className="airdrop-terms-and-conditions-modal-container">
            <div className="airdrop-terms-and-conditions-modal-child">
              <div className="airdrop-terms-and-conditions-modal-navbar">
                <GeneralButton
                  size="medium"
                  handleClick={() => setTermsAndConditionsModalVis(false)}
                >
                  Close
                </GeneralButton>
              </div>
              <p>
                1. Description We may offer you the opportunity to receive some
                digital assets at no cost (**Airdrop**), subject to the terms
                described in this section. The Airdrop is delivered by us to
                you, but may be manufactured, offered and supported by the
                network creator or developer, if any, and not by us.
              </p>
              <p>
                1. Terms of Airdrop Program 2.1 No Purchase Necessary There is
                no purchase necessary to receive the Airdrop. However, you must
                have wallets recognised and accepted by us. Although we do not
                charge a fee for participation in the Airdrop Program, we
                reserve the right to do so in the future and shall provide prior
                notice to you in such case.
              </p>
              <p>
                2.2 Timing Each Airdrop may be subject to any additional terms
                and conditions and where applicable such terms and conditions
                shall be displayed and marked with an asterisk (*) or other
                similar notation.
              </p>
              <p>
                2.3 Limited Supply An offer to receive the digital assets in an
                Airdrop is only available to you while supplies last. Once the
                amount of digital asset offered by us in an Airdrop is
                exhausted, any party who has either been placed on a waitlist,
                or has completed certain additional steps, but not yet received
                notice of award of the asset in such Airdrop, shall no longer be
                eligible to receive the said digital assets in that Airdrop. We
                reserve the right, in our sole discretion, to modify or suspend
                any Airdrop requirements at any time without notice, including
                the amount previously advertised as available.
              </p>
              <p>
                2.4 Eligibility You may not be eligible to receive the digital
                assets or a select class and type of digital assets from an
                Airdrop in your jurisdiction. To the best of our understanding,
                below is a list of countries that does not recognise digital
                assets; *Afghanistan, Algeria, Egypt, Bangladesh, Bolivia,
                Burundi, Cameroon, Chad, China, Republic of Congo, Ethiopia,
                Gabon, Iraq, Lesotho, Libya, Macedonia, Morocco, Myanmar, Nepal,
                Qatar, Sierra Leone, Tunisia ** Kindly be advised that this list
                is for reference only and you are advised to seek independent
                legal advise as to your eligibility to receive the assets
                through Airdrop. **source - Library of Congress, Atlantic
                Council, Techopedia, Finder, Triple-A, Chainalysis*
              </p>
              <p>
                2.5 Notice of Award In the event you are selected to receive the
                digital asset in an Airdrop, we shall notify you of the pending
                delivery of such asset. Eligibility may be limited as to time.
                We are not liable to you for failure to receive any notice
                associated with the Airdrop Program.
              </p>
              <p>
                3 Risk Disclosures Relating to Airdrop Program You are solely
                responsible for researching and understanding the Fluid Assets
                token and it’s related utility and/or network subject to the
                Airdrop.
              </p>
            </div>
          </div>
        </Modal>
        <Heading as="h1" className="no-margin">
          Airdrop
        </Heading>
        <TGEDisplay />
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

  const { width } = useViewport();

  const navigate = useNavigate();

  const mobileBreakpoint = 768;

  const isMobile = width < mobileBreakpoint;

  const { data: airdropData } = useCache<AirdropLoaderData>(
    address
      ? `/${network}/query/dashboard/airdrop?address=${address}&epoch=${EPOCH_CURRENT_IDENTIFIER}`
      : ""
  );

  const currentApplication = "";

  const { data: airdropLeaderboardData } = useCache<AirdropLoaderData>(
    `/${network}/query/dashboard/airdropLeaderboard?period=${leaderboardFilterIndex === 0 ? "24" : "all"
    }&address=${address ?? ""}${leaderboardFilterIndex === 0 ? `&provider=${currentApplication}` : ""
    }&epoch=${EPOCH_CURRENT_IDENTIFIER}`
  );

  const { data: referralData } = useCache<AirdropLoaderData>(
    address
      ? `/${network}/query/referrals?address=${address}&epoch=${EPOCH_CURRENT_IDENTIFIER}`
      : ""
  );

  const { data: referralLootboxData } =
    useCache<ReferralBottlesCountLoaderData>(
      address
        ? `/${network}/query/referralBottles?address=${address}&epoch=${EPOCH_CURRENT_IDENTIFIER}`
        : ""
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
      epochDaysTotal,
      epochDaysElapsed,
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

  const fetchUserStakes = async (address: string) => {
    const stakingDeposits = (await getStakingDeposits?.(address)) ?? [];
    setStakes(stakingDeposits);
  };

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

    fetchUserStakes(address);

    fetchUserRedeemableTokens(address);
  }, [address]);

  // will throw error on revert
  const handleRedeemTokens = async () => {
    if (!address) return;

    const res = await (await redeemTokens?.())?.confirmTx();

    fetchUserTokenBalance();
    fetchUserStakes(address);
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
        className={`pad-main airdrop-header ${isMobile ? "airdrop-mobile" : ""
          }`}
      >
        <TabButton
          size="small"
          onClick={() => setCurrentModal("recap")}
          groupId="airdrop"
          isSelected={currentModal === "recap" || currentModal === "claim"}
        >
          TGE Claim
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
        <TabButton size="small" groupId="airdrop">
          <a
            href="https://dune.com/neogeo/fluidity-airdrop-v2"
            target="_blank"
            rel="noopener noreferrer"
          >
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
          className={`pad-main ${currentModal === "leaderboard" ? "airdrop-leaderboard-mobile" : ""
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
                  Airdrop V3: FLY Me To The Moon.
                </Heading>
                <Text>
                  Stake and trade your $FLY, fluidify your assets, transact them, and boost your rewards by
                  using trading on partnered protocols and staking liquidity right here on Fluidity! Keep an
                  eye on the leaderboard as you compete with fellow Surfers for the top spot! A new Layer of
                  rewards and utility is coming!

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
                        // TODO
                        "https://blog.fluidity.money",
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
                seeMyStakingStats={() => toggleStakingVisibility?.(true)}
                seeStakeNow={() => setCurrentModal("stake")}
                liquidityMultiplier={liquidityMultiplier}
                stakes={stakes}
                wethPrice={wethPrice}
                usdcPrice={1}
                isMobile
              />
            </>
          )}
          {(currentModal === "recap" || currentModal === "claim") && (
            <RecapModal
              totalVolume={2000000000}
              bottlesLooted={47000000}
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
                  fetchUserStakes(address ?? "");
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
      {currentModal === "recap" || currentModal === "claim" ? (
        <RecapModal
          totalVolume={2000000000}
          bottlesLooted={47000000}
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
            <div className="airdrop-image-banner">
              <img
                style={{
                  maxWidth: "1110px",
                  borderRadius: "10px",
                  borderStyle: "solid",
                  borderWidth: "1px",
                  borderColor: "white",
                }}
                width="100%"
                src="https://app-cdn.fluidity.money/images/epoch3AirdropBanner.png"
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
                  <div>
                    <Heading
                      as="h2"
                      className={"no-margin"}
                      style={{ marginBottom: "0.5em" }}
                    >
                      Airdrop V3: FLY Me To The Moon.
                    </Heading>
                  </div>
                  <Text style={{ fontSize: 14 }}>
                    Stake and trade your $FLY, fluidify your assets, transact them, and boost your rewards by
                    using trading on partnered protocols and staking liquidity right here on Fluidity! Keep an
                    eye on the leaderboard as you compete with fellow Surfers for the top spot! A new Layer of
                    rewards and utility is coming!
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
                          // TODO
                          "https://blog.fluidity.money/",
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
                  seeMyStakingStats={() => toggleStakingVisibility?.(true)}
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
  const epochDaysLeft = 89;
  const epochPercentage = 0;

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
  const [tasks, setTasks] = useState<"1x" | "12x">("12x");

  const providerLinks: { provider: Provider; link: string }[] = [
    { provider: "Uniswap", link: "https://app.uniswap.org/swap?outputCurrency=0x000F1720A263f96532D1ac2bb9CDC12b72C6f386&chain=arbitrum" },
    {
      provider: "Trader Joe",
      link: "https://traderjoexyz.com/arbitrum/trade?outputCurrency=0x000F1720A263f96532D1ac2bb9CDC12b72C6f386"
    },
    { provider: "Camelot", link: "https://app.camelot.exchange/" },
    {
      provider: "Ramses",
      link: "https://app.ramses.exchange/liquidity/v2/0x000F1720A263f96532D1ac2bb9CDC12b72C6f386"
    },
    { provider: "Jumper", link: "https://jumper.exchange/" },
  ];

  return (
    <Card fill color="holo" rounded className="multiplier-tasks">
      <div className="multiplier-tasks-header">
        <Text style={{ color: "black" }} bold size="md">
          Multiplier Tasks
        </Text>
        <Text size="xs" style={{ color: "black" }}>
          Transact FLY on listed platforms to earn more!
        </Text>
      </div>
      <div
        className="multiplier-tasks-multiplier"
        onClick={() => {
          setTasks((prev) => (prev === "1x" ? "12x" : "1x"));
        }}
        style={{ transform: "scale(0.6)" }}
      >
        <Form.Toggle
          color="black"
          direction="vertical"
          checked={tasks === "12x"}
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
      {tasks === "12x" && (
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
      <GeneralButton
        icon={<ArrowRight />}
        layout="after"
        size="small"
        type="secondary"
        handleClick={seeMyStakingStats}
        id="mx-see-my-staking-stats"
      >
        STAKE $FLY AND EARN
      </GeneralButton>
      <div>
        <div className="airdrop-arb-multipliers-container">
          <Heading as="h5">
            Provide $FLY and $ƒUSDC Liquidity to earn $ARB and Rewards!
          </Heading>
          <Text holo={true}>
            Add liquidity to Uniswap or the following Trader Joe and Camelot pools to earn Liquidity
            Mining rewards! You will also retroactively earn bottles depending on your contribution at
            the end of the Airdrop!
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
  const { user, rank, referralCount, fusdcEarned, arbEarned, flyStaked, bottles } = data;

  return {
    className: `airdrop-row ${isMobile ? "airdrop-mobile" : ""} ${address && address === user ? "highlighted-row" : ""
      }`,
    RowElement: ({ heading }: { heading: string }) => {
      switch (heading) {
        case "RANK":
          return (
            <td>
              <Text
                prominent
                style={
                  address && address === user
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
                rel="noopener noreferrer"
              >
                <Text
                  prominent
                  style={
                    address && address === user
                      ? {
                        color: "black",
                      }
                      : {}
                  }
                >
                  {address && address === user ? "ME" : trimAddress(user)}
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
                  address && address === user
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
                  address && address === user
                    ? {
                      color: "black",
                    }
                    : {}
                }
              >
                {numberToMonetaryString(fusdcEarned)}
              </Text>
            </td>
          );
        case "$ARB EARNED":
          return (
            <td>
              <Text
                prominent
                style={
                  address && address === user
                    ? {
                      color: "black",
                    }
                    : {}
                }
              >
                {toDecimalPlaces(arbEarned, 4)}
              </Text>
            </td>
          );
        case "$FLY STAKED":
          return (
            <td>
              <Text
                prominent
                style={
                  address && address === user
                    ? {
                      color: "black",
                    }
                    : {}
                }
              >
                {toDecimalPlaces(flyStaked, 4)}
              </Text>
            </td>
          );
        case "REFERRALS":
          return (
            <td>
              <Text
                prominent
                style={
                  address && address === user
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
      arbEarned: 0,
      flyStaked: 0,
    };

    data.push(userEntry);
  }

  return (
    <>
      <div className={`leaderboard-header ${isMobile ? "airdrop-mobile" : ""}`}>
        <div className="leaderboard-header-text">
          <div className="leaderboard-header-title-row">
            <Heading as="h3">Leaderboard</Heading>
          </div>
          <Text prominent>
            This leaderboard shows your rank among other users
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
          { name: "$FLY STAKED" },
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
          <img src="https://app-cdn.fluidity.money/images/hero/common.png" />
        </Card>
        <Card type="frosted" fill shimmer rounded>
          <img src="https://app-cdn.fluidity.money/images/hero/uncommon.png" />
        </Card>
        <Card type="frosted" fill shimmer rounded>
          <img src="https://app-cdn.fluidity.money/images/hero/rare.png" />
        </Card>
        <Card type="frosted" fill shimmer rounded>
          <img src="https://app-cdn.fluidity.money/images/hero/ultra_rare.png" />
        </Card>
        <Card type="frosted" fill shimmer rounded>
          <img src="https://app-cdn.fluidity.money/images/hero/legendary.png" />
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
