import type { LoaderFunction } from "@remix-run/node";
import type { StakingEvent } from "../../query/dashboard/airdrop";
import type {
  StakingDepositsRes,
  StakingRatioRes,
} from "~/util/chainUtils/ethereum/transaction";

import { json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import BN from "bn.js";
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
  toSignificantDecimals,
  useViewport,
  numberToMonetaryString,
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
import { useContext, useState, useEffect } from "react";
import { Token, trimAddress } from "~/util";
import airdropStyle from "~/styles/dashboard/airdrop.css";
import { AirdropLoaderData, BottleTiers } from "../../query/dashboard/airdrop";
import { AirdropLeaderboardLoaderData } from "../../query/dashboard/airdropLeaderboard";
import { ReferralCountLoaderData } from "../../query/referrals";
import { AirdropLeaderboardEntry } from "~/queries/useAirdropLeaderboard";
import config from "~/webapp.config.server";
import AugmentedToken from "~/types/AugmentedToken";
import FluidityFacadeContext from "contexts/FluidityFacade";
import { useCache } from "~/hooks/useCache";
import Table, { IRow } from "~/components/Table";

const EPOCH_DAYS_TOTAL = 31;
// temp: april 19th, 2023
const EPOCH_START_DATE = new Date(2023, 3, 20);

export const links = () => {
  return [{ rel: "stylesheet", href: airdropStyle }];
};

export const loader: LoaderFunction = async ({ params }) => {
  const network = params.network ?? "";

  const epochDays = dayDifference(new Date(), EPOCH_START_DATE);

  // Staking Tokens
  const allowedTokenSymbols = new Set(["fUSDC", "USDC", "wETH"]);
  const { tokens } = config.config[network];

  const allowedTokens = tokens.filter(({ symbol }) =>
    allowedTokenSymbols.has(symbol)
  );

  return json({
    tokens: allowedTokens,
    epochDaysTotal: EPOCH_DAYS_TOTAL,
    epochDays,
    network,
  } satisfies LoaderData);
};

type LoaderData = {
  tokens: Array<Token>;
  epochDaysTotal: number;
  epochDays: number;
  network: string;
};

const SAFE_DEFAULT_AIRDROP: AirdropLoaderData = {
  referralsCount: 0,
  bottleTiers: {
    [Rarity.Common]: 0,
    [Rarity.Uncommon]: 0,
    [Rarity.Rare]: 0,
    [Rarity.UltraRare]: 0,
    [Rarity.Legendary]: 0,
  },
  bottlesCount: 0,
  liquidityMultiplier: 0,
  stakes: [],
  loaded: false,
};

const SAFE_DEFAULT_AIRDROP_LEADERBOARD: AirdropLeaderboardLoaderData = {
  leaderboard: [],
  loaded: false,
};

const SAFE_DEFAULT_REFERRALS: ReferralCountLoaderData = {
  numActiveReferrerReferrals: 0,
  numActiveReferreeReferrals: 0,
  numInactiveReferreeReferrals: 0,
  inactiveReferrals: [],
  referralCode: "",
  loaded: false,
};

const Airdrop = () => {
  const {
    epochDaysTotal,
    epochDays,
    tokens: defaultTokens,
    network,
  } = useLoaderData<LoaderData>();

  const [tokens, setTokens] = useState<AugmentedToken[]>(
    defaultTokens.map((tok) => ({ ...tok, userTokenBalance: new BN(0) }))
  );

  const { showExperiment } = useContext(SplitContext);

  const showAirdrop = showExperiment("enable-airdrop-page");

  const navigate = useNavigate();

  const [leaderboardFilterIndex, setLeaderboardFilterIndex] = useState(0);

  const {
    address,
    balance,
    stakeTokens,
    getStakingDeposits,
    testStakeTokens,
    getStakingRatios,
  } = useContext(FluidityFacadeContext);

  const { data: airdropData } = useCache<AirdropLoaderData>(
    address ? `/${network}/query/dashboard/airdrop?address=${address}` : ""
  );

  const { data: globalAirdropLeaderboardData } = useCache<AirdropLoaderData>(
    `/${network}/query/dashboard/airdropLeaderboard?period=${leaderboardFilterIndex === 0 ? "24" : "all"
    }`
  );

  const { data: userAirdropLeaderboardData } = useCache<AirdropLoaderData>(
    address
      ? `/${network}/query/dashboard/airdropLeaderboard?period=${leaderboardFilterIndex === 0 ? "24" : "all"
      }&address=${address}`
      : ""
  );

  const { data: referralData } = useCache<AirdropLoaderData>(
    address ? `/${network}/query/referrals?address=${address}` : ""
  );

  const { width } = useViewport();

  const mobileBreakpoint = 768;

  const isMobile = width < mobileBreakpoint;

  const data = {
    airdrop: {
      ...SAFE_DEFAULT_AIRDROP,
      ...airdropData,
    },
    airdropLeaderboard: {
      ...SAFE_DEFAULT_AIRDROP_LEADERBOARD,
      ...globalAirdropLeaderboardData,
    },
    userAirdropLeaderboard: {
      ...SAFE_DEFAULT_AIRDROP_LEADERBOARD,
      ...userAirdropLeaderboardData,
    },
    referrals: {
      ...SAFE_DEFAULT_REFERRALS,
      ...referralData,
    },
  };

  const {
    airdrop: { bottleTiers, liquidityMultiplier, stakes, bottlesCount },
    referrals: {
      numActiveReferreeReferrals,
      numActiveReferrerReferrals,
      numInactiveReferreeReferrals,
      inactiveReferrals,
    },
    airdropLeaderboard: {
      leaderboard: globalLeaderboardRows,
      loaded: globalLeaderboardLoaded,
    },
    userAirdropLeaderboard: {
      leaderboard: userLeaderboardRows,
      loaded: userLeaderboardLoaded,
    },
  } = data;

  const leaderboardRows = userLeaderboardLoaded
    ? userLeaderboardRows.concat(globalLeaderboardRows)
    : globalLeaderboardRows;

  const [currentModal, setCurrentModal] = useState<string | null>(null);
  const [tokenRatios, setTokenRatios] = useState<StakingRatioRes | null>(null);

  const closeModal = () => {
    setCurrentModal(null);
  };

  // get token data once user is connected
  useEffect(() => {
    if (!address) {
      return setTokens(
        tokens.map((token) => ({
          ...token,
          userTokenBalance: new BN(0),
        }))
      );
    }

    (async () => {
      const userTokenBalance = await Promise.all(
        tokens.map(
          async ({ address }) => (await balance?.(address)) || new BN(0)
        )
      );

      return setTokens(
        tokens.map((token, i) => ({
          ...token,
          userTokenBalance: userTokenBalance[i],
        }))
      );
    })();

    // (async () => {
    //   const stakingDeposits = (await getStakingDeposits?.(address)) ?? [];
    //   setStakes(stakingDeposits);
    // })();

    (async () => {
      const stakingRatios = (await getStakingRatios?.()) ?? null;
      setTokenRatios(stakingRatios);
    })();
  }, [address]);

  const Header = () => {
    return (
      <div
        className="pad-main"
        style={{ display: "flex", gap: "2em", marginBottom: "2em" }}
      >
        <TabButton
          size="small"
          onClick={() => setCurrentModal("staking-stats")}
        >
          Airdrop Dashboard
        </TabButton>
        <TabButton size="small" onClick={() => setCurrentModal("tutorial")}>
          Airdrop Tutorial
        </TabButton>
        <TabButton
          size="small"
          onClick={() => {
            if (!isMobile) navigate("#leaderboard");
            setCurrentModal("leaderboard");
          }}
        >
          Leaderboard
        </TabButton>
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
    );
  };

  if (!showAirdrop) return null;

  if (isMobile)
    return (
      <>
        <Header />
        <div
          className="pad-main"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "2em",
          }}
        >
          {currentModal === null && (
            <>
              <Heading as="h3" className={"no-margin"}>
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
              <BottleProgress bottles={bottleTiers} isMobile />
              <AirdropStats
                seeReferralsDetails={() => setCurrentModal("referral-details")}
                seeBottlesDetails={() => setCurrentModal("bottles-details")}
                epochMax={epochDaysTotal}
                epochDays={epochDays}
                activatedReferrals={numActiveReferrerReferrals}
                totalBottles={bottlesCount}
              />
              <MultiplierTasks />
              <MyMultiplier
                seeMyStakingStats={() => setCurrentModal("staking-stats")}
                seeStakeNow={() => setCurrentModal("stake-now")}
                liquidityMultiplier={liquidityMultiplier}
                stakes={stakes}
              />
            </>
          )}
          {currentModal === "tutorial" && (
            <>
              <TutorialModal isMobile />
            </>
          )}
          {currentModal === "leaderboard" && (
            <>
              <Leaderboard
                loaded={globalLeaderboardLoaded}
                data={leaderboardRows}
                filterIndex={leaderboardFilterIndex}
                setFilterIndex={setLeaderboardFilterIndex}
              />
            </>
          )}
          {currentModal === "stake-now" && (
            <>
              <Heading as="h3">Stake Now</Heading>

              <StakeNowModal
                fluidTokens={tokens.filter((tok) =>
                  Object.prototype.hasOwnProperty.call(tok, "isFluidOf")
                )}
                baseTokens={tokens.filter(
                  (tok) =>
                    !Object.prototype.hasOwnProperty.call(tok, "isFluidOf")
                )}
                stakeTokens={stakeTokens}
                testStakeTokens={testStakeTokens}
                ratios={tokenRatios}
              />
              <Heading as="h3">My Staking Stats</Heading>
              <StakingStatsModal
                liqudityMultiplier={liquidityMultiplier}
                stakes={stakes}
              />
            </>
          )}
        </div>
      </>
    );

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
          totalBottles={bottlesCount}
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
        <StakeNowModal
          fluidTokens={tokens.filter((tok) =>
            Object.prototype.hasOwnProperty.call(tok, "isFluidOf")
          )}
          baseTokens={tokens.filter(
            (tok) => !Object.prototype.hasOwnProperty.call(tok, "isFluidOf")
          )}
          stakeTokens={stakeTokens}
          testStakeTokens={testStakeTokens}
          ratios={tokenRatios}
        />
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
      <Header />
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
              activatedReferrals={numActiveReferrerReferrals}
              totalBottles={bottlesCount}
            />
            <MultiplierTasks />
            <MyMultiplier
              seeMyStakingStats={() => setCurrentModal("staking-stats")}
              seeStakeNow={() => setCurrentModal("stake-now")}
              liquidityMultiplier={liquidityMultiplier}
              stakes={stakes}
            />
          </div>
          <BottleProgress bottles={bottleTiers} />
        </div>
      </div>
      <div
        style={{ display: "flex", justifyContent: "center", padding: "1em" }}
      >
        <AnchorButton
          onClick={() => {
            navigate("#leaderboard");
          }}
        >
          LEADERBOARD
        </AnchorButton>
      </div>
      <div className="pad-main" id="#leaderboard">
        <Card
          className="leaderboard-container"
          type="transparent"
          border="solid"
          rounded
          color="white"
        >
          <Leaderboard
            loaded={globalLeaderboardLoaded}
            data={leaderboardRows}
            filterIndex={leaderboardFilterIndex}
            setFilterIndex={setLeaderboardFilterIndex}
          />
        </Card>
      </div>
    </>
  );
};

