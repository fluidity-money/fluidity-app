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

  const url = new URL(request.url);
  const _pageStr = url.searchParams.get("page");
  const _pageUnsafe = _pageStr ? parseInt(_pageStr) : 1;
  const page = _pageUnsafe > 0 ? _pageUnsafe : 1;

  return json({
    tokenDetailsMap,
    page,
    network,
  });
};

type LoaderData = {
  tokenDetailsMap: { [tokenName: string]: { logo: string; address: string } };
  page: number;
  network: Chain;
};

const SAFE_DEFAULT_UNCLAIMED = {
  unclaimedTxs: [],
  unclaimedTokens: [],
  userUnclaimedRewards: 0,
  userClaimedRewards: 0,
  loaded: false,
};

const UnclaimedWinnings = () => {
  const { network, tokenDetailsMap } = useLoaderData<LoaderData>();

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
    loaded,
  }: UnclaimedLoaderData = {
    ...SAFE_DEFAULT_UNCLAIMED,
    ...unclaimedData.data,
  };

  const location = useLocation();

  const { width } = useViewport();
  const isSmallMobile = width < 375;

  const pageRegex = /page=[0-9]+/gi;
  const _pageMatches = location.search.match(pageRegex);
  const _pageStr = _pageMatches?.length ? _pageMatches[0].split("=")[1] : "";
  const _pageUnsafe = _pageStr ? parseInt(_pageStr) : 1;
  const txTablePage = _pageUnsafe > 0 ? _pageUnsafe : 1;

  // Get claimed Rewards
  const unclaimedRewardColumns = [
    {
      name: "TOKEN",
    },
    {
      name: "REWARD",
    },
    {
      name: "TRANSACTION",
      show: !isSmallMobile,
    },
    {
      name: "BLOCK",
      show: !isSmallMobile,
      alignRight: true,
    },
  ];

  const unclaimedTokenColumns = [{ name: "TOKEN" }, { name: "REWARD" }];

  const [winningTableViewIndex, setWinningTableViewIndex] = useState(0);

  const winningTableViews = [
    { name: "My Breakdown", filter: () => true },
    { name: "My Winnings", filter: () => true },
  ];

  const rewardRow = (data: UserUnclaimedReward, chain: Chain): IRow => {
    const {
      token_decimals,
      token_short_name,
      transaction_hash,
      win_amount,
      block_number,
    } = data;

    const rewardUsd = win_amount / 10 ** token_decimals;

    return {
      RowElement: ({ heading }: { heading: string }) => {
        switch (heading) {
          case "TOKEN":
            return (
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
            );
          case "REWARD":
            return (
              <td>
                <Text prominent>{numberToMonetaryString(rewardUsd)}</Text>
              </td>
            );
          case "TRANSACTION":
            return (
              <td>
                <a
                  className="table-address"
                  href={getTxExplorerLink(chain, transaction_hash)}
                >
                  <Text>{trimAddress(transaction_hash)}</Text>
                </a>
              </td>
            );
          case "BLOCK":
            return (
              <td>
                <a
                  style={{ textDecoration: "underline" }}
                  href={getBlockExplorerLink(network, block_number)}
                >
                  <Text>{block_number}</Text>
                </a>
              </td>
            );
          default:
            return <></>;
        }
      },
    };
  };

  const breakdownRow = (data: TokenUnclaimedReward, chain: Chain): IRow => {
    const { reward, symbol } = data;

    return {
      RowElement: ({ heading }: { heading: string }) => {
        switch (heading) {
          case "TOKEN":
            return (
              <td>
                <a
                  className="table-activity"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={getAddressExplorerLink(
                    chain,
                    tokenDetailsMap[symbol].address ?? ""
                  )}
                >
                  <img
                    src={
                      tokenDetailsMap[symbol].logo ?? "/assets/tokens/usdt.svg"
                    }
                  />
                  <Text>{symbol}</Text>
                </a>
              </td>
            );
          case "REWARD":
            return (
              <td>
                <Text prominent>{numberToMonetaryString(reward)}</Text>
              </td>
            );
          default:
            return <></>;
        }
      },
    };
  };

  return (
    <div className="pad-main">
      {/* Info Card - Only accessible for Ethereum/Arbitrum */}
      {network === "arbitrum" && !!userUnclaimedRewards && (
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
            renderRow={(data) => breakdownRow(data, network)}
            filters={winningTableViews}
            onFilter={setWinningTableViewIndex}
            activeFilterIndex={winningTableViewIndex}
            loaded={loaded}
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
            renderRow={(data) => rewardRow(data, network)}
            filters={winningTableViews}
            onFilter={setWinningTableViewIndex}
            activeFilterIndex={winningTableViewIndex}
            loaded={loaded}
          />
        )}
      </section>
    </div>
  );
};

export default UnclaimedWinnings;
