import { useState } from "react";
import { useNavigate } from "@remix-run/react";
import {
  Card,
  Text,
  Display,
  numberToMonetaryString,
  GeneralButton,
  LinkButton,
  Heading,
  Spinner,
} from "@fluidity-money/surfing";

const address = "0xbb9cdbafba1137bdc28440f8f5fbed601a107bb6";

type IUserRewards = {
  claimNow: boolean;
  unclaimedRewards: number;
  network: string;
  networkFee: number;
  gasFee: number;
};

const UserRewards = ({
  claimNow,
  unclaimedRewards,
  network,
  networkFee,
  gasFee,
}: IUserRewards) => {
  const navigate = useNavigate();

  const [claiming, setClaiming] = useState(false);

  const buttonText = claimNow ? "Claim now with fees" : "View breakdown";

  const networkNotEth = network !== "ethereum";

  const onClick = async () => {
    if (!claimNow) return navigate("../unclaimed");

    if (claiming) return;

    setClaiming(true);

    const rewardsRes = await fetch(`claimreward?address=${address}`);

    if (!rewardsRes.ok) {
      // Toast Error
      setClaiming(false);

      return;
    }

    const { rewards } = await rewardsRes.json();

    const rewardedSum = rewards.reduce(
      (sum: number, reward: number) => sum + reward,
      0
    );
    const networkFee = 0.002;
    const gasFee = 0.002;

    return navigate(
      `../claim?reward=${rewardedSum}&networkfee=${networkFee}&gasfee=${gasFee}`
    );
  };

  return (
    <>
      {/* Info card*/}
      <Card
        id="user-rewards"
        className="card-outer"
        component="div"
        rounded={true}
        type={"box"}
      >
        <div className="card-inner">
          <section id="unclaimed-left">
            {/* Icon */}
            <img
              id="card-logo"
              src="/images/fluidTokensMetallicCropped.svg"
              alt="tokens"
              style={{ width: 200 }}
            />

            {/* Unclaimed fluid rewards */}
            <section id="unclaimed">
              <Text size="md">Unclaimed fluid rewards</Text>
              <Display className="unclaimed-total" size={"sm"}>
                {unclaimedRewards.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </Display>
              {claiming ? (
                <GeneralButton
                  size={"large"}
                  version={"primary"}
                  buttontype="icon only"
                  icon={<Spinner />}
                  handleClick={onClick}
                  className="view-breakdown-button"
                />
              ) : (
                <GeneralButton
                  size={"large"}
                  version={"primary"}
                  buttontype="text"
                  handleClick={onClick}
                  className="view-breakdown-button"
                >
                  {networkNotEth ? "Coming Soon!" : buttonText}
                </GeneralButton>
              )}
            </section>
          </section>

          {/* Auto-claims infobox */}
          <section id="infobox">
            <Heading className="claims-title" as="h5">
              Auto-claims
            </Heading>
            {autoClaimInfo.map((text, i) => (
              <Text size={"xs"} key={`text-${i}`}>
                {text}
                <br />
              </Text>
            ))}
            <hr className="gradient-line" />
            <Heading className="claims-title" as="h5">
              Instant-claim fees
            </Heading>
            <section className="fees">
              <Text size="xs">Network fee</Text>
              <Text size="xs">${networkFee} FUSDC</Text>
            </section>
            <hr className="line" />
            <section className="fees">
              <Text size="xs">Gas fee</Text>
              <Text size="xs">${gasFee} FUSDC</Text>
            </section>
            <hr className="line" />
          </section>
        </div>
      </Card>

      {/* Total claimed, Reward History */}
      {claimNow && (
        <section>
          <div>
            <Text>Total yield claimed to date </Text>
            <Text>
              <strong>{numberToMonetaryString(29645)}</strong>
            </Text>
          </div>

          <LinkButton
            size={"small"}
            type={"internal"}
            handleClick={() => navigate("..")}
          >
            Reward History
          </LinkButton>
        </section>
      )}
    </>
  );
};

export { UserRewards };

const autoClaimInfo = [
  "Rewards will be claimed automatically, without fees",
  "when market volume is reached. Claiming before this",
  "time will incur instant-claim fees stated below.",
];
