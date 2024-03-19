"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery } from "@apollo/client";
import { useAccount } from "wagmi";
import Image from "next/image";

import { useChainContext } from "./queries/ChainContext";

import {
  Text,
  GeneralButton,
  Heading,
  ArrowTopRight,
  useClickOutside,
  toSignificantDecimals,
  ArrowDown,
} from "@fluidity-money/surfing";
import Socials from "./components/Socials";
import Table from "./components/Table";
import Footer from "./components/Footer";
import { DropdownOptions } from "./components/Dropdown";
import { Data, IRow } from "./types";
import { SORTED_ITEM, SORTING_INDEX } from "./config";
import {
  queryLeaderboardRanking24Hours,
  queryLeaderboardRankingAllTime,
} from "./queries/useLeaderboardRanking";
import UseEnsName from "./ensName";
import { Profile } from "./components/Profile";

import styles from "./page.module.scss";

export default function Home() {
  const [filterIndex, setFilterIndex] = useState<"allTime" | "24hour">(
    "24hour"
  );
  const [loaded, setLoaded] = useState();

  const { apiState, network, userAddress } = useChainContext();
  const { address: addressUser, isConnected } = useAccount();

  const {
    loading: loading24Hours,
    error: error24Hours,
    data: data24Hours,
  } = useQuery(queryLeaderboardRanking24Hours);

  const {
    loading: loadingAllTime,
    error: errorAllTime,
    data: dataAllTime,
  } = useQuery(queryLeaderboardRankingAllTime);

  const [sortedData, setSortedData] = useState<Data[]>([]);
  const [sortedByItem, setSortedByItem] = useState<SORTING_INDEX>(
    SORTING_INDEX.NUMBER
  );

  const user = {
    address: String(addressUser),
    rank: -1,
    number_of_transactions: 0,
    volume: 0,
    yield_earned: "0",
  } satisfies Data;

  const receiveData = useCallback(
    (
      leaderboardRankingKey: string,
      dataUserKey: string,
      loadingState: boolean
    ) => {
      const array = apiState[leaderboardRankingKey as keyof typeof apiState];
      const arr = apiState[dataUserKey as keyof typeof apiState];

      const leaderboard = array.map((leaderboardRow: Data, i: number) => ({
        ...leaderboardRow,
        rank: i + 1,
      }));
      if (isConnected) {
        if (arr.length === 0) {
          setSortedData([...leaderboard, user]);
        } else {
          setSortedData([...leaderboard, ...arr]);
        }
      } else if (!loadingState) {
        setSortedData([...leaderboard]);
      }
    },
    [apiState, isConnected, user]
  );

  useEffect(() => {
    if (filterIndex === "24hour") {
      receiveData(
        "leaderboardRanking24Hours",
        "dataUser24Hours",
        loading24Hours
      );
    } else {
      receiveData(
        "leaderboardRankingAllTime",
        "dataUserAllTime",
        loadingAllTime
      );
    }
  }, [filterIndex, loading24Hours, loadingAllTime, isConnected]);

  const [openDropdown, setOpenDropdown] = useState(false);

  const dropdownRef = useRef(null);
  useClickOutside(dropdownRef, () => {
    setTimeout(() => setOpenDropdown(false), 200);
  });

  const sortData = useCallback(
    (sortBy: string) => {
      const frozenRow = sortedData.find((row) => row.rank === -1);
      const dataToSort = sortedData.filter((row) => row.rank !== -1);

      let newSortedData = [];

      switch (sortBy) {
        case SORTING_INDEX.VOLUME:
          newSortedData = [...dataToSort].sort(
            (a, b) => Number(b.volume) - Number(a.volume)
          );
          break;
        case SORTING_INDEX.REWARDS:
          newSortedData = [...dataToSort].sort(
            (a, b) => Number(b.yield_earned) - Number(a.yield_earned)
          );
          break;
        default:
          newSortedData = [...dataToSort].sort(
            (a, b) => b.number_of_transactions - a.number_of_transactions
          );
      }

      newSortedData.forEach((item, index) => {
        item.rank = index + 1; // Assign ranks starting from 1
      });

      if (frozenRow) {
        newSortedData.unshift(frozenRow);
      }

      setSortedData(newSortedData);
    },
    [sortedData]
  );

  const leaderboardRankRow = useCallback(
    (data: {
      address: string;
      rank?: number;
      number_of_transactions: number;
      volume: number | string;
      yield_earned: string;
    }): IRow => {
      const { address, rank, number_of_transactions, volume, yield_earned } =
        data;

      return {
        className: `${styles.table_row} ${
          addressUser === address ? styles.highlighted_row : ""
        }`,
        RowElement: ({ heading }: { heading: string }) => {
          switch (heading) {
            case "RANK":
              return (
                <td>
                  <Text>{rank === -1 ? "???" : rank}</Text>
                </td>
              );
            case "USER":
              return (
                <td>
                  <a target="_blank" href="/" rel="noreferrer">
                    <Text prominent>
                      {addressUser === address ? (
                        "ME"
                      ) : (
                        <UseEnsName address={address} />
                      )}
                    </Text>
                  </a>
                </td>
              );
            case "#TX":
              return (
                <td>
                  <Text prominent>{number_of_transactions}</Text>
                </td>
              );
            case "VOLUME (USD)":
              return (
                <td>
                  <Text prominent>
                    {toSignificantDecimals(Number(volume), 1)}
                  </Text>
                </td>
              );
            case "YIELD EARNED (USD)":
              return (
                <td>
                  <Text prominent>
                    {toSignificantDecimals(Number(yield_earned), 3)}
                  </Text>
                </td>
              );
            default:
              return <></>;
          }
        },
      };
    },
    [addressUser]
  );

  return (
    <main className={styles.main}>
      <div className={styles.red_spot}></div>
      <div className={styles.blue_spot}></div>
      <div className={styles.white_spot}></div>

      <div className={styles.header}>
        <div className={styles.logo}>
          <Image
            src="https://static.fluidity.money/images/logo_fluidity_black_white.svg"
            alt="Logo Fluidity"
            width={74}
            height={12}
          />
        </div>

        <div>
          <Heading className={styles.title}>
            Fluidity Leaderboard{" "}
            <span className={styles.light}>Competition</span>
          </Heading>
        </div>
        <div className={styles.description}>
          <Text className={styles.description_highlited}>
            Step into the Fluidity Arena!{" "}
          </Text>{" "}
          <Text>
            Compete in our Leaderboard Challenge by transacting with ƒluid
            Assets on-chain. Rise in ranks, earn your bragging rights, and claim
            exclusive rewards. Each week brings a new opportunity — Dive in,
            explore, and may the best ƒluider win!{" "}
          </Text>
          <span>
            <Text className={styles.description_learn}>LEARN MORE</Text>{" "}
            <ArrowTopRight />
          </span>
        </div>
      </div>

      <div className={styles.banner}>
        <Image
          src="https://static.fluidity.money/images/prize.svg"
          alt="Prize"
          width={20}
          height={24}
        />

        <Text>
          Weekly Challenge:{" "}
          <span className={styles.banner_text}>
            Top Volume Contributors Win Extra Rewards!{" "}
          </span>
          <ArrowTopRight className={styles.banner_arrow} />
        </Text>
      </div>

      <div className={styles.wallet_connection}>{Profile()}</div>

      <div className={styles.table}>
        <div className={styles.table_header}>
          <div>
            <div className={styles.title}>
              <Heading as="h1" color="white">
                Leaderboard
              </Heading>
            </div>
            <Text data-cy="title">
              This leaderboard shows your rank among other users
              {filterIndex === "24hour" ? " per" : " for"}
              &nbsp;
              {filterIndex === "24hour" ? (
                <span className={styles.time_filter}>24 HOURS</span>
              ) : (
                <span className={styles.time_filter}>ALL TIME</span>
              )}
              .
            </Text>
          </div>
          <div className={styles.filters}>
            <div className={styles.btns}>
              <GeneralButton
                handleClick={() => {
                  setFilterIndex("24hour");
                  setSortedByItem(SORTING_INDEX.NUMBER);
                }}
                className={
                  filterIndex === "24hour"
                    ? `${styles.btn} ${styles.btn_highlited}`
                    : `${styles.btn}`
                }
              >
                <Text size="sm">24 HOURS</Text>
              </GeneralButton>
              <GeneralButton
                handleClick={() => {
                  setFilterIndex("allTime");
                  setSortedByItem(SORTING_INDEX.NUMBER);
                }}
                className={
                  filterIndex === "24hour"
                    ? `${styles.btn}`
                    : `${styles.btn} ${styles.btn_highlited}`
                }
              >
                <Text code size="sm" data-cy="all-btn">
                  ALL TIME
                </Text>
              </GeneralButton>
            </div>
            <div className={styles.filters_sorting}>
              <Text className={styles.sorted_by}>SORT BY:</Text>
              <div ref={dropdownRef} className={styles.sorted_list}>
                <GeneralButton
                  type="transparent"
                  onClick={() => {
                    setOpenDropdown(!openDropdown);
                  }}
                  className={styles.btn}
                >
                  <div className={styles.chosen_sorting}>
                    {SORTED_ITEM[sortedByItem as keyof typeof SORTED_ITEM]}{" "}
                    <ArrowDown className={styles.arrowDown} />
                  </div>
                </GeneralButton>
                {openDropdown && (
                  <DropdownOptions
                    setSortedByItem={setSortedByItem}
                    setOpenDropdown={setOpenDropdown}
                    sortData={sortData}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <div>
          {sortedData.length === 0 ? (
            !loaded ? (
              <div className={styles.fetching}>Fetching table data...</div>
            ) : (
              <>
                <div className="center-table-loading-anim loader-dots">
                  <Text size="lg">No records found!</Text>
                </div>
              </>
            )
          ) : (
            <Table
              headings={[
                { name: "RANK" },
                { name: "USER" },
                { name: "#TX" },
                { name: "VOLUME (USD)" },
                { name: "YIELD EARNED (USD)" },
              ]}
              data={sortedData}
              renderRow={(data) => leaderboardRankRow(data)}
              freezeRow={(data) => {
                return data.address === addressUser;
              }}
              loaded={loaded}
            />
          )}
        </div>
      </div>

      <Socials />

      <Footer />
    </main>
  );
}
