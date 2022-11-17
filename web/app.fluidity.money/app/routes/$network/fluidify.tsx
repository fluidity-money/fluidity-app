import type { MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

import styles from "~/styles/fluidify.css";

export const links = () => {
  return [
    {
      rel: "stylesheet",
      href: styles,
    },
  ];
};

export let meta: MetaFunction = ({data}) => ({
  ...data,
  title: "Fluidify",
})

export default function Fluidify() {
  return (
    <>
      <Outlet />
    </>
  );
}
