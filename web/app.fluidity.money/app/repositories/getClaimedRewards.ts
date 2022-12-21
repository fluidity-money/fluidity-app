import { captureException } from "@sentry/react";
import { useEffect, useState } from "react";
import { useUserRewardsByAddress } from "~/queries";

export const getClaimedRewards = (network: string, address: string) => {
  const [userTotalRewards, setUserTotalRewards] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const { data, errors } = await useUserRewardsByAddress(
          network,
          address
        );

        if (errors || !data) {
          throw errors;
        }

        const { winners } = data;

        const totalRewards = winners.reduce(
          (sum, { winning_amount, token_decimals }) =>
            sum + winning_amount / 10 ** token_decimals,
          0
        );

        setUserTotalRewards(totalRewards);
      } catch (err) {
        captureException(
          new Error(
            `Could not fetch Transactions count for ${address}, on ${network}`
          ),
          {
            tags: {
              section: "dashboard",
            },
          }
        );
        return;
      }
    })();
  }, [address, network]);
  return userTotalRewards;
};
