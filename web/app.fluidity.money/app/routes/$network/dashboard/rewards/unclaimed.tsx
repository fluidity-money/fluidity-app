import type { Chain } from "~/util/chainUtils/chains";
import type { UserUnclaimedReward } from "~/queries/useUserUnclaimedRewards";
import type { IRow } from "~/components/Table";

import config from "~/webapp.config.server";
import { LoaderFunction, json } from "@remix-run/node";
import { captureException } from "@sentry/react";
import { useLoaderData, useLocation } from "@remix-run/react";
import { useState, useEffect, useContext } from "react";
import FluidityFacadeContext from "contexts/FluidityFacade";
import { UserRewards } from "./common";
import { getTxExplorerLink, getAddressExplorerLink } from "~/util";
import { useUserUnclaimedRewards, useUserRewardsByAddress } from "~/queries";

import { motion } from "framer-motion";
import { Table } from "~/components";
import {
  Heading,
  numberToMonetaryString,
  Text,
  trimAddress,
} from "@fluidity-money/surfing";
import useViewport from "~/hooks/useViewport";

export const unstable_shouldReload = () => false;

export const loader: LoaderFunction = async ({ request, params }) => {
  const network = params.network ?? "";

  const { tokens } = config.config[network];

  const tokenDetailsMap = tokens.reduce(
    (map, token) => ({
      ...map,
      [token.symbol]: { logo: token.logo, address: token.address },
    }),
    {}
  );

  const fluidTokenMap = tokens.reduce(
    (map, token) =>
      token.isFluidOf
        ? {
            ...map,
            [token.symbol]: token.address,
            [token.symbol]: token.isFluidOf,
          }
        : map,
    {}
  );

  const url = new URL(request.url);
  const _pageStr = url.searchParams.get("page");
  const _pageUnsafe = _pageStr ? parseInt(_pageStr) : 1;
  const page = _pageUnsafe > 0 ? _pageUnsafe : 1;

  return json({
    tokenDetailsMap,
    fluidTokenMap,
    page,
    network,
  });
};

type LoaderData = {
  tokenDetailsMap: { [tokenName: string]: { logo: string; address: string } };
  fluidTokenMap: { [tokenName: string]: string };
  page: number;
  network: Chain;
};

type TokenUnclaimedReward = {
  symbol: string;
  reward: number;
};

