import type { ReferralCountLoaderData } from "./query/referrals";
import type { ReferralCodeLoaderData } from "./query/referralCode";
import type { UnclaimedRewardsLoaderData } from "./query/dashboard/unclaimedRewards";

import {
  json,
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";

import {
  Link,
  Outlet,
  useLoaderData,
  useNavigate,
  useResolvedPath,
  useMatches,
  useLocation,
  useTransition,
} from "@remix-run/react";
import { useCache } from "~/hooks/useCache";
import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { networkMapper } from "~/util";
import FluidityFacadeContext from "contexts/FluidityFacade";
import config from "~/webapp.config.server";
import {
  AirdropIcon,
  DashboardIcon,
  GeneralButton,
  Trophy,
  FlyIcon,
  StakeIcon,
  Text,
  Heading,
  ChainSelectorButton,
  BlockchainModal,
  numberToMonetaryString,
  useViewport,
  ConnectedWalletModal,
  ConnectedWallet,
  Modal,
  ProvideLiquidity,
  BurgerMenu,
  Referral,
  CardModal,
  ArrowUp,
  ArrowDown,
} from "@fluidity-money/surfing";
import { chainType } from "~/util/chainUtils/chains";
import ConnectWalletModal from "~/components/ConnectWalletModal";
import MobileModal from "~/components/MobileModal";
import UnclaimedRewardsHoverModal from "~/components/UnclaimedRewardsHoverModal";
import ReferralModal from "~/components/ReferralModal";
import AcceptReferralModal from "~/components/AcceptReferralModal";
import { getProviderDisplayName } from "~/util/provider";

import dashboardStyles from "~/styles/dashboard.css";
import referralModalStyles from "~/components/ReferralModal/referralModal.css";
import { UIContext } from "contexts/UIProvider";
import { FlyStakingContext } from "contexts/FlyStakingProvider";
import { FlyStakingStatsModal } from "~/components/FLYStakingStatsModal";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: dashboardStyles },
    { rel: "stylesheet", href: referralModalStyles },
  ];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const ethereumWallets = config.config["ethereum"].wallets ?? [];

  const network = params.network ?? "";

  const provider = config.liquidity_providers;

  // Sanitize names from config with Provider names
  Object.keys(provider).forEach((chain) => {
    provider[chain].providers.forEach((provider) => {
      provider.name = getProviderDisplayName(provider.name);
    });
  });

  const tokensConfig = config.config;

  // Get referral code, if any
  const url = new URL(request.url);
  const referralCode = url.searchParams.get("referral_code") ?? "";

  return json({
    network,
    provider,
    tokensConfig,
    ethereumWallets,
    referralCode,
  } satisfies LoaderData);
};

