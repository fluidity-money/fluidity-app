import { LoaderFunction, json } from "@remix-run/node";
import { claimRewards } from "~/util/chainUtils/instructions";

export const loader: LoaderFunction = async ({ request, params }) => {
  const { network } = params;

  const url = new URL(request.url);
  const address = url.searchParams.get("address");

  const rewards = await claimRewards(address ?? "", network ?? "");

  return json({
    rewards,
  });
};
