import type { LoaderFunction } from "@remix-run/node";

import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  Card,
  Form,
  Heading,
  TextButton,
  LabelledValue,
  LinkButton,
  Text,
  HeroCarousel,
  ProgressBar,
  GeneralButton,
  ArrowRight,
  Display,
  ProviderIcon,
  Provider,
  CardModal,
  Rarity,
  AnchorButton,
  TabButton,
} from "@fluidity-money/surfing";
import {
  BottlesDetailsModal,
  BottleDistribution,
  ReferralDetailsModal,
  StakeNowModal,
  StakingStatsModal,
  TutorialModal,
} from "./common";
import { SplitContext } from "contexts/SplitProvider";
import { motion } from "framer-motion";
import { useContext, useState } from "react";
import Table, { IRow } from "~/components/Table";
import { trimAddress } from "~/util";
import airdropStyle from "~/styles/dashboard/airdrop.css";
import { AirdropLoaderData, BottleTiers } from "../../query/dashboard/airdrop";
import { AirdropLeaderboardLoaderData } from "../../query/dashboard/airdropLeaderboard";
import { ReferralCountLoaderData } from "../../query/referrals";
import { AirdropLeaderboardEntry } from "~/queries/useAirdropLeaderboard";

export const links = () => {
  return [{ rel: "stylesheet", href: airdropStyle }];
};

const EPOCH_DAYS_TOTAL = 31;
// temp: april 19th, 2023
const EPOCH_START_DATE = new Date(2023, 3, 20);

export const dayDifference = (date1: Date, date2: Date) =>
  Math.ceil(Math.abs(date1.getTime() - date2.getTime()) / 1000 / 60 / 60 / 24);

export const loader: LoaderFunction = async ({ params }) => {
  const network = params.network ?? "";
  const epochDays = dayDifference(new Date(), EPOCH_START_DATE);

  return json({
    epochDaysTotal: EPOCH_DAYS_TOTAL,
    epochDays,
    network,
  } satisfies LoaderData);
};

type LoaderData = {
  epochDaysTotal: number;
  epochDays: number;
  network: string;
};

const SAFE_DEFAULT_AIRDROP: AirdropLoaderData = {
  referralsCount: 10,
  bottleTiers: {
    [Rarity.Common]: 100,
    [Rarity.Uncommon]: 0,
    [Rarity.Rare]: 12,
    [Rarity.UltraRare]: 3,
    [Rarity.Legendary]: 1,
  },
  bottlesCount: 116,
  liquidityMultiplier: 5230,
  stakes: [],
  loaded: false,
};

const SAFE_DEFAULT_AIRDROP_LEADERBOARD: AirdropLeaderboardLoaderData = {
  leaderboard: [
    {
      rank: 199,
      address: "0x8Cb300ebb3028c15AB69c3E9CDFf1bE60aAa43a2",
      totalLootboxes: 100,
      liquidityMultiplier: 5230,
      referralCount: 0,
      highestRewardTier: 1,
    },
  ],
  loaded: true,
};

const SAFE_DEFAULT_REFERRALS: ReferralCountLoaderData = {
  numActiveReferrerReferrals: 10,
  numActiveReferreeReferrals: 11,
  numInactiveReferreeReferrals: 12,
  inactiveReferrals: [],
  referralCode: "",
  loaded: true,
};

