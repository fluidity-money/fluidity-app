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

const address = "bb004de25a81cb4ed6b2abd68bcc2693615b9e04";

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
              id="logo"
              src="/images/fluidTokensMetallicCropped.svg"
              alt="tokens"
              style={{ width: 200 }}
            />

            {/* Unclaimed fluid rewards */}
            <section id="unclaimed">
              <Text size="md">Unclaimed fluid rewards</Text>
              <Display className="unclaimed-total" size="sm">
                {numberToMonetaryString(unclaimedRewards)}
              </Display>
              {claiming ? (
                <GeneralButton
                  size={"large"}
                  version={"primary"}
                  buttonType="icon only"
                  icon={<Spinner />}
                  handleClick={onClick}
                  className="view-breakdown-button"
                />
              ) : (
                <GeneralButton
                  size={"large"}
                  version={"primary"}
                  buttonType="text"
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
            <Text size="xs">{autoClaimInfo.join("\n")}</Text>
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
