import type { LoaderFunction } from "@remix-run/node";
import type { StakingEvent } from "../../query/dashboard/airdrop";

import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
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
  stakingLiquidityMultiplierEq,
} from "./common";
import { SplitContext } from "contexts/SplitProvider";
import { motion } from "framer-motion";
import { useContext, useState, useEffect, useRef } from "react";
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

  const [leaderboardFilterIndex, setLeaderboardFilterIndex] = useState(0);

  const { address, balance, getStakingDeposits, stakeTokens } = useContext(
    FluidityFacadeContext
  );

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

  const closeModal = () => {
    setCurrentModal(null);
  };

  // const [ stakes, setStakes ] = useState<Array<>>([])

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
  }, [address]);

  const leaderboardRef = useRef<HTMLDivElement>(null);

  const Header = () => {
    return <div className="pad-main" style={{ display: "flex", gap: "2em", marginBottom: '2em' }}>
    <TabButton
      size="small"
      onClick={() => setCurrentModal(null)}
    >
      Airdrop Dashboard
    </TabButton>
    <TabButton size="small" onClick={() => setCurrentModal("tutorial")}>
      Airdrop Tutorial
    </TabButton>
    <TabButton size="small" onClick={() => {
      if(!isMobile) {
        leaderboardRef.current?.scrollIntoView({ block: 'start', behavior: "smooth" })
      }
      setCurrentModal('leaderboard')
    }
    }>Leaderboard</TabButton>
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
  }

  if (!showAirdrop) return null;

  if (isMobile) return (
    <>
      <Header />
      <div className="pad-main"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2em',
        }}
      >
      {
        currentModal === null &&
        (
          <>
            <div>
            <Heading as="h3" style={{marginBottom:'0.5em'}} className={"no-margin"}>
              Welcome to Fluidity&apos;s Airdrop Event!
            </Heading>
              <Text>
                Vestibulum lobortis egestas luctus. Donec euismod nisi eu arcu
                vulputate, in pharetra nisl porttitor. 
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
            <div style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <BottleProgress bottles={bottleTiers} isMobile/>
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
          </>
        )
      }
      {
        currentModal === 'tutorial' &&
        (
          <>
            <TutorialModal isMobile/>
          </>
        )
      }
      {
        currentModal === 'leaderboard' &&
        (
          <>
            <Leaderboard
              loaded={globalLeaderboardLoaded}
              data={leaderboardRows}
              filterIndex={leaderboardFilterIndex}
              setFilterIndex={setLeaderboardFilterIndex}
              userAddress={address || ''}
            />
          </>
        )
      }
      {
        currentModal === "stake-now" &&
        (
          <>
        <Heading as="h3">Stake Now</Heading>

                <StakeNowModal
          fluidTokens={tokens.filter((tok) =>
            Object.prototype.hasOwnProperty.call(tok, "isFluidOf")
          )}
          baseTokens={tokens.filter(
            (tok) => !Object.prototype.hasOwnProperty.call(tok, "isFluidOf")
          )}
          stakeToken={stakeTokens}
        />
        <Heading as="h3">My Staking Stats</Heading>
        <StakingStatsModal  
          liqudityMultiplier={liquidityMultiplier}
          stakes={stakes}
        />
        </>
        )
      }

      </div>
    </>
  )

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
        <StakeNowModal
          fluidTokens={tokens.filter((tok) =>
            Object.prototype.hasOwnProperty.call(tok, "isFluidOf")
          )}
          baseTokens={tokens.filter(
            (tok) => !Object.prototype.hasOwnProperty.call(tok, "isFluidOf")
          )}
          stakeToken={stakeTokens}
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
            gridTemplateColumns: "1fr 1fr",
            gap: "10%",
            maxWidth: 1200,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "2em",
            }}
          >
            <div>
              <Heading as="h2" className={"no-margin"} style={{marginBottom:'0.5em'}}>
                Welcome to Fluidity&apos;s Airdrop Event!
              </Heading>
              <Text style={{fontSize: 14}}>
                Vestibulum lobortis egestas luctus. Donec euismod nisi eu arcu
                vulputate, in pharetra nisl porttitor.
                <LinkButton
                  size="medium"
                  type="external"
                  style={{
                    display: 'inline-flex',
                    textDecoration: 'underline',
                    textUnderlineOffset: 2
                  }}
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
        style={{ display: "flex", justifyContent: "center", marginTop: '2em', marginBottom: '3em' }}
      >
        <GeneralButton
        type="transparent"
        icon={<span style={{fill: 'none', transform: 'rotate(90deg)'}}><ArrowRight /></span>}
          onClick={() => {
            leaderboardRef.current?.scrollIntoView({ block: 'start', behavior: "smooth" })
          }}
        >
          LEADERBOARD
        </GeneralButton>
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
            loaded={globalLeaderboardLoaded}
            data={leaderboardRows}
            filterIndex={leaderboardFilterIndex}
            setFilterIndex={setLeaderboardFilterIndex}
            userAddress={address || ''}
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
        gap: '1em'
      }}
    >
      <div>
        <LabelledValue label={<Text size="xs">EPOCH DAYS LEFT</Text>}>
        <Text prominent size="xl">{epochMax - epochDays}</Text>
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
        <LabelledValue label={<Text size="xs">REFERRALS</Text>}>
          <Text prominent size="xl">
            {activatedReferrals}
          </Text>
        </LabelledValue>
        <LinkButton
          color="gray"
          size="small"
          type="internal"
          handleClick={seeReferralsDetails}
          style={{
            marginLeft: -6
          }}
        >
          SEE DETAILS
        </LinkButton>
      </div>
      <div>
        <LabelledValue label={<Text size="xs">MY TOTAL BOTTLES</Text>}>
          <Text prominent size="xl">{toSignificantDecimals(totalBottles, 0)}</Text>
        </LabelledValue>
        <LinkButton
          color="gray"
          size="small"
          type="internal"
          handleClick={seeBottlesDetails}
          style={{
            marginLeft: -6
          }}
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
      className="multiplier-tasks"
    >
      <div
        className="multiplier-tasks-header"
      >
        <Text style={{ color: "black" }} bold size="md">
          Multiplier Tasks
        </Text>
        <Text size="xs" style={{ color: "black" }}>
          Perform displayed tasks to earn the respective multipliers.
        </Text>
      </div>
      <div
        className="multiplier-tasks-multiplier"
        onClick={() => {
          setTasks((prev) => (prev === "1x" ? "2x" : "1x"));
        }}
        style={{transform: 'scale(0.6)'}}
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
        className="multiplier-tasks-tasks"
      >
        {tasks === "1x" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.2 } }}
            exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
          >
            <Text size="xs" style={{ color: "black" }}>
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
              justifyContent: "space-between",
              width: '100%',
              gap: 8
            }}
          >
            {providers.map((provider, i) => {
              return (
                <a
                  key={`airdrop-mx-provider-` + i}
                  style={{
                    cursor: "pointer",
                    width: "24px",
                    height: "24px",
                    borderRadius: "32px",
                    backgroundColor: "black",
                    padding: "6px",
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

// export type StakingEvent = {
//   amount: number;
//   durationDays: number;
//   multiplier: number;
//   insertedDate: string;
// };

const MyMultiplier = ({
  seeMyStakingStats,
  seeStakeNow,
  liquidityMultiplier,
  stakes,
}: IMyMultiplier) => {
  
  // If user has no stakes, render a dummy empty stake in the UI
  if (stakes.length === 0) {
    const emptyStake = {
      amount: 0,
      durationDays: 0,
      multiplier: 0,
      insertedDate: "",
    };
    stakes.push(emptyStake);
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "2em",
      }}
    >
      <div>
        <LabelledValue label={<Text size="xs">MY TOTAL LIQUIDITY MULTIPLIER</Text>}>
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
        {stakes.map(({ amount, durationDays, multiplier, insertedDate }) => {
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
                <Text>
                  {numberToMonetaryString(amount)} FOR {durationDays} DAYS
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
  const { address } = useContext(FluidityFacadeContext)
  // const address = '0xb3701a61a9759d10a0fc7ce55354a8163496caec'
  const { user, rank, referralCount, liquidityMultiplier, bottles } = data;

  return (
    <motion.tr
      className={`airdrop-row ${address === user ? 'highlighted-row' : ''}`}
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
        <Text prominent style={address === user ? {
        color: 'black'
      } : {}}>{rank === -1 ? '???' : rank}</Text>
      </td>

      {/* User */}
      <td>
        <Text prominent style={address === user ? {
        color: 'black'
      } : {}}>{address === user ? 'ME' : trimAddress(user)}</Text>
      </td>

      {/* Bottles */}
      <td><Text prominent style={address === user ? {
        color: 'black'
      } : {}}>{toSignificantDecimals(bottles, 2)}</Text></td>

      {/* Multiplier */}
      <td>
        <Text prominent style={address === user ? {
        color: 'black'
      } : {}}>{liquidityMultiplier.toLocaleString()}x</Text>
      </td>

      {/* Referrals */}
      <td>
        <Text prominent style={address === user ? {
        color: 'black'
      } : {}}>{referralCount}</Text>
      </td>
    </motion.tr>
  );
};

interface IAirdropLeaderboard {
  loaded: boolean;
  data: Array<AirdropLeaderboardEntry>;
  filterIndex: number;
  setFilterIndex: (index: number) => void;
  userAddress: string;
}

const Leaderboard = ({
  loaded,
  data,
  filterIndex,
  setFilterIndex,
  userAddress
}: IAirdropLeaderboard) => {
  console.log("HELOOOOOOOO", filterIndex);

  // This adds a dummy user entry to the leaderboard if the user's address isn't found
  if (!data.find((entry) => entry.user === userAddress)) {
    const userEntry = {
      user: userAddress,
      rank: -1,
      referralCount: 0,
      liquidityMultiplier: 0,
      bottles: 0,
      highestRewardTier: 0
    };

    data.push(userEntry);
  }

  return (
    <>
        <div className="leaderboard-header">
          <div className="leaderboard-header-text">
            <Heading as="h3">Leaderboard</Heading>
            <Text prominent style={{ display: "flex", whiteSpace: "nowrap" }}>
              This leaderboard shows your rank among other users{" "}
              {filterIndex === 0 ? " per" : " for"}
              &nbsp;
              {filterIndex === 0 ? (
                <ul style={{ margin: 0 }}>24 HOURS</ul>
              ) : (
                <ul style={{ margin: 0 }}>ALL TIME</ul>
              )}
            </Text>
          </div>
          <div className="leaderboard-header-filters">
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
            paginate: false,
            page: 1,
            rowsPerPage: 11,
          }}
          count={0}
          data={data}
          renderRow={AirdropRankRow}
          freezeRow={(data) => {
            return data.user === userAddress
          }}
          onFilter={() => true}
          activeFilterIndex={0}
          filters={[]}
          loaded={loaded}
        />
    </>
  );
};


const BottleProgress = ({ bottles, isMobile }: { bottles: BottleTiers, isMobile?: boolean }) => {
  const [imgIndex, setImgIndex] = useState(0);
  const [showBottleNumbers, setShowBottleNumbers] = useState(false);
  
  const handleHeroPageChange = (index: number) => {
    setImgIndex(index)
  }
  
  return (
    <div style={{maxWidth: 450, display: 'flex', flexDirection: 'column', gap: '1em'}}>
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
      <div style={{ display: "flex", flexDirection: "row", gap: "1em",}}>
        <Form.Toggle
          checked={showBottleNumbers}
          onClick={() =>
            setShowBottleNumbers((showBottleNumbers) => !showBottleNumbers)
          }
          style={{
            opacity: showBottleNumbers ? 1 : 0.3,
          }}
        />
        <Text size="sm" prominent={showBottleNumbers}>ALWAYS SHOW BOTTLE NUMBERS</Text>
      </div>
    </div>
  );
};

export const dayDifference = (date1: Date, date2: Date) =>
  Math.ceil(Math.abs(date1.getTime() - date2.getTime()) / 1000 / 60 / 60 / 24);

export default Airdrop;
