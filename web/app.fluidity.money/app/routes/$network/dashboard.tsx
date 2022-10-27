import { LinksFunction } from "@remix-run/node";
import {
  Link,
  Outlet,
  useResolvedPath,
  useMatches,
  useTransition,
} from "@remix-run/react";

import dashboardStyles from "~/styles/dashboard.css";

import { motion } from "framer-motion";

import { Text } from "@fluidity-money/surfing";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: dashboardStyles }];
};

export default function Dashboard() {
  const navigationMap = [
    { home: "Dashboard" },
    { rewards: "Rewards" },
    { assets: "Assets" },
    { dao: "DAO" },
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
        <Outlet />
      </main>
    </>
  );
}
