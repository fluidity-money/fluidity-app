import { LoaderFunction, redirect } from "@remix-run/node";
import config from "~/webapp.config.js";

export const loader: LoaderFunction = async ({ params }) => {
  const { network } = params;

  const redirectTarget = redirect("/");
  
  if (!network) return redirectTarget;
  
  if (network in config.drivers === false) return redirectTarget;
  
  return redirect(`/${network}/dashboard/home`, 301);
};
