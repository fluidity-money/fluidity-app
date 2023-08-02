import type { LoaderFunction } from "@remix-run/node";
import type { IRow } from "~/components/Table";

import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  Card,
  Heading,
  Text,
  GeneralButton,
  ArrowRight,
  ProviderIcon,
  toSignificantDecimals,
} from "@fluidity-money/surfing";
import { useCache } from "~/hooks/useCache";
import { useContext, useRef } from "react";
import airdropStyle from "~/styles/dashboard/airdrop.css";
import { Table } from "~/components";
import { getProviderDisplayName } from "~/util/provider";
import FluidityFacadeContext from "contexts/FluidityFacade";
import { TradingCompLeaderboardLoaderData } from "../query/dashboard/leaderboard";
import { TradingLeaderboardEntry } from "~/queries";
import { getAddressExplorerLink, trimAddress } from "~/util";
import { Chain } from "~/util/chainUtils/chains";
import { RewardEpochLoaderData } from "../query/dashboard/rewardEpoch";

export const links = () => {
  return [{ rel: "stylesheet", href: airdropStyle }];
};

export const loader: LoaderFunction = async ({ params }) => {
  const network = params.network ?? "";

  return json({
    network,
  } satisfies LoaderData);
};

type LoaderData = {
  network: string;
};

const SAFE_DEFAULT_LEADERBOARD_STATS = {
  id: 0,
  end: "",
  start: "",
  application: "",
  loaded: false,
};

const SAFE_DEFAULT_LEADERBOARD = {
  leaderboard: [],
  loaded: false,
};

const UtilityMining = () => {
  const { network } = useLoaderData<LoaderData>();

  if (network !== "arbitrum") {
    return (
      <div className="pad-main">
        <Heading as="h1" className="no-margin">
          Airdrop
        </Heading>
        <Text>
          Fluidity Utility Mining is currently only available on Arbitrum.
          Please switch to the Arbitrum network to participate.
        </Text>
      </div>
    );
  }

  const { address } = useContext(FluidityFacadeContext);

  const leaderboardRef = useRef<HTMLDivElement>(null);

  const { data: rewardEpochData } = useCache<RewardEpochLoaderData>(
    `/${network}/query/dashboard/rewardEpoch`
  );

  const { data: leaderboardData } = useCache<TradingCompLeaderboardLoaderData>(
    `/${network}/query/dashboard/leaderboard?address=${address ?? ""}`
  );

  const data = {
    leaderboard: {
      ...SAFE_DEFAULT_LEADERBOARD,
      ...leaderboardData,
    },
    stats: {
      ...SAFE_DEFAULT_LEADERBOARD_STATS,
      ...rewardEpochData,
    },
  };

  const {
    leaderboard: { loaded, leaderboard },
    stats: { application },
  } = data;

  return (
    <>
      {/* Page Content */}
      <div>
        {/* Staking */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "2em",
            marginBottom: "3em",
          }}
        >
          <GeneralButton
            type="transparent"
            icon={<ArrowRight />}
            className="scroll-to-leaderboard-button"
            onClick={() => {
              leaderboardRef.current?.scrollIntoView({
                block: "start",
                behavior: "smooth",
              });
            }}
          >
            LEADERBOARD
          </GeneralButton>
        </div>
        {/*  */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "2em",
            marginBottom: "3em",
          }}
        >
          <GeneralButton
            type="transparent"
            icon={<ArrowRight />}
            className="scroll-to-leaderboard-button"
            onClick={() => {
              leaderboardRef.current?.scrollIntoView({
                block: "start",
                behavior: "smooth",
              });
            }}
          >
            LEADERBOARD
          </GeneralButton>
        </div>
      </div>
      <div className="pad-main" id="#leaderboard" ref={leaderboardRef}>
        <Card
          className="leaderboard-container"
          type="transparent"
          border="solid"
          rounded
          color="white"
        >
          <Leaderboard
            loaded={loaded}
            network={network}
            data={leaderboard}
            application={application}
            userAddress={address || ""}
          />
        </Card>
      </div>
    </>
  );
};

