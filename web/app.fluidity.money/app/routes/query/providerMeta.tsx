import { json, LoaderFunction } from "@remix-run/node";
import config from "~/webapp.config.server";

export const loader: LoaderFunction = async () => {
  return json({
    ...config.provider_icons,
  });
};
