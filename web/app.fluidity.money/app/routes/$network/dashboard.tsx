import { LinksFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

import dashboardStyles from "~/styles/dashboard.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: dashboardStyles }];
};

export default function Dashboard() {
  return (
    <>
      <header>
        <img src="/logo.svg" alt="Fluidity Logo" />
      </header>
      <nav>
        <ul>
          <li>Dashboard</li>
          <li>Rewards</li>
          <li>Assets</li>
          <li>DAO</li>
        </ul>
      </nav>
      <main>
        <Outlet />
      </main>
    </>
  );
}
