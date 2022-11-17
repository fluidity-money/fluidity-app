import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import type { UserUnclaimedReward } from "~/queries/useUserUnclaimedRewards";

import { json } from "@remix-run/node";
import {
  Link,
  Outlet,
  useLoaderData,
  useNavigate,
  useResolvedPath,
  useMatches,
  useTransition,
} from "@remix-run/react";
import { useState, useEffect, useContext } from "react";
import FluidityFacadeContext from "contexts/FluidityFacade";
import { motion } from "framer-motion";
import useViewport from "~/hooks/useViewport";
import { useUserUnclaimedRewards } from "~/queries";
import config from "~/webapp.config.server";
import { io } from "socket.io-client";
import { PipedTransaction } from "drivers/types";
import { trimAddress, networkMapper } from "~/util";
import {
  DashboardIcon,
  GeneralButton,
  Trophy,
  Text,
  ChainSelectorButton,
  BlockchainModal,
  trimAddressShort,
} from "@fluidity-money/surfing";
import { useToolTip } from "~/components";
import BurgerButton from "~/components/BurgerButton";
import ProvideLiquidity from "~/components/ProvideLiquidity";
import { ToolTipContent } from "~/components/ToolTip";
import ConnectWalletModal from "~/components/ConnectWalletModal";
import ConnectedWallet from "~/components/ConnectedWallet";
import Modal from "~/components/Modal";
import dashboardStyles from "~/styles/dashboard.css";
import MobileModal from "~/components/MobileModal";
import { ConnectedWalletModal } from "~/components/ConnectedWalletModal";
import { ViewRewardModal } from "~/components/ViewRewardModal";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: dashboardStyles }];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const url = new URL(request.url);

  const routeMapper = (route: string) => {
    switch (route.toLowerCase()) {
      case "home":
        return "DASHBOARD";
      case "rewards":
        return "REWARDS";
      case "unclaimed":
        return "CLAIM";
      case "assets":
        return "ASSETS";
      case "dao":
        return "DAO";
      default:
        return "DASHBOARD";
    }
  };

  const urlPaths = url.pathname.split("/");

  const pathname = urlPaths.pop() ?? "";

  const ethereumWallets = config.config["ethereum"].wallets;

  const network = params.network ?? "";

  const provider = config.liquidity_providers;

  const token = config.config;

  const fromRedirectStr = url.searchParams.get("redirect");

  const fromRedirect = fromRedirectStr === "true";

  return json({
    appName: routeMapper(pathname),
    fromRedirect,
    version: "1.5",
    network,
    provider,
    token,
    ethereumWallets,
  });
};

