import type { UserUnclaimedReward } from "~/queries/useUserUnclaimedRewards";

import { LinksFunction, LoaderFunction } from "@remix-run/node";
import {
  Outlet,
  useLoaderData,
  Link,
  useNavigate,
  useResolvedPath,
  useMatches,
  useTransition,
} from "@remix-run/react";
import { useState, useEffect, useContext } from "react";
import { Web3Context } from "~/util/chainUtils/web3";
import { useUserUnclaimedRewards } from "~/queries";

import {
  DashboardIcon,
  GeneralButton,
  Trophy,
  Text,
} from "@fluidity-money/surfing";

import dashboardStyles from "~/styles/dashboard.css";

import { motion } from "framer-motion";

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

  return {
    appName: routeMapper(pathname),
    version: "1.5",
    network,
  };
};

type LoaderData = {
  appName: string;
  version: string;
  network: string;
};

export default function Dashboard() {
  const { appName, version, network } = useLoaderData<LoaderData>();

  const navigate = useNavigate();

  const { state } = useContext(Web3Context());
  const account = state.account ?? "";

  const navigationMap = [
    { home: { name: "Dashboard", icon: <DashboardIcon /> } },
    { rewards: { name: "Rewards", icon: <Trophy /> } },
    // {assets: {name: "Assets", icon: <AssetsIcon />}},
    // {dao: {name:"DAO", icon: <DaoIcon />}},
  ];

  const matches = useMatches();
  const transitionPath = useTransition().location?.pathname;
  const currentPath = transitionPath || matches[matches.length - 1].pathname;
  const resolvedPaths = navigationMap.map((obj) =>
    useResolvedPath(Object.keys(obj)[0])
  );
  const activeIndex = resolvedPaths.findIndex(
    (path) => path.pathname === currentPath
  );

  const [unclaimedRewards, setUnclaimedRewards] = useState(0);

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
  }, []);

  return (
    <>
      <header>
        <img src="/logo.svg" alt="Fluidity Logo" />
      </header>

      <nav className={"navbar-v2"}>
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
                    {icon}
                    {name}
                  </Text>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <main>
        <nav>
          <Text>{appName}</Text>
          <div>
            {/* Send */}
            {/*
            <GeneralButton
              version={"secondary"}
              buttonType="icon before"
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
              buttonType="icon before"
              size={"small"}
              handleClick={() => navigate("/receive")}
              icon={<ArrowDown />}
            >
              Recieve
            </GeneralButton>
            */}

            {/* Fluidify */}
            <GeneralButton
              version={"primary"}
              buttonType="text"
              size={"small"}
              handleClick={() => navigate("../fluidify")}
            >
              Fluidify Money
            </GeneralButton>

            {/* Prize Money */}
            <GeneralButton
              version={"secondary"}
              buttonType="icon after"
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
          </div>
        </nav>

        <Outlet />

        <footer>
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
