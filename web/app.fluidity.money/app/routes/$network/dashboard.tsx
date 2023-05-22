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
  useTransition,
  useLocation,
} from "@remix-run/react";
import { useCache } from "~/hooks/useCache";
import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { networkMapper } from "~/util";
import FluidityFacadeContext from "contexts/FluidityFacade";
import { SplitContext } from "contexts/SplitProvider";
import config from "~/webapp.config.server";
import {
  DashboardIcon,
  GeneralButton,
  Trophy,
  AirdropIcon,
  AssetsIcon,
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
  ChainName,
  BurgerMenu,
  Referral,
  CardModal
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
      <img src="/images/logoMetallic.png" alt="" style={{ height: "40px" }} />
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

const NAVIGATION_MAP: {
  [key: string]: { name: string; icon: JSX.Element };
}[] = [
    { home: { name: "dashboard", icon: <DashboardIcon /> } },
    { rewards: { name: "rewards", icon: <Trophy /> } },
    { assets: { name: "assets", icon: <AssetsIcon /> } },
    { airdrop: { name: "airdrop", icon: <AirdropIcon /> } },
  ];

const CHAIN_NAME_MAP: Record<string, { name: string; icon: JSX.Element }> = {
  ethereum: {
    name: "ETH",
    icon: <img src="/assets/chains/ethIcon.svg" />,
  },
  arbitrum: {
    name: "ARB",
    icon: <img src="/assets/chains/arbIcon.svg" />,
  },
  solana: {
    name: "SOL",
    icon: <img src="/assets/chains/solanaIcon.svg" />,
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

  const { showExperiment, client } = useContext(SplitContext);
  const showAssets = showExperiment("enable-assets-page");
  const showAirdrop = showExperiment("enable-airdrop-page");
  const showMobileNetworkButton = showExperiment("feature-network-visible");

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
    if (!referralModalVisibility) return


    if (width <= airdropMobileBreakpoint && width > 0) {
      setReferralModalVisibility(false)
      navigate(`/${network}/dashboard/airdrop#referrals`)
    }
  }, [width])

  const matches = useMatches();
  const transitionPath = useTransition().location?.pathname;
  const currentPath = transitionPath || matches[matches.length - 1].pathname;
  const resolvedPaths = NAVIGATION_MAP.map((obj) =>
    useResolvedPath(Object.keys(obj)[0])
  );
  const activeIndex = resolvedPaths.findIndex((path) =>
    currentPath.includes(path.pathname)
  );

  const handleSetChain = (network: ChainName) => {
    const { pathname } = location;

    // Get path components after $network
    const pathComponents = pathname.split("/").slice(2);

    navigate(`/${networkMapper(network)}/${pathComponents.join("/")}`);
  };

  const { data: referralsCountData } = useCache<ReferralCountLoaderData>(
    showAirdrop && address
      ? `/${network}/query/referrals?address=${address}`
      : ""
  );

  const { data: referralCodeData } = useCache<ReferralCodeLoaderData>(
    showAirdrop && clickedReferralCode && address
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

  const otherModalOpen =
    openMobModal ||
      walletModalVisibility ||
      connectedWalletModalVisibility ||
      chainModalVisibility
      ? true
      : false;

  return (
    <>
      <header id="flu-logo" className="hide-on-mobile">
        <Link to={"./home"}>
          <img
            style={{ width: "5.5em", height: "2.5em" }}
            src="/images/outlinedLogo.svg"
            alt="Fluidity"
          />
        </Link>

        <br />
        <br />

        <ChainSelectorButton
          className="selector-button"
          chain={CHAIN_NAME_MAP[network]}
          onClick={() => setChainModalVisibility(true)}
        />
      </header>

      {/* Switch Chain Modal */}
      <Modal id="switch-chain" visible={chainModalVisibility}>
        <div className="cover">
          <BlockchainModal
            handleModal={setChainModalVisibility}
            option={CHAIN_NAME_MAP[network]}
            options={Object.values(CHAIN_NAME_MAP)}
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
          width: 500
        }}
        color="holo"
        style={{ padding: 0, width: '100%' }}
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
      <Modal id="accept-referral-modal" visible={acceptReferralModalVisibility}>
        <div
          className="cover"
          onClick={() => setAcceptReferralModalVisibility(false)}
          style={{
            background: isMobile ? "black" : "#030303cc",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <AcceptReferralModal
            network={network}
            referralCode={clickedReferralCode}
            referrer={referralAddress}
            closeModal={() => setAcceptReferralModalVisibility(false)}
          />
        </div>
      </Modal>

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

      <nav id="dashboard-navbar" className={"navbar-v2 hide-on-mobile"}>
        {/* Nav Bar */}
        <ul>
          {NAVIGATION_MAP.filter((obj) =>
            showAssets ? true : Object.keys(obj)[0] !== "assets"
          )
            .filter((obj) =>
              showAirdrop ? true : Object.keys(obj)[0] !== "airdrop"
            )
            .map((obj, index) => {
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
              className="connect-wallet-btn"
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
            className="connect-wallet-btn"
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
      <main id="dashboard-body">
        <nav id="top-navbar" className={"pad-main"}>
          {/* App Name */}
          <div className="top-navbar-left">
            {(isMobile || isTablet) && (
              <a onClick={() => navigate("./home")}>
                <img
                  style={{ width: "5.5em", height: "2.5em" }}
                  src="/images/outlinedLogo.svg"
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
            {/* Send */}
            {/*
            <GeneralButton
              version={"secondary"}
              buttontype="icon before"
              size={"small"}
              handleClick={() => navigate("/send")}
              icon={<ArrowUp />}
            >
              Send
            </GeneralButton>
            */}

            {/* Receive */}
            {/*
            <GeneralButton
              version={"secondary"}
              buttontype="icon before"
              size={"small"}
              handleClick={() => navigate("/receive")}
              icon={<ArrowDown />}
            >
              Recieve
            </GeneralButton>
            */}
            {(isTablet || isMobile) && showMobileNetworkButton && (
              <ChainSelectorButton
                chain={CHAIN_NAME_MAP[network]}
                onClick={() => setChainModalVisibility(true)}
              />
            )}

            {/* Referrals Button */}
            {showExperiment("enable-airdrop-page") && (
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

            {/* Fluidify button */}
            {otherModalOpen && showExperiment("Fluidify-Button-Placement") && (
              <GeneralButton
                className="fluidify-button-dashboard "
                type={"secondary"}
                size={"small"}
                handleClick={() => {
                  client?.track("user", "click_fluidify");
                  navigate(`/${network}/fluidify`);
                }}
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
        </nav>
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
        <Outlet />
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
        {otherModalOpen && !showExperiment("Fluidify-Button-Placement") && (
          <GeneralButton
            className="fluidify-button-dashboard-mobile rainbow "
            type={"secondary"}
            size={"medium"}
            handleClick={() => {
              client?.track("user", "click_fluidify");
              navigate(`/${network}/fluidify`);
            }}
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
            {showExperiment("enable-source-code") && (
              <a href={"https://github.com/fluidity-money/fluidity-app"}>
                <Text>Source Code</Text>
              </a>
            )}
          </section>

          {/* Socials */}
          <section>
            {/* Twitter */}
            <a href={"https://twitter.com/fluiditymoney"}>
              <img src={"/images/socials/twitter.svg"} alt={"Twitter"} />
            </a>

            {/* Discord */}
            <a href={"https://discord.com/invite/CNvpJk4HpC"}>
              <img src={"/images/socials/discord.svg"} alt={"Discord"} />
            </a>

            {/* Telegram */}
            <a href={"https://t.me/fluiditymoney"}>
              <img src={"/images/socials/telegram.svg"} alt={"Telegram"} />
            </a>

            {/* LinkedIn */}
            <a href={"https://www.linkedin.com/company/fluidity-money"}>
              <img src={"/images/socials/linkedin.svg"} alt={"LinkedIn"} />
            </a>
          </section>
        </footer>

        {/* Mobile Menu Modal */}
        {openMobModal && (
          <MobileModal
            navigationMap={NAVIGATION_MAP.map((obj) => {
              const { name, icon } = Object.values(obj)[0];
              return { name, icon };
            })}
            activeIndex={activeIndex}
            chains={CHAIN_NAME_MAP}
            unclaimedFluid={userUnclaimedRewards}
            network={network as ChainName}
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
    case "/assets":
    case "/assets/regular":
      return "ASSETS";
    case "/dao":
      return "DAO";
    case "/airdrop":
      return "AIRDROP";
    default:
      return "DASHBOARD";
  }
};

export { ErrorBoundary };