interface IAirdropStats {
  seeReferralsDetails: () => void;
  seeBottlesDetails: () => void;
  epochDays: number;
  epochMax: number;
  activatedReferrals: number;
  totalBottles: number;
}

const AirdropStats = ({
  seeReferralsDetails,
  seeBottlesDetails,
  epochDays,
  epochMax,
  activatedReferrals,
  totalBottles,
}: IAirdropStats) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1em",
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
        <LabelledValue label="REFERRALS">{activatedReferrals}</LabelledValue>
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
        <LabelledValue label="MY TOTAL BOTTLES">
          {toSignificantDecimals(totalBottles)}
        </LabelledValue>
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
    <Card fill color="holo" rounded className="multiplier-tasks">
      <div className="multiplier-tasks-header">
        <Text style={{ color: "black" }} bold size="md">
          Multiplier Tasks
        </Text>
        <Text style={{ color: "black" }}>
          Perform displayed tasks to earn the respective multipliers.
        </Text>
      </div>
      <div
        className="multiplier-tasks-multiplier"
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
      <div className="multiplier-tasks-tasks">
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
  stakes: Array<StakingEvent>;
  seeMyStakingStats: () => void;
  seeStakeNow: () => void;
}

const MyMultiplier = ({
  seeMyStakingStats,
  seeStakeNow,
  liquidityMultiplier,
  stakes,
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
        {stakes.map(({ amountUsd, durationDays, multiplier, insertedDate }) => {
          const stakedDays = dayDifference(new Date(), new Date(insertedDate));

          return (
            <>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: "0.5em",
                }}
              >
                <Text prominent code>
                  {numberToMonetaryString(amountUsd)} FOR {durationDays} DAYS
                </Text>
                <ProgressBar
                  value={stakedDays}
                  max={durationDays}
                  rounded
                  color={durationDays === stakedDays ? "holo" : "gray"}
                  size="sm"
                />
              </div>
              <div style={{ alignSelf: "flex-end", marginBottom: "-0.2em" }}>
                <Text holo bold prominent>
                  {multiplier}X
                </Text>
              </div>
            </>
          );
        })}
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
  const { user, rank, referralCount, liquidityMultiplier, bottles } = data;

  return (
    <motion.tr
      className="airdrop-row"
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
        <Text prominent>{rank}</Text>
      </td>

      {/* User */}
      <td>
        <Text prominent>{trimAddress(user)}</Text>
      </td>

      {/* Bottles */}
      <td>
        <Text prominent>{toSignificantDecimals(bottles, 2)}</Text>
      </td>

      {/* Multiplier */}
      <td>
        <Text prominent>{liquidityMultiplier.toLocaleString()}x</Text>
      </td>

      {/* Referrals */}
      <td>
        <Text prominent>{referralCount}</Text>
      </td>
    </motion.tr>
  );
};

