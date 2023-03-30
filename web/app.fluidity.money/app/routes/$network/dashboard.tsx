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
  useFetcher,
} from "@remix-run/react";
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
  Provider,
  ChainName,
  Token,
} from "@fluidity-money/surfing";
import BurgerButton from "~/components/BurgerButton";
import ConnectWalletModal from "~/components/ConnectWalletModal";
import MobileModal from "~/components/MobileModal";
import UnclaimedRewardsHoverModal from "~/components/UnclaimedRewardsHoverModal";
import { UnclaimedRewardsLoaderData } from "./query/dashboard/unclaimedRewards";
import { getProviderDisplayName } from "~/util/provider";

import dashboardStyles from "~/styles/dashboard.css";
import referralModalStyles from "~/components/ReferralModal/referralModal.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: dashboardStyles }];
};

export const loader: LoaderFunction = async ({ params }) => {
  const ethereumWallets = config.config["ethereum"].wallets;

  const network = params.network ?? "";

  const provider = config.liquidity_providers;

  // Sanitize names from config with Provider names
  Object.keys(provider).forEach((chain) => {
    provider[chain].providers.forEach((provider) => {
      provider.name = getProviderDisplayName(provider.name);
    });
  });

  const tokensConfig = config.config;

  return json({
    network,
    provider,
    tokensConfig,
    ethereumWallets,
  });
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

type LoaderData = {
  fromRedirect: boolean;
  network: ChainName;
  provider: {
    [x: string]: {
      providers: {
        name: Provider;
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
        symbol: Token;
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
};

export default function Dashboard() {
  const { network, provider, tokensConfig } = useLoaderData<LoaderData>();

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

  const navigationMap: {
    [key: string]: { name: string; icon: JSX.Element };
  }[] = [
<<<<<<< HEAD
      { home: { name: "Dashboard", icon: <DashboardIcon /> } },
      { rewards: { name: "Rewards", icon: <Trophy /> } },
      { assets: { name: "Assets", icon: <AssetsIcon /> } },
    ];
=======
    { home: { name: "Dashboard", icon: <DashboardIcon /> } },
    { rewards: { name: "Rewards", icon: <Trophy /> } },
    { assets: { name: "Assets", icon: <AssetsIcon /> } },
    { airdrop: { name: "Airdrop", icon: <Trophy /> } },
  ];
>>>>>>> develop

  const chainNameMap: Record<string, { name: string; icon: JSX.Element }> = {
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

  const matches = useMatches();
  const transitionPath = useTransition().location?.pathname;
  const currentPath = transitionPath || matches[matches.length - 1].pathname;
  const resolvedPaths = navigationMap.map((obj) =>
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

  // Rewards User has yet to claim - Ethereum feature

  const userUnclaimedData = useFetcher<UnclaimedRewardsLoaderData>();

  const unclaimedRewards = userUnclaimedData.data
    ? userUnclaimedData.data.userUnclaimedRewards
    : 0;

  useEffect(() => {
    if (!address) return;

    userUnclaimedData.load(
      `/${network}/query/dashboard/unclaimedRewards?address=${address}`
    );
  }, [address]);

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
          chain={chainNameMap[network satisfies ChainName]}
          onClick={() => setChainModalVisibility(true)}
        />
      </header>

      {/* Switch Chain Modal */}
      <Modal visible={chainModalVisibility}>
        <div className="cover">
          <BlockchainModal
            handleModal={setChainModalVisibility}
            option={chainNameMap[network satisfies ChainName]}
            options={Object.values(chainNameMap)}
            setOption={handleSetChain}
            mobile={isMobile}
          />
        </div>
      </Modal>

      {/* Fluidify Money button, in a portal with z-index above tooltip if another modal isn't open */}
      <Modal visible={!otherModalOpen}>
        <GeneralButton
          className={`fluidify-button-dashboard-mobile rainbow ${otherModalOpen ? "z-0" : "z-1"
            }`}
          version={"primary"}
          buttontype="text"
          size={"medium"}
          handleClick={() => navigate("../fluidify")}
        >
          <Heading as="h5">
            <b>Fluidify Money</b>
          </Heading>
        </GeneralButton>
      </Modal>

      <nav id="dashboard-navbar" className={"navbar-v2 hide-on-mobile"}>
        {/* Nav Bar */}
        <ul>
          {navigationMap
            .filter((obj) =>
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
              version={connected || connecting ? "transparent" : "primary"}
              buttontype="text"
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
            version={connected || connecting ? "transparent" : "primary"}
            buttontype="text"
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
                chain={chainNameMap[network satisfies ChainName]}
                onClick={() => setChainModalVisibility(true)}
              />
            )}

            {/* Fluidify button */}
            {otherModalOpen && showExperiment("Fluidify-Button-Placement") && (
              <GeneralButton
                className="fluidify-button-dashboard "
                version={"primary"}
                buttontype="text"
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
              className="trophy-button"
              version={"transparent"}
              buttontype="icon after"
              size={"small"}
              handleClick={() =>
                unclaimedRewards < 0.000005
                  ? navigate(`/${network}/dashboard/rewards`)
                  : navigate(`/${network}/dashboard/rewards/unclaimed`)
              }
              icon={<Trophy />}
            >
              {numberToMonetaryString(unclaimedRewards)}
            </GeneralButton>

            {(isTablet || isMobile) && (
              <BurgerButton isOpen={openMobModal} setIsOpen={setOpenMobModal} />
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
        <div className="pad-main" style={{ marginBottom: "2em" }}>
          {!openMobModal && (
            <ProvideLiquidity
              provider={provider}
              network={network}
              tokensConfig={tokensConfig}
            />
          )}
        </div>
        {/* Modal on hover */}
        {unclaimedRewards >= 0.000005 &&
          (hoverModal || showModal) &&
          !isMobile && (
            <UnclaimedRewardsHoverModal
              unclaimedRewards={unclaimedRewards}
              setShowModal={setShowModal}
            />
          )}

        {/* Default Fluidify button */}
        {otherModalOpen && !showExperiment("Fluidify-Button-Placement") && (
          <GeneralButton
            className="fluidify-button-dashboard-mobile rainbow "
            version={"primary"}
            buttontype="text"
            size={"medium"}
            handleClick={() => {
              client?.track("user", "click_fluidify");
              navigate(`/${network}/fluidify`);
            }}
          >
            <Heading as="h5">
              <b>Fluidify Money</b>
            </Heading>
          </GeneralButton>
        )}

        {/* Mobile Menu Modal */}
        {openMobModal && (
          <MobileModal
            navigationMap={navigationMap.map((obj) => {
              const { name, icon } = Object.values(obj)[0];
              return { name, icon };
            })}
            activeIndex={activeIndex}
            chains={chainNameMap}
            unclaimedFluid={unclaimedRewards}
            network={network}
            isOpen={openMobModal}
            setIsOpen={setOpenMobModal}
            unclaimedRewards={unclaimedRewards}
          />
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
      </main>
    </>
  );
}

export { ErrorBoundary };
