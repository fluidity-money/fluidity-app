import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
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
  useLocation,
} from "@remix-run/react";
import { useState, useEffect, useContext } from "react";
import FluidityFacadeContext from "contexts/FluidityFacade";
import { motion } from "framer-motion";
import useViewport from "~/hooks/useViewport";
import { useUserUnclaimedRewards } from "~/queries";
import config from "~/webapp.config.server";
import { io } from "socket.io-client";
import { PipedTransaction, NotificationType } from "drivers/types";
import { trimAddress, networkMapper } from "~/util";
import {
  DashboardIcon,
  GeneralButton,
  Trophy,
  Text,
  Heading,
  ChainSelectorButton,
  BlockchainModal,
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
import UnclaimedRewardsHoverModal from "~/components/UnclaimedRewardsHoverModal";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: dashboardStyles }];
};

export const loader: LoaderFunction = async ({ params }) => {
  const ethereumWallets = config.config["ethereum"].wallets;

  const network = params.network ?? "";

  const provider = config.liquidity_providers;

  const tokens = config.config;

  return json({
    network,
    provider,
    tokens,
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

export const meta: MetaFunction = ({ data }) => ({
  ...data,
  title: "Fluidity - Dashboard",
});

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

type LoaderData = {
  appName: string;
  fromRedirect: boolean;
  network: string;
  provider: typeof config.liquidity_providers;
  tokens: typeof config.config;
};

export default function Dashboard() {
  const { network, tokens } = useLoaderData<LoaderData>();

  const navigate = useNavigate();

  const { connected, address, rawAddress, disconnect, connecting, balance } =
    useContext(FluidityFacadeContext);

  const url = useLocation();
  const urlPaths = url.pathname.split("/");
  const pathname = urlPaths.pop() ?? "";
  const appName = routeMapper(pathname);

  {
    /* Toggle Mobile Modal */
  }
  const [openMobModal, setOpenMobModal] = useState(false);

  const [walletModalVisibility, setWalletModalVisibility] =
    useState<boolean>(false);

  type RewardDetails = {
    visible: boolean;
    token: string;
    img: string;
    colour: string;
    winAmount: string;
    explorerUri: string;
    balance: string;
    forSending: boolean;
  };

  const [detailedRewardObject, setDetailedRewardObject] =
    useState<RewardDetails>({
      visible: false,
      token: "",
      img: "",
      colour: "",
      winAmount: "",
      explorerUri: "",
      balance: "",
      forSending: false,
    });

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

  const navigationMap = [
    { home: { name: "dashboard", icon: <DashboardIcon /> } },
    { rewards: { name: "rewards", icon: <Trophy /> } },
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

  const handleCloseViewRewardDetailModal = () => {
    setDetailedRewardObject({
      // empty object on close
      visible: false,
      token: "",
      img: "",
      colour: "",
      winAmount: "",
      explorerUri: "",
      balance: "",
      forSending: false,
    });
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
      address: rawAddress,
    });

    setTimeout(() => {
      socket.on("Transactions", (log: PipedTransaction) => {
        const fToken = tokens[
          network === `` ? `ethereum` : network
        ].tokens.filter((entry) => entry.symbol === log.token);

        const imgUrl =
          fToken?.at(0)?.logo !== undefined ? fToken?.at(0)?.logo : "";
        const tokenColour =
          fToken?.at(0)?.colour !== undefined ? fToken?.at(0)?.colour : "";
        const transactionUrl =
          network === `ethereum`
            ? "https://etherscan.io/tx/" + log.transactionHash
            : "https://explorer.solana.com/tx/" + log.transactionHash;

        toolTip.open(
          fToken.at(0)?.colour || `#000`,
          <ToolTipContent
            tokenLogoSrc={fToken.at(0)?.logo}
            boldTitle={log.amount + ` ` + log.token}
            details={
              log.type === NotificationType.REWARD_DATABASE
                ? log.rewardType === `send`
                  ? `reward for s͟e͟n͟d`
                  : `reward for r͟e͟c͟e͟i͟v͟i͟n͟g`
                : `r͟e͟c͟e͟i͟v͟e͟d from ` + trimAddress(log.source)
            }
            linkLabel={"DETAILS"}
            linkLabelOnClickCallback={async () => {
              log.type === NotificationType.REWARD_DATABASE
                ? setDetailedRewardObject({
                    visible: true,
                    token: log.token,
                    img: imgUrl as unknown as string,
                    colour: tokenColour as unknown as string,
                    winAmount: log.amount,
                    explorerUri: transactionUrl,
                    balance: String(
                      await balance?.(
                        fToken.at(0)?.address as unknown as string
                      )
                    ),
                    forSending: log.rewardType === `send` ? true : false,
                  })
                : window.open(transactionUrl, `_`);
            }}
          />
        );
      });
    }, 8000);
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

  const [hoverModal, setHoverModal] = useState(false);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <header id="flu-logo" className="hide-on-mobile">
        <a onClick={() => navigate("./home")}>
          <img
            style={{ width: "5.5em", height: "2.5em" }}
            src="/images/outlinedLogo.svg"
            alt="Fluidity"
          />
        </a>

        <br />
        <br />

        <ChainSelectorButton
          className="selector-button"
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
            <GeneralButton
              className="fluidify-button-dashboard"
              version={"primary"}
              buttontype="text"
              size={"small"}
              handleClick={() => navigate("../fluidify")}
            >
              <b>Fluidify</b>
            </GeneralButton>

            {/* Prize Money */}
            <GeneralButton
              onMouseEnter={() => setHoverModal(true)}
              onMouseLeave={() => setTimeout(() => setHoverModal(false), 500)}
              className="trophy-button"
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

            {/* Modal on hover */}
            {(hoverModal || showModal) && (
              <UnclaimedRewardsHoverModal setShowModal={setShowModal} />
            )}

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
        <ViewRewardModal
          visible={detailedRewardObject.visible}
          close={() => {
            handleCloseViewRewardDetailModal();
          }}
          callback={() => {
            handleCloseViewRewardDetailModal();
            navigate("./rewards/unclaimed");
          }}
          tokenSymbol={detailedRewardObject.token}
          img={detailedRewardObject.img}
          colour={detailedRewardObject.colour}
          winAmount={detailedRewardObject.winAmount}
          explorerUri={detailedRewardObject.explorerUri}
          balance={detailedRewardObject.balance}
          forSending={detailedRewardObject.forSending}
        />

        <Outlet />

        {/* Mobile Menu Modal */}
        {openMobModal && (
          <MobileModal
            navigationMap={navigationMap.map((obj) => {
              // I love type inconsistency
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

        {/* Provide Luquidity*/}
        {!openMobModal && <ProvideLiquidity />}

        <footer id="flu-socials" className="hide-on-mobile pad-main">
          {/* Links */}
          <section>
            {/* Version */}
            <Text>Fluidity Money</Text>

            {/* Terms */}
            <a href={"/"}>
              <Text>Terms</Text>
            </a>

            {/* Privacy Policy */}
            <a href={"/"}>
              <Text>Privacy policy</Text>
            </a>

            {/* Roadmap */}
            <a href={"https://docs.fluidity.money/docs/fundamentals/roadmap"}>
              <Text>Roadmap</Text>
            </a>
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
