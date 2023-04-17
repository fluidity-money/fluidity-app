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
  LootBottle,
  Rarity,
  AnchorButton,
  TabButton,
} from "@fluidity-money/surfing";
import { SplitContext } from "contexts/SplitProvider";
import { motion } from "framer-motion";
import { useContext, useState } from "react";
import Table, { IRow } from "~/components/Table";
import { trimAddress } from "~/util";
import airdropStyle from "~/styles/dashboard/airdrop.css";

export const links = () => {
  return [{ rel: "stylesheet", href: airdropStyle }];
};

export const loader: LoaderFunction = async ({ params }) => {
  const network = params.network ?? "";
  const epochMax = 30;
  const epochDays = 20;

  return json({
    epochMax,
    epochDays,
    network,
  });
};

type Bottle = {
  rarity: Rarity;
  quantity: number;
};

const dummyBottles = [
  {
    rarity: Rarity.Common,
    quantity: 100,
  },
  {
    rarity: Rarity.Uncommon,
    quantity: 0,
  },
  {
    rarity: Rarity.Rare,
    quantity: 12,
  },
  {
    rarity: Rarity.UltraRare,
    quantity: 3,
  },
  {
    rarity: Rarity.Legendary,
    quantity: 1,
  },
];

interface IBottleDistribution {
  bottles: Bottle[];
}

const BottleDistribution = ({ bottles }: IBottleDistribution) => {
  return (
    <div className="bottle-distribution-container">
      {bottles.map((bottle, index) => {
        return (
          <div key={index} className="lootbottle-container">
            <LootBottle
              size="lg"
              rarity={bottle.rarity}
              quantity={bottle.quantity}
              style={{
                marginBottom: "0.6em",
              }}
            />
            <Text style={{ whiteSpace: "nowrap" }}>
              {bottle.rarity.toUpperCase()}
            </Text>
            <Text prominent>{bottle.quantity}</Text>
          </div>
        );
      })}
    </div>
  );
};

const ReferralDetailsModal = () => {
  return (
    <>
      <Display size="xxxs">My Referral Link</Display>
      <div className="referral-details-container">
        <LabelledValue label={<Text size="sm">Active Referrals</Text>}>
          20
        </LabelledValue>
        <LabelledValue
          label={<Text size="sm">Total Bottles earned from your link</Text>}
        >
          1,051
        </LabelledValue>
      </div>
      <Text size="sm">Bottle Distribution</Text>
      <BottleDistribution bottles={dummyBottles} />
      <div
        style={{
          width: "100%",
          borderBottom: "1px solid white",
          margin: "1em 0",
        }}
      />
      <Display size="xxxs">Links I&apos;ve Clicked</Display>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto auto auto auto",
          gap: "1em",
          paddingBottom: "1em",
        }}
      >
        <LabelledValue label="Total Clicked">13</LabelledValue>
        <div>
          <LabelledValue label="Claimed">5</LabelledValue>
          <Text>50 BOTTLES</Text>
        </div>
        <div>
          <LabelledValue label="Unclaimed">20</LabelledValue>
          <LinkButton
            handleClick={() => {
              return;
            }}
            color="gray"
            size="small"
            type="internal"
          >
            START CLAIMING
          </LinkButton>
        </div>
        <div>
          <LabelledValue label="Until Next Claim">8/10</LabelledValue>
          <ProgressBar value={0.6} max={1} size="sm" color="holo" />
        </div>
      </div>
    </>
  );
};

const BottlesDetailsModal = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1em",
        alignItems: "center",
      }}
    >
      <BottleDistribution bottles={dummyBottles} />
      <GeneralButton
        icon={<ArrowRight />}
        layout="after"
        handleClick={() => {
          return;
        }}
        type="transparent"
      >
        SEE YOUR LOOTBOTTLE TX HISTORY
      </GeneralButton>
      <div
        style={{
          width: "100%",
          borderBottom: "1px solid white",
          margin: "1em 0",
        }}
      />
      <LabelledValue
        label={<Text size="sm">Bottles earned since last checked</Text>}
      >
        <LootBottle size="lg" rarity="legendary"></LootBottle>
      </LabelledValue>
    </div>
  );
};

const StakingStatsModal = () => {
  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto auto auto",
          gap: "1em",
        }}
      >
        <LabelledValue
          label={<Text size="sm">Total Liquidity Multiplier</Text>}
        >
          <Text holo>5,230x</Text>
        </LabelledValue>
        <LabelledValue label={<Text size="sm">My Stakes</Text>}>
          155
        </LabelledValue>
        <LabelledValue label={<Text size="sm">Total Amount Staked</Text>}>
          $999,550
        </LabelledValue>
      </div>
    </>
  );
};