const tradingCompRankRow = (
  network: Chain,
  data: TradingLeaderboardEntry & { rank: number },
  isMobile = false
): IRow => {
  const { address: connectedAddress } = useContext(FluidityFacadeContext);
  const { address, rank, volume } = data;

  return {
    className: `airdrop-row ${isMobile ? "airdrop-mobile" : ""} ${
      connectedAddress === address ? "highlighted-row" : ""
    }`,
    RowElement: ({ heading }: { heading: string }) => {
      switch (heading) {
        case "RANK":
          return (
            <td>
              <Text
                prominent
                style={
                  connectedAddress === address
                    ? {
                        color: "black",
                      }
                    : {}
                }
              >
                {rank === -1 ? "???" : rank}
              </Text>
            </td>
          );
        case "USER":
          return (
            <td>
              <a
                className="table-address"
                target="_blank"
                href={getAddressExplorerLink(network, address)}
                rel="noreferrer"
              >
                <Text
                  prominent
                  style={
                    connectedAddress === address
                      ? {
                          color: "black",
                        }
                      : {}
                  }
                >
                  {connectedAddress === address ? "ME" : trimAddress(address)}
                </Text>
              </a>
            </td>
          );
        case "VOLUME":
          return (
            <td>
              <Text
                prominent
                style={
                  connectedAddress === address
                    ? {
                        color: "black",
                      }
                    : {}
                }
              >
                {toSignificantDecimals(volume, 0)}
              </Text>
            </td>
          );
        default:
          return <></>;
      }
    },
  };
};

interface ITradingCompLeaderboard {
  loaded: boolean;
  network: Chain;
  data: Array<TradingLeaderboardEntry & { rank: number }>;
  application: string;
  userAddress: string;
  isMobile?: boolean;
}

const Leaderboard = ({
  loaded,
  network,
  data,
  application,
  userAddress,
  isMobile,
}: ITradingCompLeaderboard) => {
  if (
    loaded &&
    userAddress &&
    !data.find((entry) => entry.address === userAddress)
  ) {
    const userEntry = {
      address: userAddress,
      volume: 0,
      rank: -1,
    };

    data.push(userEntry);
  }

  return (
    <>
      <div className={`leaderboard-header ${isMobile ? "airdrop-mobile" : ""}`}>
        <div className="leaderboard-header-text">
          <div className="leaderboard-header-title-row">
            <Heading as="h3">Leaderboard</Heading>
            {application && (
              <GeneralButton
                icon={
                  <ProviderIcon
                    provider={getProviderDisplayName(application)}
                  />
                }
                type="secondary"
                disabled
                className="leaderboard-provider-button"
              >
                <Text code style={{ color: "inherit" }}>
                  {getProviderDisplayName(application)}
                </Text>
              </GeneralButton>
            )}
          </div>
        </div>
        <div className="leaderboard-header-filters">
          <GeneralButton type={"primary"} handleClick={() => {}}>
            <Text code size="sm" style={{ color: "inherit" }}>
              Epoch
            </Text>
          </GeneralButton>
        </div>
      </div>
      <Table
        itemName=""
        headings={[{ name: "RANK" }, { name: "USER" }, { name: "VOLUME" }]}
        pagination={{
          paginate: false,
          page: 1,
          rowsPerPage: 11,
        }}
        count={0}
        data={data}
        renderRow={(data) => tradingCompRankRow(network, data, isMobile)}
        freezeRow={(data) => {
          return data.address === userAddress;
        }}
        onFilter={() => true}
        activeFilterIndex={0}
        filters={[]}
        loaded={loaded}
      />
    </>
  );
};

export const dayDifference = (date1: Date, date2: Date) =>
  Math.round(Math.abs(date1.valueOf() - date2.valueOf()) / 1000 / 60 / 60 / 24);

export default UtilityMining;