const Airdrop = () => {
  const { epochDaysTotal, epochDays } = useLoaderData<LoaderData>();

  const { showExperiment } = useContext(SplitContext);

  const showAirdrop = showExperiment("enable-airdrop-page");

  if (!showAirdrop) return null;

  const data = {
    airdrop: {
      ...SAFE_DEFAULT_AIRDROP,
    },
    airdropLeaderboard: SAFE_DEFAULT_AIRDROP_LEADERBOARD,
    referrals: {
      ...SAFE_DEFAULT_REFERRALS,
    },
  };

  const {
    airdrop: {
      bottleTiers,
      liquidityMultiplier,
      stakes,
      loaded: airdropLoaded,
    },
    referrals: {
      numActiveReferreeReferrals,
      numActiveReferrerReferrals,
      numInactiveReferreeReferrals,
      inactiveReferrals,
      loaded: referralLoaded,
    },
    airdropLeaderboard: {
      leaderboard: leaderboardRows,
      loaded: leaderboardLoaded,
    },
  } = data;

  const [currentModal, setCurrentModal] = useState<string | null>(null);

  const closeModal = () => {
    setCurrentModal(null);
  };

  return (
    <>
      {/* Modals */}
      <CardModal
        id="referral-details"
        visible={currentModal === "referral-details"}
        closeModal={closeModal}
      >
        <ReferralDetailsModal
          bottles={bottleTiers}
          activeReferrerReferralsCount={numActiveReferrerReferrals}
          activeRefereeReferralsCount={numActiveReferreeReferrals}
          inactiveReferrerReferralsCount={numInactiveReferreeReferrals}
          nextInactiveReferral={inactiveReferrals[0]}
        />
      </CardModal>
      <CardModal
        id="bottles-details"
        visible={currentModal === "bottles-details"}
        closeModal={closeModal}
      >
        <BottlesDetailsModal bottles={bottleTiers} />
      </CardModal>
      <CardModal
        id="stake-now"
        visible={currentModal === "stake-now"}
        closeModal={closeModal}
      >
        <StakeNowModal />
      </CardModal>
      <CardModal
        id="staking-stats"
        visible={currentModal === "staking-stats"}
        closeModal={closeModal}
      >
        <StakingStatsModal
          liqudityMultiplier={liquidityMultiplier}
          stakes={stakes}
        />
      </CardModal>
      <CardModal
        id="tutorial"
        visible={currentModal === "tutorial"}
        closeModal={closeModal}
      >
        <TutorialModal />
      </CardModal>

      {/* Page Content */}
      <div className="pad-main" style={{ display: "flex", gap: "2em" }}>
        <TabButton
          size="small"
          onClick={() => setCurrentModal("staking-stats")}
        >
          Airdrop Dashboard
        </TabButton>
        <TabButton size="small" onClick={() => setCurrentModal("tutorial")}>
          Airdrop Tutorial
        </TabButton>
        <TabButton size="small">Leaderboard</TabButton>
        <TabButton
          size="small"
          onClick={() => setCurrentModal("referral-details")}
        >
          Referrals
        </TabButton>
        <TabButton size="small" onClick={() => setCurrentModal("stake-now")}>
          Stake
        </TabButton>
      </div>
      <div className="pad-main">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr",
            gap: "10%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "2em",
              zIndex: 1,
            }}
          >
            <Heading className={"no-margin"}>
              Welcome to Fluidity&apos;s Airdrop Event!
            </Heading>
            <div>
              <Text>
                Vestibulum lobortis egestas luctus. Donec euismod nisi eu arcu
                vulputate, in pharetra nisl porttitor. Morbi aliquet vulputate
                metus, ac convallis lectus porttitor et. Donec maximus gravida
                mauris, eget tempor felis tristique sit amet. Pellentesque at
                hendrerit nibh, eu porttitor dui.
                <LinkButton
                  size="medium"
                  type="external"
                  handleClick={() => {
                    return;
                  }}
                >
                  Learn more
                </LinkButton>
              </Text>
            </div>
            <AirdropStats
              seeReferralsDetails={() => setCurrentModal("referral-details")}
              seeBottlesDetails={() => setCurrentModal("bottles-details")}
              epochMax={epochDaysTotal}
              epochDays={epochDays}
            />
            <MultiplierTasks />
            <MyMultiplier
              seeMyStakingStats={() => setCurrentModal("staking-stats")}
              seeStakeNow={() => setCurrentModal("stake-now")}
              liquidityMultiplier={liquidityMultiplier}
            />
          </div>
          <BottleProgress bottles={bottleTiers} />
        </div>
      </div>
      <div
        style={{ display: "flex", justifyContent: "center", padding: "0.5em" }}
      >
        <AnchorButton>LEADERBOARD</AnchorButton>
      </div>
      <Leaderboard loaded={leaderboardLoaded} data={leaderboardRows} />
    </>
  );
};

interface IAirdropStats {
  seeReferralsDetails: () => void;
  seeBottlesDetails: () => void;
  epochDays: number;
  epochMax: number;
}

const AirdropStats = ({
  seeReferralsDetails,
  seeBottlesDetails,
  epochDays,
  epochMax,
}: IAirdropStats) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <div>
        <LabelledValue label="EPOCH DAYS LEFT">
          {epochMax - epochDays}
        </LabelledValue>
        <div
          style={{
            display: "flex",
            gap: "1em",
            alignItems: "center",
          }}
        >
          <ProgressBar
            value={epochDays}
            max={epochMax}
            size="sm"
            rounded
            color="white"
          />
          <Text>{Math.floor((epochDays / epochMax) * 100)}%</Text>
        </div>
      </div>
      <div>
        <LabelledValue label="REFERRALS">11</LabelledValue>
        <LinkButton
          color="gray"
          size="small"
          type="internal"
          handleClick={seeReferralsDetails}
        >
          SEE DETAILS
        </LinkButton>
      </div>
      <div>
        <LabelledValue label="MY TOTAL BOTTLES">12</LabelledValue>
        <LinkButton
          color="gray"
          size="small"
          type="internal"
          handleClick={seeBottlesDetails}
        >
          SEE DETAILS
        </LinkButton>
      </div>
    </div>
  );
};