const StakeNowModal = () => {
  return <></>;
};

const TutorialModal = () => {
  return <Card type="frosted" border="solid" />;
};

const AirdropStats = ({
  seeReferralsDetails,
  seeBottlesDetails,
  epochDays,
  epochMax,
}: {
  seeReferralsDetails: () => void;
  seeBottlesDetails: () => void;
  epochDays: number;
  epochMax: number;
}) => {
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
        <LabelledValue label="EPOCH DAYS LEFT">{epochDays}</LabelledValue>
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

const MyMultiplier = ({
  seeMyStakingStats,
  seeStakeNow,
}: {
  seeMyStakingStats: () => void;
  seeStakeNow: () => void;
}) => {
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
            5,230x
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

type AirdropRank = {
  rank: number;
  user: string;
  bottles: number;
  multiplier: number;
  referrals: number;
};

const DUMMY_AIRDROP_LEADERBOARD_DATA = [
  {
    rank: 199,
    user: "0x8Cb300ebb3028c15AB69c3E9CDFf1bE60aAa43a2",
    bottles: 100,
    multiplier: 5230,
    referrals: 0,
  },
];

const AIRDROP_TABLE_COLUMNS = [
  { name: "RANK", prominent: "true" },
  { name: "USER" },
  { name: "BOTTLES" },
  { name: "MULTIPLIER" },
  { name: "REFERRALS" },
];

const AirdropRankRow: IRow<AirdropRank> = ({
  data,
  index,
}: {
  data: AirdropRank;
  index: number;
}) => {
  const { rank, user, bottles, multiplier, referrals } = data;

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
        <Text>{trimAddress(user)}</Text>
      </td>

      {/* Bottles */}
      <td>{bottles}</td>

      {/* Multiplier */}
      <td>
        <Text>{multiplier}x</Text>
      </td>

      {/* Referrals */}
      <td>
        <Text>{referrals}</Text>
      </td>
    </motion.tr>
  );
};

const Leaderboard = () => {
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
            This leaderboard shows your rank among oother users per{" "}
            <ul>24 HOURS</ul>
          </Text>
        </div>
        <Table
          itemName=""
          headings={AIRDROP_TABLE_COLUMNS}
          pagination={{
            page: 1,
            rowsPerPage: 11,
          }}
          count={0}
          data={DUMMY_AIRDROP_LEADERBOARD_DATA}
          renderRow={AirdropRankRow}
          onFilter={() => true}
          activeFilterIndex={0}
          filters={[]}
          loaded={true}
        />
      </Card>
    </div>
  );
};

const BottleProgress = () => {
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
      <BottleDistribution bottles={dummyBottles} />
      <div style={{ display: "flex", flexDirection: "row", gap: "1em" }}>
        <Form.Toggle />
        <Text prominent={true}>ALWAYS SHOW BOTTLE NUMBERS</Text>
      </div>
    </div>
  );
};

type LoaderData = {
  epochMax: number;
  epochDays: number;
  network: string;
};

const Airdrop = () => {
  const { network, epochMax, epochDays } = useLoaderData<LoaderData>();

  const { showExperiment } = useContext(SplitContext);

  const showAirdrop = showExperiment("enable-airdrop-page");

  if (!showAirdrop) return null;

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
        <ReferralDetailsModal />
      </CardModal>
      <CardModal
        id="bottles-details"
        visible={currentModal === "bottles-details"}
        closeModal={closeModal}
      >
        <BottlesDetailsModal />
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
        <StakingStatsModal />
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
        <TabButton size="small">Airdrop Dashboard</TabButton>
        <TabButton size="small">Airdrop Tutorial</TabButton>
        <TabButton size="small">Leaderboard</TabButton>
        <TabButton size="small">Referrals</TabButton>
        <TabButton size="small">Stake</TabButton>
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
              epochMax={epochMax}
              epochDays={epochDays}
            />
            <MultiplierTasks />
            <MyMultiplier
              seeMyStakingStats={() => setCurrentModal("staking-stats")}
              seeStakeNow={() => setCurrentModal("stake-now")}
            />
          </div>
          <BottleProgress />
        </div>
      </div>
      <div
        style={{ display: "flex", justifyContent: "center", padding: "0.5em" }}
      >
        <AnchorButton to="#leaderboard">LEADERBOARD</AnchorButton>
      </div>
      <Leaderboard />
    </>
  );
};

export default Airdrop;
