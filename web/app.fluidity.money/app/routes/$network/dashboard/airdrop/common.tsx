import { useState } from "react"
import {
  Card,
  LabelledValue,
  LinkButton,
  Text,
  ProgressBar,
  GeneralButton,
  ArrowRight,
  Display,
  LootBottle,
  numberToMonetaryString,
  ArrowLeft,
  InfoCircle,
  TokenCard,
} from "@fluidity-money/surfing";
import { Referral } from "~/queries";
import { BottleTiers, StakingEvent } from "../../query/dashboard/airdrop";

interface IBottleDistribution {
  bottles: BottleTiers;
}

const BottleDistribution = ({ bottles }: IBottleDistribution) => (
  <div className="bottle-distribution-container">
    {Object.entries(bottles).map(([rarity, quantity], index) => {
      return (
        <div key={index} className="lootbottle-container">
          <LootBottle
            size="lg"
            rarity={rarity}
            quantity={quantity}
            style={{
              marginBottom: "0.6em",
            }}
          />
          <Text style={{ whiteSpace: "nowrap" }}>{rarity.toUpperCase()}</Text>
          <Text prominent>{quantity}</Text>
        </div>
      );
    })}
  </div>
);

interface IReferralDetailsModal {
  bottles: BottleTiers;
  activeRefereeReferralsCount: number;
  activeReferrerReferralsCount: number;
  inactiveReferrerReferralsCount: number;
  nextInactiveReferral?: Referral;
}

const ReferralDetailsModal = ({
  bottles,
  activeRefereeReferralsCount,
  activeReferrerReferralsCount,
  inactiveReferrerReferralsCount,
  nextInactiveReferral,
}: IReferralDetailsModal) => (
  <>
    <Display size="xxxs">My Referral Link</Display>
    <div className="referral-details-container">
      <LabelledValue label={<Text size="sm">Active Referrals</Text>}>
        {activeRefereeReferralsCount}
      </LabelledValue>
      <LabelledValue
        label={<Text size="sm">Total Bottles earned from your link</Text>}
      >
        1,051
      </LabelledValue>
    </div>
    <Text size="sm">Bottle Distribution</Text>
    <BottleDistribution bottles={bottles} />
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
      <LabelledValue label="Total Clicked">
        {activeReferrerReferralsCount + inactiveReferrerReferralsCount}
      </LabelledValue>
      <div>
        <LabelledValue label="Claimed">
          {activeReferrerReferralsCount}
        </LabelledValue>
        <Text>50 BOTTLES</Text>
      </div>
      <div>
        <LabelledValue label="Unclaimed">
          {inactiveReferrerReferralsCount}
        </LabelledValue>
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
      {nextInactiveReferral && (
        <div>
          <LabelledValue label="Until Next Claim">
            {nextInactiveReferral.progress}/10
          </LabelledValue>
          <ProgressBar
            value={nextInactiveReferral.progress}
            max={10}
            size="sm"
            color="holo"
          />
        </div>
      )}
    </div>
  </>
);

interface IBottlesDetailsModal {
  bottles: BottleTiers;
}

const BottlesDetailsModal = ({ bottles }: IBottlesDetailsModal) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "1em",
      alignItems: "center",
    }}
  >
    <BottleDistribution bottles={bottles} />
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

interface IStakingStatsModal {
  liqudityMultiplier: number;
  stakes: Array<StakingEvent>;
}
const StakingStatsModal = ({
  liqudityMultiplier,
  stakes,
}: IStakingStatsModal) => {
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
          <Text holo>{liqudityMultiplier.toLocaleString()}x</Text>
        </LabelledValue>
        <LabelledValue label={<Text size="sm">My Stakes</Text>}>
          {stakes.length}
        </LabelledValue>
        <LabelledValue label={<Text size="sm">Total Amount Staked</Text>}>
          {numberToMonetaryString(
            stakes.reduce((sum, { amount }) => sum + amount, 0)
          )}
        </LabelledValue>
      </div>
    </>
  );
};

const StakeNowModal = (stakingDate: Date, fluidTokens: Token[], baseTokens: Token[]) => {
  const [ fluidTokenAmount, setFluidTokenAmount ] = useState(0);
  const [ baseTokenAmount, setBaseTokenAmount ] = useState(0);
  const [stakingDuration, setStakingDuration] = useState(31);

  // Staking Multiplier Equation
  // Reference: https://www.notion.so/fluidity/Fluidity-Airdrops-Loot-bottles-5d1bcf986d5a45a7a29bfc200fbfbb20?pvs=4#f47a040e934a41bbbb1793a7349146b6
  const stakingLiquidityMultiplierEq = (stakedDays: number, totalStakedDays: number) => 
    (396 / 11315 - 396 * totalStakedDays / 4129975) * stakedDays +
    396 * totalStakedDays / 133225 -
    31 / 365

  const canStake = () => false
  
  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto auto auto",
          gap: "1em",
        }}
      >
        <Card type="opaque" rounded color="holo" fill>
          TIP: Stake over <strong>31</strong> days for more rewards in future epochs and events!
        </Card>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "0.4 0.2 0.4",
            gap: "1em",
          }}
        >
          {/* Staking Amount */}
          <div>
            <div>
              <Text>STAKE AMOUNT <InfoCircle /></Text>
              <GeneralButton size="small">Max</GeneralButton>
            </div>
            <div>
              <TokenCard />
            </div>
            <div>
              <TokenCard />
            </div>
          </div>
          {/* Arrow */}
          <div>
            <ArrowLeft />
          </div>
          {/* Duration */}
          <div>
            <div>
              <Text> Duration
                <InfoCircle />
              </Text>
            </div>
            <div>
              {stakingDuration}{" "}D
              {/* Scrollbar */}
            </div>
            <div>
              <Text>END: <Text>{Date.now() + stakingDuration}</Text> <InfoCircle /></Text>
            </div>
          </div>
        </div>
        <div style={{ border: "1em white dashed" }} />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "0.4 0.2 0.4",
            gap: "1em",
          }}
        >
          <div>
            <Text>Day 1 Power <InfoCircle /></Text>
            {stakingLiquidityMultiplierEq(1, stakingDuration)}
            <Text>@ MULTIPLIER {stakingLiquidityMultiplierEq(1, stakingDuration)}X</Text>
          </div>
          <div>
            <ArrowRight />
          </div>
          <div>
            <Text>Day 31 Power <InfoCircle /></Text>
            {stakingLiquidityMultiplierEq(31, stakingDuration)}
            <Card rounded type="opaque" color="holo">@ MULTIPLIER {stakingLiquidityMultiplierEq(31, stakingDuration)}X</Card>
          </div>
        </div>
        <GeneralButton disabled={!canStake()}>
          Stake
        </GeneralButton>
      </div>
    </>
  );
};

const TutorialModal = () => {
  return <Card type="frosted" border="solid" />;
};

export {
  BottleDistribution,
  TutorialModal,
  StakeNowModal,
  StakingStatsModal,
  BottlesDetailsModal,
  ReferralDetailsModal,
};
