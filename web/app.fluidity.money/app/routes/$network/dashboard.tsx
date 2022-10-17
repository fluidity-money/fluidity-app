import { LinksFunction, LoaderFunction } from "@remix-run/node";
import { Outlet, useLoaderData, Link, useNavigate } from "@remix-run/react";

import {
  GeneralButton,
  ArrowDown,
  ArrowUp,
  Text,
  Trophy,
  DashboardIcon,
} from "@fluidity-money/surfing";

import dashboardStyles from "~/styles/dashboard.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: dashboardStyles }];
};

type LoaderData = {
  appName: string;
  version: string;
};

export const loader: LoaderFunction = async ({ request }) => {
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

  return {
    appName: routeMapper(pathname),
    version: "1.5",
  };
};

export default function Dashboard() {
  const { appName, version } = useLoaderData<LoaderData>();

  const navigate = useNavigate();

  return (
    <>
      <header>
        <img src="/logo.svg" alt="Fluidity Logo" />
      </header>
      <nav>
        <ul>
          {/* Dashboard Home */}
          <Link key={"send-money"} to={"home"}>
            <li>
              <DashboardIcon />
              Dashboard
            </li>
          </Link>

          {/* Rewards */}
          <Link key={"send-money"} to={"rewards"}>
            <li>
              <Trophy />
              Rewards
            </li>
          </Link>

          {/* Assets - SCOPED OUT */}
          {/*
          <Link key={"send-money"} to={"assets"}>
            <li>Assets</li>
          </Link>
          */}

          {/* DAO - SCOPED OUT */}
          {/*
          <Link key={"send-money"} to={"/send"}>
            <li>DAO</li>
          </Link>
          */}
        </ul>
      </nav>
      <main>
        <nav>
          <Text>{appName}</Text>
          <div>
            {/* Send */}
            <GeneralButton
              version={"transparent"}
              buttonType="icon before"
              size={"small"}
              handleClick={() => navigate("/send")}
              icon={<ArrowUp />}
            >
              Send
            </GeneralButton>

            {/* Receive */}
            <GeneralButton
              version={"transparent"}
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
              handleClick={() => navigate("/")}
            >
              Fluidify Money
            </GeneralButton>

            {/* Prize Money */}
            <GeneralButton
              version={"transparent"}
              buttonType="icon after"
              size={"small"}
              handleClick={() => navigate("/")}
              icon={<Trophy />}
            >
              $1000.00
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
