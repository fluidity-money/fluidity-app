import { json, LoaderFunction } from "@remix-run/node";
import useApplicationRewardStatistics from "~/queries/useApplicationRewardStatistics";
import { aggregateRewards } from "~/util/rewardAggregates";

export const loader: LoaderFunction = async ({ params: { network } }) => {
  const { data: rewardData, errors } = await useApplicationRewardStatistics(
    network ?? ""
  );
  if (errors || !rewardData) {
    throw errors;
  }

  const rewarders = aggregateRewards(rewardData);

  return json({
    ...rewarders,
  });
};
