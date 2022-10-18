import { LoaderFunction, redirect } from "@remix-run/node";
import config from "~/webapp.config.server";

export const loader: LoaderFunction = async ({ params }) => {
  const { network } = params;

  let redirectTarget = redirect("/");
  Object.keys(config.drivers).forEach((driver) => {
    if (driver === network) {
      redirectTarget = redirect(`/${network}/dashboard/home`, 301);
    }
  });

  return redirectTarget;
};