function ErrorBoundary() {
  return (
    <div
      className="pad-main"
      style={{
        paddingTop: "40px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img src="https://app-cdn.fluidity.money/images/logoMetallic.png" alt="" style={{ height: "40px" }} />
      <h1>Could not load Dashboard!</h1>
      <br />
      <h2>Our team has been notified, and are working on fixing it!</h2>
    </div>
  );
}

export const meta: MetaFunction = () => ({
  title: "Fluidity - Dashboard",
});

type LoaderData = {
  network: string;
  provider: {
    [x: string]: {
      providers: {
        name: string;
        link: {
          fUSDC?: string;
          fUSDT?: string;
          fTUSD?: string;
          fFRAX?: string;
          fDAI?: string;
        };
      }[];
    };
  };
  tokensConfig: {
    [x: string]: {
      tokens: {
        symbol: string;
        address: string;
        name: string;
        logo: string;
        colour: string;
        isFluidOf?: string;
        obligationAccount?: string;
        dataAccount?: string;
        decimals: number;
        userMintLimit?: number;
      }[];
    };
  };
  ethereumWallets: {
    name: string;
    id: string;
    description?: string;
    logo: string;
  }[];
  referralCode: string;
};

const airdropTab = [
  {
    airdrop: {
      name: "airdrop",
      path: (network: string) => `/${network}/dashboard/airdrop`,
      icon: <AirdropIcon />,
    },
  },
];

const NAVIGATION_MAP: {
  [key: string]: {
    name: string;
    path: (network: string) => string;
    icon: JSX.Element;
  };
}[] = [
  ...airdropTab,
  {
    home: {
      name: "dashboard",
      path: (network: string) => `/${network}/dashboard/home`,
      icon: <DashboardIcon />,
    },
  },
  {
    rewards: {
      name: "rewards",
      path: (network: string) => `/${network}/dashboard/rewards`,
      icon: <Trophy />,
    },
  },
];

const CHAIN_NAME_MAP: Record<
  string,
  { name: string; icon: JSX.Element; disabled?: boolean }
> = {
  arbitrum: {
    name: "ARB",
    icon: <img src="https://app-cdn.fluidity.money/assets/chains/arbIcon.svg" />,
  },
  solana: {
    name: "SOL",
    icon: <img src="https://app-cdn.fluidity.money/assets/chains/solanaIcon.svg" />,
  },
  sui: {
    name: "SUI",
    icon: <img src="https://app-cdn.fluidity.money/assets/chains/suiIcon.svg" />,
  },
};

const SAFE_DEFAULT_REFERRAL_COUNT = {
  numActiveReferrerReferrals: 0,
  numActiveReferreeReferrals: 0,
  numInactiveReferreeReferrals: 0,
  inactiveReferrals: [],
  referralCode: "",
  loaded: false,
};

const SAFE_DEFAULT_REFERRAL_CODE = {
  referralAddress: "",
  loaded: false,
};

const SAFE_DEFAULT_UNCLAIMED_REWARDS = {
  userUnclaimedRewards: 0,
  unclaimedTokenAddrs: [],
  loaded: false,
};

export default function Dashboard() {
  const {
    network,
    provider,
    tokensConfig,
    referralCode: clickedReferralCode,
  } = useLoaderData<LoaderData>();

  const navigate = useNavigate();

  const { connected, address, rawAddress, disconnect, connecting } = useContext(
    FluidityFacadeContext
  );

  const url = useLocation();
  const urlPaths = url.pathname.split("dashboard");
  const pathname = urlPaths[1] ?? "";
  const appName = routeMapper(pathname);

  {
    /* Toggle Mobile Modal */
  }
  const [openMobModal, setOpenMobModal] = useState(false);

  const [walletModalVisibility, setWalletModalVisibility] =
    useState<boolean>(false);

  // By default, prompt user to connect their wallet
  const [connectedWalletModalVisibility, setConnectedWalletModalVisibility] =
    useState<boolean>(false);

  // Toggle Select Chain Modal
  const [chainModalVisibility, setChainModalVisibility] =
    useState<boolean>(false);

  // Toggle Referral Modal
  const [referralModalVisibility, setReferralModalVisibility] =
    useState<boolean>(false);

  // Toggle Accept Referral Modal
  const [acceptReferralModalVisibility, setAcceptReferralModalVisibility] =
    useState<boolean>(false);

  useEffect(() => {
    if (connected || connecting) setWalletModalVisibility(false);
  }, [connected, connecting]);

  const { width } = useViewport();

  const isMobile = width <= 500 && width > 0;
  const isTablet = width <= 850 && width > 0;
  const closeMobileModal = width > 850 ? false : true;

  useEffect(() => {
    // closes modal if screen size becomes too large for mobile menu
    !closeMobileModal && setOpenMobModal(false);
  }, [closeMobileModal]);

  const airdropMobileBreakpoint = 768;

  useEffect(() => {
    // if the referral modal is open and the screen size changes, close the modal and redirect to the mobile page
    if (!referralModalVisibility) return;

    if (width <= airdropMobileBreakpoint && width > 0) {
      setReferralModalVisibility(false);
      navigate(`/${network}/dashboard/airdrop#referrals`);
    }
  }, [width]);

  const matches = useMatches();
  const transitionPath = useTransition().location?.pathname;
  const currentPath = transitionPath || matches[matches.length - 1].pathname;
  const resolvedPaths = NAVIGATION_MAP.map((obj) =>
    useResolvedPath(Object.keys(obj)[0])
  );
  const activeIndex = resolvedPaths.findIndex((path) =>
    currentPath.includes(path.pathname)
  );

  const handleSetChain = (network: string) => {
    const { pathname } = location;

    // Get path components after $network
    const pathComponents = pathname.split("/").slice(2);

    navigate(`/${networkMapper(network)}/${pathComponents.join("/")}`);
  };

  const { data: referralsCountData } = useCache<ReferralCountLoaderData>(
    address ? `/${network}/query/referrals?address=${address}` : ""
  );

  const { data: referralCodeData } = useCache<ReferralCodeLoaderData>(
    clickedReferralCode && address
      ? `/${network}/query/referralCode?code=${clickedReferralCode}&address=${address}`
      : ""
  );

  // Rewards User has yet to claim - Ethereum feature
  const { data: userUnclaimedData } = useCache<UnclaimedRewardsLoaderData>(
    address && chainType(network) === "evm"
      ? `/${network}/query/dashboard/unclaimedRewards?address=${address}`
      : ""
  );

  const data = {
    referralCount: {
      ...SAFE_DEFAULT_REFERRAL_COUNT,
      ...referralsCountData,
    },
    referralCode: {
      ...SAFE_DEFAULT_REFERRAL_CODE,
      ...referralCodeData,
    },
    unclaimedRewards: {
      ...SAFE_DEFAULT_UNCLAIMED_REWARDS,
      ...userUnclaimedData,
    },
  };

  const {
    referralCount: {
      numActiveReferrerReferrals,
      numActiveReferreeReferrals,
      numInactiveReferreeReferrals,
      inactiveReferrals,
      referralCode,
      loaded: referralCountLoaded,
    },
    referralCode: { referralAddress, loaded: referralCodeLoaded },
    unclaimedRewards: { userUnclaimedRewards },
  } = data;

  const handleScroll = () => {
    if (!openMobModal) {
      // Unsets Background Scrolling to use when Modal is closed
      document.body.style.overflow = "unset";
      document.body.style.position = "static";
    }
    if (openMobModal) {
      if (typeof window != "undefined" && window.document) {
        // Disables Background Scrolling whilst the Modal is open
        document.body.style.overflow = "hidden";
        document.body.style.position = "fixed";
      }
    }
  };

  useEffect(() => {
    // Prevents and allows scrolling depending if mobile modal is open
    if (openMobModal) {
      // Delay to hide layout shift when static
      setTimeout(() => {
        handleScroll();
      }, 1000);
    } else handleScroll();
  }, [openMobModal]);

  useEffect(() => {
    // Only show acceptReferralModal if referral code is valid
    if (referralCodeLoaded && referralAddress) {
      setAcceptReferralModalVisibility(true);
    }
  }, [referralCodeLoaded]);

  useEffect(() => {
    // Resets background when navigating away
    document.body.style.overflow = "unset";
    document.body.style.position = "static";
  }, [currentPath]);

  useEffect(() => {
    // stop modal pop-up if connected
    connected && setWalletModalVisibility(false);
  }, [connected]);

  const [hoverModal, setHoverModal] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [stakingStatsModalVisibility, setStakingStatsModalVisibility] = useState(false);

  // every change to this number asks flystakingmodal to look up the new balance
  const [shouldUpdateFlyBalance, setShouldUpdateFlyBalance] = useState(0);

  const otherModalOpen =
    openMobModal ||
      walletModalVisibility ||
      connectedWalletModalVisibility ||
      chainModalVisibility
      ? true
      : false;

  // filter CHAIN_NAME_MAP by enabled chains
  const chainNameMap = Object.entries(CHAIN_NAME_MAP).reduce(
    (prev, [key, value]) => ({
      ...prev,
      [key]: value,
    }),
    {} as typeof CHAIN_NAME_MAP
  );

  return (
    <>
      {/* Switch Chain Modal */}
      <Modal id="switch-chain" visible={chainModalVisibility}>
        <div className="cover">
          <BlockchainModal
            handleModal={setChainModalVisibility}
            option={chainNameMap[network]}
            options={Object.values(chainNameMap)}
            setOption={handleSetChain}
            mobile={isMobile}
          />
        </div>
      </Modal>

      {/* Referral Modal */}
      <CardModal
        id="referral-modal"
        visible={referralModalVisibility}
        closeModal={() => setReferralModalVisibility(false)}
        cardPositionStyle={{
          position: "absolute",
          top: "1em",
          right: isTablet ? "20px" : "60px",
          width: 500,
        }}
        color="holo"
        style={{ padding: 0, width: "100%" }}
      >
        <ReferralModal
          connected={!!connected}
          network={network}
          connectWallet={() => {
            setReferralModalVisibility(false);
            setWalletModalVisibility(true);
          }}
          referrerClaimed={numActiveReferrerReferrals}
          refereeClaimed={numActiveReferreeReferrals}
          refereeUnclaimed={numInactiveReferreeReferrals}
          progress={inactiveReferrals[0]?.progress || 0}
          progressReq={10}
          referralCode={referralCode}
          loaded={referralCountLoaded}
          closeModal={() => setReferralModalVisibility(false)}
        />
      </CardModal>

      {/* Accept Referral Modal */}
      <CardModal
        id="accept-referral-modal"
        visible={acceptReferralModalVisibility}
        closeModal={() => setAcceptReferralModalVisibility(false)}
      >
        <AcceptReferralModal
          network={network}
          referralCode={clickedReferralCode}
          referrer={referralAddress}
        />
      </CardModal>

      {/* Fluidify Money button, in a portal with z-index above tooltip if another modal isn't open */}
      <Modal id="fluidify" visible={!otherModalOpen}>
        <GeneralButton
          className={`fluidify-button-dashboard-mobile rainbow ${otherModalOpen ? "z-0" : "z-1"
            }`}
          type={"secondary"}
          size={"medium"}
          handleClick={() => navigate("../fluidify")}
        >
          <Heading as="h5" color="inherit" style={{ margin: 0 }}>
            <b>Fluidify Money</b>
          </Heading>
        </GeneralButton>
      </Modal>

      <nav id="dashboard-navbar" className="hide-on-mobile">
        <div id="flu-logo">
          <Link to={"./home"}>
            <img
              style={{ width: "5.5em", height: "2.5em" }}
              src="https://app-cdn.fluidity.money/images/outlinedLogo.svg"
              alt="Fluidity"
            />
          </Link>
          <ChainSelectorButton
            className="selector-button"
            chain={chainNameMap[network]}
            onClick={() => setChainModalVisibility(true)}
          />
        </div>

        {/* Nav Bar */}
        <ul className="sidebar-nav">
          <li key="ico">
            <div />
            <a
              style={{ cursor: "pointer" }}
              href="https://app.uniswap.org/swap?outputCurrency=0x000F1720A263f96532D1ac2bb9CDC12b72C6f386&chain=arbitrum"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Text className="dashboard-navbar-default">
                <FlyIcon /> GET FLY
              </Text>
            </a>
          </li>
          {NAVIGATION_MAP.map((obj, index) => {
            const key = Object.keys(obj)[0];
            const { name, icon } = Object.values(obj)[0];
            const active = index === activeIndex;

            return (
              <li key={key}>
                {index === activeIndex ? (
                  <motion.div className={"active"} layoutId="active" />
                ) : (
                  <div />
                )}
                <Link to={key}>
                  <Text
                    prominent={active}
                    className={
                      active
                        ? "dashboard-navbar-active"
                        : "dashboard-navbar-default"
                    }
                  >
                    {icon} {name}
                  </Text>
                </Link>
              </li>
            );
          })}
          <li key="staking">
            <div />
            <a style={{ "cursor": "pointer" }} onClick={() => setStakingStatsModalVisibility(true)}>
              <Text className="dashboard-navbar-default"><StakeIcon classname="staking-icon" /> STAKING</Text>
            </a>
          </li>
        </ul>

        {/* Connect Wallet Button */}
        {network === `solana` ? (
          connected && address ? (
            <ConnectedWallet
              address={rawAddress ?? ""}
              callback={() => {
                setConnectedWalletModalVisibility(
                  !connectedWalletModalVisibility
                );
              }}
              className="connect-wallet-btn connected"
            />
          ) : (
            <GeneralButton
              type={connected || connecting ? "transparent" : "primary"}
              size={"medium"}
              handleClick={() =>
                connecting ? null : setWalletModalVisibility(true)
              }
              className="connect-wallet-btn"
            >
              {connecting ? `Connecting...` : `Connect Wallet`}
            </GeneralButton>
          )
        ) : connected && address ? (
          <ConnectedWallet
            address={rawAddress ?? ""}
            callback={() => {
              !connectedWalletModalVisibility &&
                setConnectedWalletModalVisibility(true);
              connectedWalletModalVisibility &&
                setConnectedWalletModalVisibility(false);
            }}
            className="connect-wallet-btn connected"
          />
        ) : (
          <GeneralButton
            type={connected || connecting ? "transparent" : "primary"}
            size={"medium"}
            handleClick={() =>
              connecting ? null : setWalletModalVisibility(true)
            }
            className="connect-wallet-btn"
          >
            {connecting ? `Connecting...` : `Connect Wallet`}
          </GeneralButton>
        )}
      </nav>

      {/* Main Content */}
      <main id="dashboard-body">
        <header id="top-navbar" className={"pad-main"}>
          {/* App Name */}
          <div id="top-navbar-left">
            {(isMobile || isTablet) && (
              <a onClick={() => navigate("./home")}>
                <img
                  style={{ width: "5.5em", height: "2.5em" }}
                  src="https://app-cdn.fluidity.money/images/outlinedLogo.svg"
                  alt="Fluidity"
                />
              </a>
            )}
            {!isMobile && (
              <Heading as="h6" color={"gray"}>
                {appName}
              </Heading>
            )}
          </div>

          {/* Navigation Buttons */}
          <div id="top-navbar-right">
            {/* Network Button */}
            {(isTablet || isMobile) && (
              <ChainSelectorButton
                chain={chainNameMap[network]}
                onClick={() => setChainModalVisibility(true)}
              />
            )}

            {/* Send & Receive (only supported if Arbitrum and non mobile and tablet) */}
            {network == "arbitrum" && !isMobile && !isTablet && (
              <>
                <GeneralButton
                  className="s-r-button"
                  type="transparent"
                  size="small"
                  layout="before"
                  handleClick={() => {
                    navigate(`/${network}/transfer/send`);
                  }}
                  icon={<ArrowUp />}
                >
                  {isMobile ? "" : "Send"}
                </GeneralButton>
                <GeneralButton
                  className="s-r-button"
                  type="transparent"
                  size="small"
                  layout="before"
                  handleClick={() => {
                    navigate(`/${network}/transfer/receive`);
                  }}
                  icon={<ArrowDown />}
                >
                  {isMobile ? "" : "Receive"}
                </GeneralButton>
              </>
            )}

            {/* Referrals Button (desktop only) */}
            {isTablet || isMobile || (
              <GeneralButton
                type="transparent"
                size="small"
                layout="before"
                handleClick={() => {
                  width < airdropMobileBreakpoint
                    ? navigate(`/${network}/dashboard/airdrop#referrals`)
                    : setReferralModalVisibility(true);
                }}
                icon={<Referral />}
              >
                {isMobile ? "" : "Referral"}
              </GeneralButton>
            )}

            {/* Fluidify button (desktop only) */}
            {isTablet || isMobile || (
              <GeneralButton
                className="fluidify-button-dashboard "
                type={"secondary"}
                size={"small"}
                handleClick={() => navigate(`/${network}/fluidify`)}
              >
                <b>Fluidify{isMobile ? "" : " Money"}</b>
              </GeneralButton>
            )}

            {/* Prize Money */}
            <GeneralButton
              onMouseEnter={() => setHoverModal(true)}
              onMouseLeave={() => setTimeout(() => setHoverModal(false), 500)}
              type={"transparent"}
              layout="after"
              size={"small"}
              handleClick={() =>
                userUnclaimedRewards < 0.000005
                  ? navigate(`/${network}/dashboard/rewards`)
                  : navigate(`/${network}/dashboard/rewards/unclaimed`)
              }
              icon={<Trophy />}
              style={{ fontSize: "1em" }}
            >
              {numberToMonetaryString(userUnclaimedRewards)}
            </GeneralButton>

            {(isTablet || isMobile) && (
              <BurgerMenu isOpen={openMobModal} setIsOpen={setOpenMobModal} />
            )}
          </div>
        </header>
        <ConnectedWalletModal
          visible={connectedWalletModalVisibility}
          address={rawAddress ?? ""}
          close={() => {
            setConnectedWalletModalVisibility(false);
          }}
          disconnect={() => {
            disconnect?.();
            setConnectedWalletModalVisibility(false);
          }}
        />
        {/* Connect Wallet Modal */}
        <ConnectWalletModal
          visible={walletModalVisibility}
          close={() => setWalletModalVisibility(false)}
        />
        {/* FLY Staking Stats Modal */}
        <FlyStakingStatsModal
          staking={true}
          close={() => { setStakingStatsModalVisibility(false) }}
          showConnectWalletModal={() => setWalletModalVisibility(true)}
          visible={stakingStatsModalVisibility}
          shouldUpdateFlyBalance={shouldUpdateFlyBalance}
        />
        <FlyStakingContext.Provider
          value={{
            toggleVisibility: setStakingStatsModalVisibility,
            shouldUpdateBalance: () => setShouldUpdateFlyBalance((v) => v + 1)
          }}
        >
          <UIContext.Provider
            value={{
              toggleConnectWalletModal: () => setWalletModalVisibility((v) => !v),
            }}
          >
            <Outlet />
          </UIContext.Provider>
        </FlyStakingContext.Provider>
        {/* Provide Liquidity*/}
        <div
          className="pad-main"
          style={{ marginBottom: "2em", marginTop: "2em" }}
        >
          {!openMobModal && (
            <ProvideLiquidity
              provider={provider}
              network={network}
              tokensConfig={tokensConfig}
            />
          )}
        </div>
        {/* Modal on hover */}
        {userUnclaimedRewards >= 0.000005 &&
          (hoverModal || showModal) &&
          !isMobile && (
            <UnclaimedRewardsHoverModal
              unclaimedRewards={userUnclaimedRewards}
              setShowModal={setShowModal}
            />
          )}

        {/* Default Fluidify button */}
        {otherModalOpen && (
          <GeneralButton
            className="fluidify-button-dashboard-mobile rainbow "
            type={"secondary"}
            size={"medium"}
            handleClick={() => navigate(`/${network}/fluidify`)}
          >
            <Heading as="h5" color="inherit" style={{ margin: 0 }}>
              <b>Fluidify Money</b>
            </Heading>
          </GeneralButton>
        )}

        <footer id="flu-socials" className="hide-on-mobile pad-main">
          {/* Links */}
          <section>
            {/* Terms */}
            <a
              href={
                "https://static.fluidity.money/assets/fluidity-website-tc.pdf"
              }
            >
              <Text>Terms</Text>
            </a>

            {/* Privacy Policy */}
            <a
              href={
                "https://static.fluidity.money/assets/fluidity-privacy-policy.pdf"
              }
            >
              <Text>Privacy Policy</Text>
            </a>

            {/* Audits Completed */}
            <a
              href={
                "https://docs.fluidity.money/docs/security/audits-completed"
              }
            >
              <Text>Audits Completed</Text>
            </a>

            {/* Roadmap */}
            <a href={"https://docs.fluidity.money/docs/fundamentals/roadmap"}>
              <Text>Roadmap</Text>
            </a>

            {/* Source code */}
            <a href={"https://github.com/fluidity-money/fluidity-app"}>
              <Text>Source Code</Text>
            </a>

            {/* Dune */}
            <a href={"https://dune.com/neogeo/fluidity-arbitrum"}>
              <Text>Dune</Text>
            </a>
          </section>

          {/* Socials */}
          <section>
            {/* Twitter */}
            <a
              href={"https://twitter.com/fluiditymoney"}
              rel="noopener noreferrer"
              target="_blank"
            >
              <img src={"https://app-cdn.fluidity.money/images/socials/twitter.svg"} alt={"Twitter"} />
            </a>

            {/* Discord */}
            <a
              href={"https://discord.com/invite/CNvpJk4HpC"}
              rel="noopener noreferrer"
              target="_blank"
            >
              <img src={"https://app-cdn.fluidity.money/images/socials/discord.svg"} alt={"Discord"} />
            </a>

            {/* Telegram */}
            <a
              href={"https://t.me/fluiditymoney"}
              rel="noopener noreferrer"
              target="_blank"
            >
              <img src={"https://app-cdn.fluidity.money/images/socials/telegram.svg"} alt={"Telegram"} />
            </a>

            {/* LinkedIn */}
            <a
              href={"https://www.linkedin.com/company/fluidity-money"}
              rel="noopener noreferrer"
              target="_blank"
            >
              <img src={"https://app-cdn.fluidity.money/images/socials/linkedin.svg"} alt={"LinkedIn"} />
            </a>
          </section>
        </footer>

        {/* Mobile Menu Modal */}
        {openMobModal && (
          <MobileModal
            navigationMap={NAVIGATION_MAP.map((obj) => {
              const { name, icon, path } = Object.values(obj)[0];
              return { name, icon, path };
            })}
            nonNavigationEntries={[
              <li key="staking">
                <div />
                <a style={{ "cursor": "pointer" }} onClick={() => setStakingStatsModalVisibility(true)}>
                  <Text className="dashboard-navbar-default"><StakeIcon classname="staking-icon" /> STAKING</Text>
                </a>
              </li>,
              <li key="ico">
                <div />
                <a
                  style={{ cursor: "pointer" }}
                  href="https://app.uniswap.org/swap?outputCurrency=0x000F1720A263f96532D1ac2bb9CDC12b72C6f386&chain=arbitrum"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Text className="dashboard-navbar-default">
                    <FlyIcon /> GET FLY
                  </Text>
                </a>
              </li>
            ]}
            activeIndex={activeIndex}
            chains={chainNameMap}
            unclaimedFluid={userUnclaimedRewards}
            network={network}
            isOpen={openMobModal}
            setIsOpen={setOpenMobModal}
            unclaimedRewards={userUnclaimedRewards}
          />
        )}
      </main>
    </>
  );
}

const routeMapper = (route: string) => {
  switch (route.toLowerCase()) {
    case "/":
    case "/home":
      return "DASHBOARD";
    case "/rewards":
      return "REWARDS";
    case "/unclaimed":
      return "CLAIM";
    case "/dao":
      return "DAO";
    case "/airdrop":
      return "AIRDROP";
    default:
      return "DASHBOARD";
  }
};

export { ErrorBoundary };
