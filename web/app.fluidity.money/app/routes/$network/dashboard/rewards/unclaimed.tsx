import type { Chain } from "~/util/chainUtils/chains";
import type { UserUnclaimedReward } from "~/queries/useUserUnclaimedRewards";
import type { IRow } from "~/components/Table";
import type {
  UnclaimedLoaderData,
  TokenUnclaimedReward,
} from "../../query/dashboard/unclaimed";

import config from "~/webapp.config.server";
import { LoaderFunction, json } from "@remix-run/node";
import { useFetcher, useLoaderData, useLocation } from "@remix-run/react";
import { useState, useContext, useEffect } from "react";
import FluidityFacadeContext from "contexts/FluidityFacade";
import { UserRewards } from "./common";
import { getTxExplorerLink, getAddressExplorerLink } from "~/util";

import { motion } from "framer-motion";
import { Table } from "~/components";
import {
  Heading,
  numberToMonetaryString,
  Text,
  trimAddress,
  useViewport,
} from "@fluidity-money/surfing";
import { getBlockExplorerLink } from "~/util/chainUtils/links";

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
            [token.symbol.slice(1)]: token.address,
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

const SAFE_DEFAULT = {
  unclaimedTxs: [],
  unclaimedTokens: [],
  userUnclaimedRewards: 0,
  userClaimedRewards: 0,
};

const UnclaimedWinnings = () => {
  const { network, fluidTokenMap, tokenDetailsMap } =
    useLoaderData<LoaderData>();

  const { address } = useContext(FluidityFacadeContext);

  const unclaimedData = useFetcher<UnclaimedLoaderData>();

  useEffect(() => {
    if (!address) return;

    unclaimedData.load(
      `/${network}/query/dashboard/unclaimed?address=${address}`
    );
  }, [address]);

  const {
    unclaimedTxs,
    unclaimedTokens,
    userUnclaimedRewards,
    userClaimedRewards,
  } = {
    ...SAFE_DEFAULT,
    ...unclaimedData.data,
  };

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

  // Get claimed Rewards
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
        },
        {
          name: "BLOCK",
          alignRight: true,
        },
      ];

  const unclaimedTokenColumns = [{ name: "TOKEN" }, { name: "REWARD" }];

  const [winningTableViewIndex, setWinningTableViewIndex] = useState(0);

  const winningTableViews = [
    { name: "My Breakdown", filter: () => true },
    { name: "My Winnings", filter: () => true },
  ];

  const RewardRow = (chain: Chain): IRow<UserUnclaimedReward> =>
    function Row({
      data,
      index,
    }: {
      data: UserUnclaimedReward;
      index: number;
    }) {
      const {
        token_decimals,
        token_short_name,
        transaction_hash,
        win_amount,
        block_number,
      } = data;

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
            <Text prominent>{numberToMonetaryString(rewardUsd)}</Text>
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

          {/* Block Number */}
          {!isSmallMobile && (
            <td>
              <a
                style={{ textDecoration: "underline" }}
                href={getBlockExplorerLink(network, block_number)}
              >
                <Text>{block_number}</Text>
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
            <Text prominent>{numberToMonetaryString(reward)}</Text>
          </td>
        </motion.tr>
      );
    };

  return (
    <div className="pad-main">
      {/* Info Card - Only accessible for Ethereum/Arbitrum */}
      {(network === "ethereum" || network === "arbitrum") &&
        !!userUnclaimedRewards && (
          <UserRewards
            claimNow={true}
            unclaimedRewards={userUnclaimedRewards}
            claimedRewards={userClaimedRewards}
            network={network}
          />
        )}

      {!!address && unclaimedData.state === "loading" && (
        <div style={{ marginBottom: "12px" }}>
          <Text>Loading data...</Text>
        </div>
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
            itemName={"unclaimed wins"}
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