const UnclaimedWinnings = () => {
  const { network, fluidTokenMap, tokenDetailsMap } =
    useLoaderData<LoaderData>();

  const { connected, address } = useContext(FluidityFacadeContext);

  const [
    { userUnclaimedRewards, unclaimedTxs, unclaimedTokens },
    setUnclaimedRewardsRes,
  ] = useState<{
    unclaimedTxs: UserUnclaimedReward[];
    unclaimedTokens: TokenUnclaimedReward[];
    userUnclaimedRewards: number;
  }>({
    unclaimedTxs: [],
    unclaimedTokens: [],
    userUnclaimedRewards: 0,
  });

  const [userTotalRewards, setUserTotalRewards] = useState(0);

  const [{ networkFee, gasFee }] = useState({
    networkFee: 0,
    gasFee: 0,
  });

  const location = useLocation();

  const { width } = useViewport();
  const isSmallMobile = width < 375;

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

        const userUnclaimedRewards = rewards.reduce((sum, transaction) => {
          const { win_amount, token_decimals } = transaction;

          const decimals = 10 ** token_decimals;
          return sum + win_amount / decimals;
        }, 0);

        const unclaimedTokens = Object.entries(
          rewards.reduce((map, transaction) => {
            const { win_amount, token_decimals, token_short_name } =
              transaction;
            const reward =
              (map[token_short_name] ?? 0) + win_amount / 10 ** token_decimals;

            return {
              ...map,
              [token_short_name]: reward,
            };
          }, {} as { [tokenName: string]: number })
        ).map(([symbol, reward]) => ({ symbol, reward }));

        setUnclaimedRewardsRes({
          unclaimedTxs: rewards,
          unclaimedTokens: unclaimedTokens,
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

    // Get claimed Rewards
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
  }, [connected, address]);

  const unclaimedRewardColumns = isSmallMobile
    ? [{ name: "TOKEN" }, { name: "REWARD" }]
    : [
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

  const unclaimedTokenColumns = [{ name: "TOKEN" }, { name: "REWARD" }];

  const [winningTableViewIndex, setWinningTableViewIndex] = useState(0);

  const winningTableViews = [
    { name: "Your Breakdown", filter: () => true },
    { name: "Your Winnings", filter: () => true },
  ];

  const RewardRow = (chain: Chain): IRow<UserUnclaimedReward> =>
    function Row({
      data,
      index,
    }: {
      data: UserUnclaimedReward;
      index: number;
    }) {
      const { token_decimals, token_short_name, transaction_hash, win_amount } =
        data;

      const rewardUsd = win_amount / 10 ** token_decimals;

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
            <a
              className="table-activity"
              href={getAddressExplorerLink(
                network,
                tokenDetailsMap[token_short_name].address ?? ""
              )}
            >
              <img
                src={
                  tokenDetailsMap[token_short_name].logo ??
                  "/assets/tokens/usdt.svg"
                }
              />
              <Text>{token_short_name}</Text>
            </a>
          </td>

          {/* Reward */}
          <td>
            <Text>
              {rewardUsd >= 0.01
                ? numberToMonetaryString(rewardUsd)
                : `$${rewardUsd}`}
            </Text>
          </td>

          {/* Transaction */}
          {!isSmallMobile && (
            <td>
              <a
                className="table-address"
                href={getTxExplorerLink(chain, transaction_hash)}
              >
                <Text>{trimAddress(transaction_hash)}</Text>
              </a>
            </td>
          )}
        </motion.tr>
      );
    };

  const BreakdownRow = (chain: Chain): IRow<TokenUnclaimedReward> =>
    function Row({
      data,
      index,
    }: {
      data: TokenUnclaimedReward;
      index: number;
    }) {
      const { reward, symbol } = data;

      return (
        <motion.tr
          key={`${symbol}-${index}`}
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
            <a
              className="table-activity"
              href={getAddressExplorerLink(
                chain,
                tokenDetailsMap[symbol].address ?? ""
              )}
            >
              <img
                src={tokenDetailsMap[symbol].logo ?? "/assets/tokens/usdt.svg"}
              />
              <Text>{symbol}</Text>
            </a>
          </td>

          {/* Reward */}
          <td>
            <Text>
              {reward >= 0.01 ? numberToMonetaryString(reward) : `$${reward}`}
            </Text>
          </td>
        </motion.tr>
      );
    };

  return (
    <div className="pad-main">
      {/* Info Card - Only accessible for Ethereum */}
      {network === "ethereum" && !!userUnclaimedRewards && (
        <UserRewards
          claimNow={true}
          unclaimedRewards={userUnclaimedRewards}
          claimedRewards={userTotalRewards}
          network={network}
          networkFee={networkFee}
          gasFee={gasFee}
          tokenAddrs={unclaimedTokens.map(
            ({ symbol }) => fluidTokenMap[symbol]
          )}
        />
      )}

      <Heading as={"h2"}>
        {winningTableViews[winningTableViewIndex].name}
      </Heading>

      {/* Unclaimed Transactions */}
      <section id="table">
        {winningTableViewIndex === 0 && (
          <Table
            pagination={{
              page: txTablePage,
              rowsPerPage: 12,
            }}
            itemName={"unclaimed tokens"}
            headings={unclaimedTokenColumns}
            count={unclaimedTokens.length}
            data={unclaimedTokens}
            renderRow={BreakdownRow(network)}
            filters={winningTableViews}
            onFilter={setWinningTableViewIndex}
            activeFilterIndex={winningTableViewIndex}
          />
        )}
        {winningTableViewIndex === 1 && (
          <Table
            pagination={{
              page: txTablePage,
              rowsPerPage: 12,
            }}
            itemName={"unclaimed columns"}
            headings={unclaimedRewardColumns}
            count={unclaimedTxs.length}
            data={unclaimedTxs}
            renderRow={RewardRow(network)}
            filters={winningTableViews}
            onFilter={setWinningTableViewIndex}
            activeFilterIndex={winningTableViewIndex}
          />
        )}
      </section>
    </div>
  );
};

export default UnclaimedWinnings;
