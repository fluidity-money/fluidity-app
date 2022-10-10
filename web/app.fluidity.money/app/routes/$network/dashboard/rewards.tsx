import { LinksFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import dashboardRewardsStyle from "~/styles/dashboard/rewards.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: dashboardRewardsStyle }];
};

export default function Rewards() {
  return (
    <>
      <Outlet />
    </>
  );
}