interface IAirdropLeaderboard {
  loaded: boolean;
  data: Array<AirdropLeaderboardEntry>;
  filterIndex: number;
  setFilterIndex: (index: number) => void;
}

const Leaderboard = ({
  loaded,
  data,
  filterIndex,
  setFilterIndex,
}: IAirdropLeaderboard) => {
  return (
    <>
      <div className="leaderboard-header">
        <Heading as="h3">Leaderboard</Heading>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Text prominent style={{ display: "flex", whiteSpace: "nowrap" }}>
            This leaderboard shows your rank among other users{" "}
            {filterIndex === 0 ? " per " : " for "}
            {filterIndex === 0 ? (
              <ul style={{ margin: 0 }}> 24 HOURS</ul>
            ) : (
              <ul style={{ margin: 0 }}> ALL TIME</ul>
            )}
          </Text>
          <div style={{ display: "flex", gap: "1em" }}>
            <GeneralButton
              type={filterIndex === 0 ? "primary" : "secondary"}
              handleClick={() => setFilterIndex(0)}
            >
              24 HOURS
            </GeneralButton>
            <GeneralButton
              type={filterIndex === 1 ? "primary" : "secondary"}
              handleClick={() => setFilterIndex(1)}
            >
              ALL TIME
            </GeneralButton>
          </div>
        </div>
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
    </>
  );
};

