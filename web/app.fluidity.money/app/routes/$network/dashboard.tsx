import { LinksFunction, LoaderFunction, json } from "@remix-run/node";
import {
  Link,
  Outlet,
  useLoaderData,
  useNavigate,
  useResolvedPath,
  useMatches,
  useTransition,
} from "@remix-run/react";
import type { UserUnclaimedReward } from "~/queries/useUserUnclaimedRewards";
import { useState, useEffect, useContext } from "react";
import { Web3Context } from "~/util/chainUtils/web3";
import useViewport from "~/hooks/useViewport";
import { useUserUnclaimedRewards } from "~/queries";
import { motion } from "framer-motion";
import BurgerButton from "~/components/BurgerButton";
import ProvideLiquidity from "~/components/ProvideLiquidity";
import config from "~/webapp.config.server";
import { io } from "socket.io-client";
import { PipedTransaction } from "drivers/types";
import { useToolTip } from "~/components";
import { ToolTipContent } from "~/components/ToolTip";
import { trimAddress } from "~/util";
import {
  DashboardIcon,
  GeneralButton,
  Trophy,
  Text,
  ChainSelectorButton,
} from "@fluidity-money/surfing";

import dashboardStyles from "~/styles/dashboard.css";
import { SolanaWalletModal } from "~/components/WalletModal/SolanaWalletModal";
import ChainModal from "~/components/ChainModal";
import { BlobOptions } from "buffer";
import { useWallet } from "@solana/wallet-adapter-react";

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
      case "assets":
        return "ASSETS";
      case "dao":
        return "DAO";
      default:
        return "DASHBOARD";
    }
  };

  const urlPaths = url.pathname.split("/");

  const pathname = urlPaths[urlPaths.length - 1];

  const network = params.network ?? "";

  const provider = config.liquidity_providers;

  const token = config.config;

  return json({
    appName: routeMapper(pathname),
    version: "1.5",
    network,
    provider,
    token,
  });
};

type LoaderData = {
  appName: string;
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
  const { appName, version, network, token } = useLoaderData<LoaderData>();

  const navigate = useNavigate();

  const { state } = useContext(Web3Context());
  const account = state.account ?? "";

  const { width } = useViewport();
  const isMobile = width <= 500;
  const isTablet = width <= 850 && width > 500;

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
    (path) => path.pathname === currentPath
  );

  const [unclaimedRewards, setUnclaimedRewards] = useState(0);
  const [walletModalVisibility, setWalletModalVisibility] =
    useState<boolean>(false);
  const [chainModalVisibility, setChainModalVisibility] =
    useState<boolean>(false);

  const { connected, publicKey } = useWallet();

  useEffect(() => {
    (async () => {
      const { data, error } = await useUserUnclaimedRewards(network, account);

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
    const connected_wallet =
      network === `ethereum`
        ? `0x737B7865f84bDc86B5c8ca718a5B7a6d905776F6`
        : connected
        ? publicKey?.toString()
        : "JLxpt7UK4gjQaT8ZC9rvk7M4aK3P6pknzX9HdrzsRYi";

    const socket = io();
    socket.emit("subscribeTransactions", {
      protocol: network,
      address: connected_wallet,
    });

    socket.on("Transactions", (log: PipedTransaction) => {
      const fToken = token[network === `` ? `ethereum` : network].tokens.filter(
        (entry) => entry.symbol === log.token
      );

      toolTip.open(
        fToken.at(0)?.colour,
        <ToolTipContent
          tokenLogoSrc={fToken.at(0)?.logo}
          boldTitle={log.amount + ` ` + log.token}
          details={
            log.source === connected_wallet
              ? `Sent to ` + trimAddress(log.destination)
              : `Received from ` + trimAddress(log.source)
          }
          linkLabel={"ASSETS"}
          linkUrl={"#"}
        />
      );
    });
  }, []);

  return (
    <>
      <header id="flu-logo" className="hide-on-mobile">
        <img src="/images/logoOutline.png" alt="Fluidity" />

        <br />

        <ChainSelectorButton
          chain={chainNameMap[network as "ethereum" | "solana"]}
          onClick={() => setChainModalVisibility(true)}
        />
      </header>

      <ChainModal
        visible={chainModalVisibility}
        setVisible={setChainModalVisibility}
        network={network}
        chains={chainNameMap}
      />

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
                  <Text prominent={active}>
                    {icon} {name}
                  </Text>
                </Link>
              </li>
            );
          })}
        </ul>
    
        {/* Connect Wallet Button */}
        <GeneralButton
          version={connected ? "transparent" : "primary"}
          buttontype="text"
          size={"medium"}
          handleClick={() => !connected && setWalletModalVisibility(true)}
          className="connect-wallet-btn"
        >
          {connected
            ? trimAddress(publicKey?.toString() as unknown as string)
            : `Connnect Wallet`}
        </GeneralButton>
      </nav>

      <main id="dashboard-body">
        <nav id="top-navbar" className={"pad-main"}>

          {/* App Name */}
          {isMobile ? (
            <img src="/images/logoOutline.png" alt="Fluidity" />
          ) : isTablet ? (
            <div className="top-navbar-left">
              <img src="/images/logoOutline.png" alt="Fluidity" />
              <Text>{appName}</Text>
            </div>
          ) : (
            <Text>{appName}</Text>
          )}

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
            {!isMobile && (
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
              version={"secondary"}
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
              <BurgerButton />
            )}
          </div>

        </nav>

        {/* Connect Wallet Modal */}
        {network === `solana` ? (
          <SolanaWalletModal
            visible={walletModalVisibility}
            close={() => setWalletModalVisibility(false)}
          />
        ) : null}
        <Outlet />

        {/* Provide Luquidity*/}
        <ProvideLiquidity />

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
