import type { Chain } from "~/util/chainUtils/chains";
import type { UserUnclaimedReward } from "~/queries/useUserUnclaimedRewards";
import type { IRow } from "~/components/Table";

import { LoaderFunction, json } from "@remix-run/node";
import { captureException } from "@sentry/react";
import { useLoaderData, Link, useLocation } from "@remix-run/react";
import { useState, useEffect, useContext } from "react";
import FluidityFacadeContext from "contexts/FluidityFacade";
import { UserRewards } from "./common";
import { getTxExplorerLink } from "~/util";
import { useUserUnclaimedRewards } from "~/queries";

import { motion } from "framer-motion";
import { Table } from "~/components";
import { Heading, Text, trimAddress } from "@fluidity-money/surfing";

export const unstable_shouldReload = () => false;

export const loader: LoaderFunction = async ({ request, params }) => {
  const network = params.network ?? "";

  const networkFee = 0.002;
  const gasFee = 0.002;

  const url = new URL(request.url);
  const _pageStr = url.searchParams.get("page");
  const _pageUnsafe = _pageStr ? parseInt(_pageStr) : 1;
  const page = _pageUnsafe > 0 ? _pageUnsafe : 1;

  return json({
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
          <Link to={getTxExplorerLink(chain, transaction_hash)}>
            <Text>{trimAddress(transaction_hash)}</Text>
          </Link>
        </td>
      </motion.tr>
    );
  };

const UnclaimedWinnings = () => {
  const {
    network,
    networkFee,
    gasFee,
  } = useLoaderData<LoaderData>();

  const { connected, address } = useContext(FluidityFacadeContext);
  
  const [
    { userUnclaimedRewards, unclaimedTxs, count },
    setUnclaimedRewardsRes,
  ] = useState<{
    unclaimedTxs: UserUnclaimedReward[];
    count: number;
    userUnclaimedRewards: number;
  }>({
    unclaimedTxs: [],
    count: 0,
    userUnclaimedRewards: 0,
  });

  const location = useLocation();

  const pageRegex = /page=[0-9]+/gi;
  const _pageMatches = location.search.match(pageRegex);
  const _pageStr = _pageMatches?.length ? _pageMatches[0].split("=")[1] : "";
  const _pageUnsafe = _pageStr ? parseInt(_pageStr) : 1;
  const txTablePage = _pageUnsafe > 0 ? _pageUnsafe : 1;
  
  useEffect(() => {
    if (!connected || !address) return;

    // Get Unclaimed Rewards - Expect to fail if Solana
    (async () => {
      try {
        const { data, error } = await useUserUnclaimedRewards(
          network,
          address ?? ""
        );

        if (!data || error) return;

        const { ethereum_pending_winners: rewards } = data;

        const sanitisedRewards = rewards.filter(
          (transaction: UserUnclaimedReward) => !transaction.reward_sent
        );

        const userUnclaimedRewards = sanitisedRewards.reduce(
          (sum: number, transaction: UserUnclaimedReward) => {
            const { win_amount, token_decimals } = transaction;

            const decimals = 10 ** token_decimals;
            return sum + win_amount / decimals;
          },
          0
        );

        setUnclaimedRewardsRes({
          unclaimedTxs: sanitisedRewards,
          count,
          userUnclaimedRewards,
        });
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
  }, [connected, address]);
  return (
    <div className="pad-main">
      {/* Info Card - Only accessible for Ethereum */}
      {network === "ethereum" && !!userUnclaimedRewards && (
        <UserRewards
          claimNow={true}
          unclaimedRewards={userUnclaimedRewards}
          network={network}
          networkFee={networkFee}
          gasFee={gasFee}
        />
      )}

      <Heading as={"h2"}>Your Winnings</Heading>

      {/* Unclaimed Transactions */}
      <section id="table">
        <Table
          itemName="unclaimed rewards"
          headings={unclaimedRewardColumns}
          pagination={{
            page: txTablePage,
            rowsPerPage: 12,
          }}
          count={count}
          data={unclaimedTxs}
          renderRow={RewardRow(network)}
        />
      </section>
    </div>
  );
};

export default UnclaimedWinnings;