type LoaderData = {
  appName: string;
  fromRedirect: boolean;
  version: string;
  network: string;
  provider: typeof config.liquidity_providers;
  token: typeof config.config;
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

export default function Dashboard() {
  const { appName, version, network, token, fromRedirect } =
    useLoaderData<LoaderData>();

  const navigate = useNavigate();

  const { connected, address, disconnect, connecting } = useContext(
    FluidityFacadeContext
  );

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
    useState<boolean>(fromRedirect);

  useEffect(() => {
    if (connected || connecting) setWalletModalVisibility(false);
  }, [connected, connecting]);

  const { width } = useViewport();

  const isMobile = width <= 500;
  const isTablet = width <= 850 && width > 500;
  const closeMobileModal = width > 850 ? false : true;

  useEffect(() => {
    // closes modal if screen size becomes too large for mobile menu
    !closeMobileModal && setOpenMobModal(false);
  }, [closeMobileModal]);

  const navigationMap = [
    { home: { name: "Dashboard", icon: <DashboardIcon /> } },
    { rewards: { name: "Rewards", icon: <Trophy /> } },
    // {assets: {name: "Assets", icon: <AssetsIcon />}},
    // {dao: {name:"DAO", icon: <DaoIcon />}},
  ];

  const chainNameMap = {
    ethereum: {
      name: "ETH",
      icon: <img src="/assets/chains/ethIcon.svg" />,
    },
    solana: {
      name: "SOL",
      icon: <img src="/assets/chains/solanaIcon.svg" />,
    },
  };

  const matches = useMatches();
  const toolTip = useToolTip();
  const transitionPath = useTransition().location?.pathname;
  const currentPath = transitionPath || matches[matches.length - 1].pathname;
  const resolvedPaths = navigationMap.map((obj) =>
    useResolvedPath(Object.keys(obj)[0])
  );
  const activeIndex = resolvedPaths.findIndex(
    (path) =>
      path.pathname === currentPath ||
      path.pathname === currentPath.slice(0, -1)
  );

  const handleSetChain = (network: string) => {
    const { pathname } = location;

    // Get path components after $network
    const pathComponents = pathname.split("/").slice(2);

    navigate(`/${networkMapper(network)}/${pathComponents.join("/")}`);
  };

  // Rewards User has yet to claim - Ethereum feature
  const [unclaimedRewards, setUnclaimedRewards] = useState(0);

  useEffect(() => {
    (async () => {
      if (!address) return;

      if (network !== "ethereum") return;

      const { data, error } = await useUserUnclaimedRewards(network, address);

      if (error || !data) return;

      const { ethereum_pending_winners: rewards } = data;

      const sanitisedRewards = rewards.filter(
        (transaction: UserUnclaimedReward) => !transaction.reward_sent
      );

      const totalUnclaimedRewards = sanitisedRewards.reduce(
        (sum: number, transaction: UserUnclaimedReward) => {
          const { win_amount, token_decimals } = transaction;

          const decimals = 10 ** token_decimals;
          return sum + win_amount / decimals;
        },
        0
      );

      setUnclaimedRewards(totalUnclaimedRewards);
    })();

    // Test for now, wallet address should be gotten when a wallet is connected
    // take out hard coded address later.

    const socket = io();
    socket.emit("subscribeTransactions", {
      protocol: network,
      address,
    });

    setTimeout(() => {
      socket.on("Transactions", (log: PipedTransaction) => {
        const fToken = token[
          network === `` ? `ethereum` : network
        ].tokens.filter((entry) => entry.symbol === log.token);

        toolTip.open(
          fToken.at(0)?.colour,
          <ToolTipContent
            tokenLogoSrc={fToken.at(0)?.logo}
            boldTitle={log.amount + ` ` + log.token}
            details={
              log.type === "rewardDB"
                ? `reward for sending`
                : `received from ` + trimAddress(log.source)
            }
            linkLabel={"DETAILS"}
            linkUrl={"#"}
          />
        );
      });
    }, 30000);
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

  return (
    <>
      <header id="flu-logo" className="hide-on-mobile">
        <a onClick={() => navigate("./home")}>
          <img src="/images/outlinedLogo.svg" alt="Fluidity" />
        </a>

        <br />

        <ChainSelectorButton
          chain={chainNameMap[network as "ethereum" | "solana"]}
          onClick={() => setChainModalVisibility(true)}
        />
      </header>

      {/* Switch Chain Modal */}
      <Modal visible={chainModalVisibility}>
        <div className="cover">
          <BlockchainModal
            handleModal={setChainModalVisibility}
            option={chainNameMap[network as "ethereum" | "solana"]}
            options={Object.values(chainNameMap)}
            setOption={handleSetChain}
            mobile={isMobile}
          />
        </div>
      </Modal>

      <nav id="dashboard-navbar" className={"navbar-v2 hide-on-mobile"}>
        {/* Nav Bar */}
        <ul>
          {navigationMap.map((obj, index) => {
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
              address={trimAddressShort(address.toString())}
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
            address={trimAddressShort(address.toString())}
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
                <img src="/images/outlinedLogo.svg" alt="Fluidity" />
              </a>
            )}
            {!isMobile && <Text>{appName}</Text>}
          </div>

          {/* Navigation Buttons */}
          <div>
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

            {/* Fluidify */}
            {width > 550 && (
              <GeneralButton
                version={"primary"}
                buttontype="text"
                size={"small"}
                handleClick={() => navigate("../fluidify")}
              >
                Fluidify Money
              </GeneralButton>
            )}

            {/* Prize Money */}
            <GeneralButton
              version={"transparent"}
              buttontype="icon after"
              size={"small"}
              handleClick={() =>
                unclaimedRewards
                  ? navigate("./rewards/unclaimed")
                  : navigate("./rewards")
              }
              icon={<Trophy />}
            >
              ${unclaimedRewards}
            </GeneralButton>

            {(isTablet || isMobile) && (
              <BurgerButton isOpen={openMobModal} setIsOpen={setOpenMobModal} />
            )}
          </div>
        </nav>
        <ConnectedWalletModal
          visible={connectedWalletModalVisibility}
          address={address ? address.toString() : ""}
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

        {/* Mobile Menu Modal */}
        {openMobModal && (
          <MobileModal
            navigationMap={navigationMap}
            activeIndex={activeIndex}
            chains={chainNameMap}
            unclaimedFluid={unclaimedRewards}
            network={network}
            isOpen={openMobModal}
            setIsOpen={setOpenMobModal}
            unclaimedRewards={unclaimedRewards}
          />
        )}

        {/* Provide Luquidity*/}
        {!openMobModal && <ProvideLiquidity />}

        <footer id="flu-socials" className="hide-on-mobile pad-main">
          {/* Links */}
          <section>
            {/* Version */}
            <Text>Fluidity Money V{version}</Text>

            {/* Terms */}
            <Link to={"/"}>
              <Text>Terms</Text>
            </Link>

            {/* Privacy Policy */}
            <Link to={"/"}>
              <Text>Privacy policy</Text>
            </Link>

            {/* Roadmap */}
            <Link to={"https://docs.fluidity.money/docs/fundamentals/roadmap"}>
              <Text>Roadmap</Text>
            </Link>
          </section>

          {/* Socials */}
          <section>
            {/* Twitter */}
            <Link to={"https://twitter.com/fluiditymoney"}>
              <img src={"/images/socials/twitter.svg"} alt={"Twitter"} />
            </Link>

            {/* Discord */}
            <Link to={"https://discord.com/invite/CNvpJk4HpC"}>
              <img src={"/images/socials/discord.svg"} alt={"Discord"} />
            </Link>

            {/* Telegram */}
            <Link to={"https://t.me/fluiditymoney"}>
              <img src={"/images/socials/telegram.svg"} alt={"Telegram"} />
            </Link>

            {/* LinkedIn */}
            <Link to={"https://www.linkedin.com/company/fluidity-money"}>
              <img src={"/images/socials/linkedin.svg"} alt={"LinkedIn"} />
            </Link>
          </section>
        </footer>
      </main>
    </>
  );
}

export { ErrorBoundary };
