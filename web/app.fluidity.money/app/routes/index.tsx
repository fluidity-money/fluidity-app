import { LoaderFunction, redirect } from "@remix-run/node";
import { useSplitExperiment } from "~/util/split";

export const loader: LoaderFunction = async () => {
  const defaultNetwork = useSplitExperiment("enable-arbitrum", true)
    ? "arbitrum"
    : "ethereum";

  return redirect(`/${defaultNetwork}/dashboard/home`);
};
