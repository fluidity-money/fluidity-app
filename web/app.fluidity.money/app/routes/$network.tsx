import type { LoaderFunction } from "@remix-run/node";

import config from "~/webapp.config.js";
import { redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

export const loader: LoaderFunction = async ({params}) => {
  // Prevent unknown network params
  const { network } = params;

  const redirectTarget = redirect("/");

  if (!network) return redirectTarget;

  if (network in config.drivers === false) return redirectTarget;
  
  return true;
}

export default function Network() {
  // TODO: Inject Chain Provider

  return (
    <>
      <Outlet />
    </>
  );
}
