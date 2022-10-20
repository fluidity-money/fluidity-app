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
import { useUserUnclaimedRewards } from "~/queries";

import {
  GeneralButton,
  ArrowDown,
  ArrowUp,
  Text,
} from "@fluidity-money/surfing";

import dashboardStyles from "~/styles/dashboard.css";

import { motion } from "framer-motion";
import ProvideLiquidity from "~/components/ProvideLiquidity";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: dashboardStyles }];
};

const address = "0xbb9cdbafba1137bdc28440f8f5fbed601a107bb6";

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

  let unclaimedRewards;
  let error;

  try {
    unclaimedRewards = await // Check address strips leading 0x
    (await useUserUnclaimedRewards(network, address)).json();

    if (unclaimedRewards.error) {
      error = "Could not fetch User Unclaimed Rewards";
    }
  } catch (err) {
    error = "Could not fetch User Unclaimed Rewards";
  }

  if (error) {
    return {
      appName: routeMapper(pathname),
      version: "1.5",
      totalUnclaimedRewards: 0,
    };
  }

  const {
    data: { ethereum_pending_winners: rewards },
  } = unclaimedRewards;

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

  return {
    appName: routeMapper(pathname),
    version: "1.5",
    totalUnclaimedRewards,
  };
};

type LoaderData = {
  appName: string;
  version: string;
  totalUnclaimedRewards: number;
};

export default function Dashboard() {
  const { appName, version, totalUnclaimedRewards } =
    useLoaderData<LoaderData>();

  const navigate = useNavigate();

  const navigationMap = [
    { home: "Dashboard" },
    { rewards: "Rewards" },
    // {assets: "Assets"},
    // {dao: "DAO"},
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

  return (
    <>
      <header>
        <img src="/logo.svg" alt="Fluidity Logo" />
      </header>

      <nav className={"navbar-v2"}>
        <ul>
          {navigationMap.map((obj, index) => {
            const key = Object.keys(obj)[0];
            const value = Object.values(obj)[0];
            const active = index === activeIndex;

            return (
              <li key={key}>
                {index === activeIndex ? (
                  <motion.div className={"active"} layoutId="active" />
                ) : (
                  <div />
                )}
                <Text prominent={active}>
                  <Link to={key}>{value}</Link>
                </Text>
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
            <GeneralButton
              version={"secondary"}
              buttonType="icon before"
              size={"small"}
              handleClick={() => navigate("/send")}
              icon={<ArrowUp />}
            >
              Send
            </GeneralButton>

            {/* Receive */}
            <GeneralButton
              version={"secondary"}
              buttonType="icon before"
              size={"small"}
              handleClick={() => navigate("/receive")}
              icon={<ArrowDown />}
            >
              Recieve
            </GeneralButton>

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
                totalUnclaimedRewards
                  ? navigate("./rewards/unclaimed")
                  : navigate("./rewards")
              }
              icon={<ArrowDown />}
            >
              ${totalUnclaimedRewards}
            </GeneralButton>
          </div>
        </nav>

        <Outlet />

        {/* Provide Luquidity*/}

        <ProvideLiquidity />

        {/* Footer */}

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