const BottleProgress = ({
  bottles,
  isMobile,
}: {
  bottles: BottleTiers;
  isMobile?: boolean;
}) => {
  const [imgIndex, setImgIndex] = useState(0);
  const [showBottleNumbers, setShowBottleNumbers] = useState(false);

  const handleHeroPageChange = (index: number) => {
    setImgIndex(index);
  };

  return (
    <div>
      <HeroCarousel
        title="BOTTLES I'VE EARNED"
        onSlideChange={handleHeroPageChange}
      >
        <Card type="frosted" fill shimmer rounded>
          <img src="/images/hero/common.png" />
        </Card>
        <Card type="frosted" fill shimmer rounded>
          <img src="/images/hero/uncommon.png" />
        </Card>
        <Card type="frosted" fill shimmer rounded>
          <img src="/images/hero/rare.png" />
        </Card>
        <Card type="frosted" fill shimmer rounded>
          <img src="/images/hero/ultra_rare.png" />
        </Card>
        <Card type="frosted" fill shimmer rounded>
          <img src="/images/hero/legendary.png" />
        </Card>
      </HeroCarousel>
      <BottleDistribution
        bottles={bottles}
        isMobile={isMobile}
        showBottleNumbers={showBottleNumbers}
        highlightBottleNumberIndex={imgIndex}
      />
      <div style={{ display: "flex", flexDirection: "row", gap: "1em" }}>
        <Form.Toggle
          checked={showBottleNumbers}
          onClick={() =>
            setShowBottleNumbers((showBottleNumbers) => !showBottleNumbers)
          }
        />
        <Text prominent={true}>ALWAYS SHOW BOTTLE NUMBERS</Text>
      </div>
    </div>
  );
};

export const dayDifference = (date1: Date, date2: Date) =>
  Math.ceil(Math.abs(date1.getTime() - date2.getTime()) / 1000 / 60 / 60 / 24);

export default Airdrop;
