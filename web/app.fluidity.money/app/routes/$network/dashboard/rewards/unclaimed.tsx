import type { Chain } from "~/util/chainUtils/chains";
import type { UserUnclaimedReward } from "~/queries/useUserUnclaimedRewards";
import type { IRow } from "~/components/Table";

import { LoaderFunction, json, redirect } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { UserRewards } from "./common";
import { getAddressExplorerLink } from "~/util";
import { useUserUnclaimedRewards } from "~/queries";

import { motion } from "framer-motion";
import { Table } from "~/components";
import { Heading, Text, trimAddress } from "@fluidity-money/surfing";

const address = "0xbb9cdbafba1137bdc28440f8f5fbed601a107bb6";

export const loader: LoaderFunction = async ({ request, params }) => {
  const network = params.network ?? "";

  const networkFee = 0.002;
  const gasFee = 0.002;

  const url = new URL(request.url);
  const _pageStr = url.searchParams.get("page");
  const _pageUnsafe = _pageStr ? parseInt(_pageStr) : 1;
  const page = _pageUnsafe > 0 ? _pageUnsafe : 1;

  const { data, error } = await useUserUnclaimedRewards(network, address);

  if (error || !data) {
    return redirect("/error", { status: 500, statusText: error });
  }

  const { ethereum_pending_winners: rewards } = data;

  const sanitisedRewards = rewards.filter(
    (transaction: UserUnclaimedReward) => !transaction.reward_sent
  );

  const unclaimedRewardsLength = sanitisedRewards.length;

  if (unclaimedRewardsLength === 0) {
    return redirect("..");
  }

  const totalUnclaimedRewards = sanitisedRewards.reduce(
    (sum: number, transaction: UserUnclaimedReward) => {
      const { win_amount, token_decimals } = transaction;

      const decimals = 10 ** token_decimals;
      return sum + win_amount / decimals;
    },
    0
  );

  return json({
    rewards: sanitisedRewards,
    count: unclaimedRewardsLength,
    totalUnclaimedRewards,
    page,
    network,
    networkFee,
    gasFee,
  });
};

type LoaderData = {
  rewards: UserUnclaimedReward[];
  count: number;
  totalUnclaimedRewards: number;
  page: number;
  network: Chain;
  networkFee: number;
  gasFee: number;
};

const unclaimedRewardColumns = [
  {
    name: "TOKEN",
  },
  {
    name: "REWARD",
  },
  {
    name: "TRANSACTION",
    alignRight: true,
  },
];

const RewardRow = (chain: Chain): IRow<UserUnclaimedReward> =>
  function Row({ data, index }: { data: UserUnclaimedReward; index: number }) {
    const { token_decimals, token_short_name, transaction_hash, win_amount } =
      data;

    return (
      <motion.tr
        key={`${transaction_hash}-${index}`}
        variants={{
          enter: { opacity: [0, 1] },
          ready: { opacity: 1 },
          exit: { opacity: 0 },
          transitioning: {
            opacity: [0.75, 1, 0.75],
            transition: { duration: 1.5, repeat: Infinity },
          },
        }}
      >
        {/* Token */}
        <td>
          <a>
            <Text>{token_short_name}</Text>
          </a>
        </td>

        {/* Reward */}
        <td>
          <Text>
            {(win_amount / 10 ** token_decimals).toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </Text>
        </td>

        {/* Transaction */}
        <td>
          <Link to={getAddressExplorerLink(chain, transaction_hash)}>
            <Text>{trimAddress(transaction_hash)}</Text>
          </Link>
        </td>
      </motion.tr>
    );
  };

const UnclaimedWinnings = () => {
  const {
    rewards,
    count,
    totalUnclaimedRewards,
    page,
    network,
    networkFee,
    gasFee,
  } = useLoaderData<LoaderData>();

  return (
    <div className="pad-main">
      {/* Info Card - Only accessible for Ethereum */}
      {network === "ethereum" && (
        <UserRewards
          claimNow={true}
          unclaimedRewards={totalUnclaimedRewards}
          network={network}
          networkFee={networkFee}
          gasFee={gasFee}
        />
      )}

      <Heading as={"h2"}>Your Winnings</Heading>

      {/* Unclaimed Transactions */}
      <section id="table">
        <Table
          itemName="transactions"
          headings={unclaimedRewardColumns}
          pagination={{
            page: page,
            rowsPerPage: 12,
          }}
          count={count}
          data={rewards}
          renderRow={RewardRow(network)}
        />
      </section>
    </div>
  );
};

export default UnclaimedWinnings;
