import { LoaderFunction, redirect } from "@remix-run/node";
import config from "~/webapp.config.js";

export const loader: LoaderFunction = async ({ params }) => {
  const { network } = params;
  console.log(network);

  let redirectTarget = redirect("/");
  Object.keys(config.drivers).forEach((driver) => {
    console.log(driver);
    if (driver === network) {
      redirectTarget = redirect(`/${network}/dashboard/home`, 301);
    }
  });

  return redirectTarget;
};