const MultiplierTasks = () => {
  const [tasks, setTasks] = useState<"1x" | "2x">("1x");

  const providers: Provider[] = [
    "Uniswap",
    "Sushiswap",
    "Camelot",
    "Saddle",
    "Curve",
  ];
  return (
    <Card
      fill
      color="holo"
      rounded
      style={{
        zIndex: 0,
        color: "black",
        display: "grid",
        boxSizing: "border-box",
        gridTemplateColumns: "2.2fr 1fr 5fr",
        gap: "2em",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5em",
          alignItems: "flex-start",
          justifyContent: "center",
          gridColumn: "1 / 2",
        }}
      >
        <Text style={{ color: "black" }} bold size="md">
          Multiplier Tasks
        </Text>
        <Text style={{ color: "black" }}>
          Perform displayed tasks to earn the respective multipliers.
        </Text>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "1em",
          alignItems: "center",
          cursor: "pointer",
          gridColumn: "2 / 3",
          justifyContent: "flex-start",
        }}
        onClick={() => {
          setTasks((prev) => (prev === "1x" ? "2x" : "1x"));
        }}
      >
        <Form.Toggle
          color="black"
          direction="vertical"
          checked={tasks === "2x"}
        />
        <TextButton style={{ textDecorationThickness: "3px" }}>
          <motion.div
            key={tasks}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.4 } }}
            exit={{ opacity: 0, y: -10, transition: { duration: 0.4 } }}
          >
            <Display size="sm" style={{ color: "black", margin: 0 }}>
              {tasks}
            </Display>
          </motion.div>
        </TextButton>
      </div>
      <div
        style={{
          gridColumn: "3 / 4",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {tasks === "1x" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.2 } }}
            exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
          >
            <Text style={{ color: "black" }}>
              Perform any type of fAsset transactions{" "}
              <b>in any on-chain protocol</b>, including sending{" "}
              <b>with any wallet</b>.
            </Text>
          </motion.div>
        )}
        {tasks === "2x" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.2 } }}
            exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "1em",
            }}
          >
            {providers.map((provider, i) => {
              return (
                <a
                  key={`airdrop-mx-provider-` + i}
                  style={{
                    cursor: "pointer",
                    width: "32px",
                    height: "32px",
                    borderRadius: "32px",
                    backgroundColor: "black",
                    padding: "8px",
                  }}
                  href="#"
                >
                  <ProviderIcon
                    provider={provider}
                    style={{ height: "100%" }}
                  />
                </a>
              );
            })}
          </motion.div>
        )}
      </div>
    </Card>
  );
};

interface IMyMultiplier {
  liquidityMultiplier: number;
  seeMyStakingStats: () => void;
  seeStakeNow: () => void;
}

const MyMultiplier = ({
  seeMyStakingStats,
  seeStakeNow,
  liquidityMultiplier,
}: IMyMultiplier) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "2em",
      }}
    >
      <div>
        <LabelledValue label="MY TOTAL LIQUIDITY MULTIPLIER">
          <Text size="xxl" holo>
            {liquidityMultiplier.toLocaleString()}x
          </Text>
        </LabelledValue>
      </div>
      <GeneralButton
        icon={<ArrowRight />}
        layout="after"
        size="small"
        type="secondary"
        handleClick={seeMyStakingStats}
        style={{
          width: "100%",
          gridArea: "2 / 1",
          boxSizing: "border-box",
          alignSelf: "end",
        }}
      >
        MY STAKING STATS
      </GeneralButton>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto max-content",
          alignContent: "start",
          gap: "1em",
          gridColumn: "2 / 3",
          gridRow: "1 / 3",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "0.5em",
          }}
        >
          <Text>$5,000 FOR 365 DAYS</Text>
          <ProgressBar value={1} max={1} rounded color="holo" size="sm" />
        </div>
        <div style={{ alignSelf: "flex-end", marginBottom: "-0.2em" }}>
          <Text holo bold prominent>
            1X
          </Text>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "0.5em",
          }}
        >
          <Text>$500 FOR 150 DAYS</Text>
          <ProgressBar value={0.5} max={1} rounded size="sm" color="gray" />
        </div>
        <div style={{ alignSelf: "flex-end", marginBottom: "-0.2em" }}>
          <Text>0.5X</Text>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "0.5em",
          }}
        >
          <Text>$500 FOR 31 DAYS</Text>
          <ProgressBar value={0.05} max={1} rounded size="sm" color="gray" />
        </div>
        <div style={{ alignSelf: "flex-end", marginBottom: "-0.2em" }}>
          <Text>0.05X</Text>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "0.5em",
          }}
        >
          <Text>$250 FOR 100 DAYS</Text>
          <ProgressBar value={0.05} max={1} rounded size="sm" color="gray" />
        </div>
        <div style={{ alignSelf: "flex-end", marginBottom: "-0.2em" }}>
          <Text>0.5X</Text>
        </div>
      </div>
      <GeneralButton
        buttontype="text"
        size="medium"
        version="primary"
        handleClick={seeStakeNow}
        style={{
          width: "100%",
          boxSizing: "border-box",
          gridColumn: "1 / 3",
          gridRow: "3 / 4",
        }}
      >
        STAKE NOW
      </GeneralButton>
    </div>
  );
};

