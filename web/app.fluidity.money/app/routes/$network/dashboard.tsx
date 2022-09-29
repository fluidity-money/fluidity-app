import { LinksFunction, LoaderFunction } from "@remix-run/node";
import { Outlet, useLoaderData, Link } from "@remix-run/react";

import { GeneralButton, ArrowDown, ArrowUp, Text } from "@fluidity-money/surfing";

import dashboardStyles from "~/styles/dashboard.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: dashboardStyles }];
};

type LoaderData = {
  appName: string;
}

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
  }
  
  const pathname = url.pathname.split("/").pop() || "dashboard";
  
  return {
    appName: routeMapper(pathname),
  }

}

export default function Dashboard() {
  const { appName } = useLoaderData<LoaderData>();

  return (
    <>
      <header>
        <img src="/logo.svg" alt="Fluidity Logo" />
      </header>
      <nav>
        <ul>
          {/* Dashboard Home */}
          <Link key={"send-money"} to={"/dashboard/home"}>
            <li>Dashboard</li>
          </Link>

          {/* Rewards */}
          <Link key={"send-money"} to={"/dashboard/rewards"}>
            <li>Rewards</li>
          </Link>

          {/* Assets - SCOPED OUT */}
          {/*<Link key={"send-money"} to={"/dashboard/assets"}>
            <li>Assets</li>
          </Link>*/}

          {/* DAO - SCOPED OUT */}
          {/*<Link key={"send-money"} to={"/send"}>
            <li>DAO</li>
          </Link>*/}
        </ul>
      </nav>
      <main>
        <nav>
          <Text>{appName}</Text>
          <div>
            <Link key={"send-money"} to={"/send"}>
              <GeneralButton
                version={"secondary"}
                buttonType="icon before"
                size={"small"}
                handleClick={() => {}}
                icon={<ArrowUp />}
              >
                Send
              </GeneralButton>
            </Link>
            <Link key={"receive-money"} to={"/receive"}>
              <GeneralButton
                version={"secondary"}
                buttonType="icon before"
                size={"small"}
                handleClick={() => {}}
                icon={<ArrowDown />}
              >
                Recieve
              </GeneralButton>
            </Link>
            <Link key={"fluidify-money"} to={"/"}>
              <GeneralButton
                version={"primary"}
                buttonType="text"
                size={"small"}
                handleClick={() => {}}
              >
                Fluidify Money
              </GeneralButton>
            </Link>
            <Link key={"prize-money"} to={"/"}>
              <GeneralButton
                version={"secondary"}
                buttonType="icon after"
                size={"small"}
                handleClick={() => {}}
                icon={<ArrowDown />}
              >
                $1000.00
              </GeneralButton>
            </Link>
          </div>
        </nav>
        <Outlet />
      </main>
    </>
  );
}