const AirdropRankRow: IRow<AirdropLeaderboardEntry> = ({
  data,
  index,
}: {
  data: AirdropLeaderboardEntry;
  index: number;
}) => {
  const { rank, address, referralCount, liquidityMultiplier, totalLootboxes } =
    data;

  return (
    <motion.tr
      key={`${rank}-${index}`}
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
      {/* Rank */}
      <td>
        <Text>{rank}</Text>
      </td>

      {/* User */}
      <td>
        <Text>{trimAddress(address)}</Text>
      </td>

      {/* Bottles */}
      <td>{totalLootboxes}</td>

      {/* Multiplier */}
      <td>
        <Text>{liquidityMultiplier.toLocaleString()}x</Text>
      </td>

      {/* Referrals */}
      <td>
        <Text>{referralCount}</Text>
      </td>
    </motion.tr>
  );
};

interface IAirdropLeaderboard {
  loaded: boolean;
  data: Array<AirdropLeaderboardEntry>;
}

const Leaderboard = ({ loaded, data }: IAirdropLeaderboard) => {
  return (
    <div className="pad-main" id="leaderboard">
      <Card
        className="leaderboard-container"
        type="transparent"
        border="solid"
        rounded
        color="white"
      >
        <div>
          <Heading as="h3">Leaderbord</Heading>
          <Text prominent>
            This leaderboard shows your rank among other users per{" "}
            <ul>24 HOURS</ul>
          </Text>
        </div>
        <Table
          itemName=""
          headings={[
            { name: "RANK" },
            { name: "USER" },
            { name: "BOTTLES" },
            { name: "MULTIPLIER" },
            { name: "REFERRALS" },
          ]}
          pagination={{
            page: 1,
            rowsPerPage: 11,
          }}
          count={0}
          data={data}
          renderRow={AirdropRankRow}
          onFilter={() => true}
          activeFilterIndex={0}
          filters={[]}
          loaded={loaded}
        />
      </Card>
    </div>
  );
};

const BottleProgress = ({ bottles }: { bottles: BottleTiers }) => {
  return (
    <div>
      <HeroCarousel title="BOTTLES I'VE EARNED">
        <Card type="frosted" fill shimmer rounded>
          <img src="/images/placeholderAirdrop1.png" />
        </Card>
        <Card type="frosted" fill shimmer rounded>
          <img src="/images/placeholderAirdrop2.png" />
        </Card>
        <Card type="frosted" fill shimmer rounded>
          <img src="/images/placeholderAirdrop3.png" />
        </Card>
        <Card type="frosted" fill shimmer rounded>
          <img src="/images/placeholderAirdrop1.png" />
        </Card>
        <Card type="frosted" fill shimmer rounded>
          <img src="/images/placeholderAirdrop2.png" />
        </Card>
        <Card type="frosted" fill shimmer rounded>
          <img src="/images/placeholderAirdrop3.png" />
        </Card>
      </HeroCarousel>
      <BottleDistribution bottles={bottles} />
      <div style={{ display: "flex", flexDirection: "row", gap: "1em" }}>
        <Form.Toggle />
        <Text prominent={true}>ALWAYS SHOW BOTTLE NUMBERS</Text>
      </div>
    </div>
  );
};

export default Airdrop;
