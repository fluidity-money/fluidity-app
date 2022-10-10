import { useNavigate } from "@remix-run/react";
import {
  Card,
  Text,
  Display,
  numberToMonetaryString,
  GeneralButton,
  LinkButton,
  Heading,
} from "@fluidity-money/surfing";

type IUserRewards = {
  claimNow: boolean;
};

const UserRewards = ({ claimNow }: IUserRewards) => {
  const navigate = useNavigate();

  const buttonText = claimNow ? "Claim now with fees" : "View breakdown";

  const onClick = () => {
    return claimNow ? console.log("claim") : navigate("../unclaimed");
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
                {numberToMonetaryString(6745)}
              </Display>
              <GeneralButton
                size={"large"}
                version={"primary"}
                buttonType="text"
                handleClick={onClick}
                className="view-breakdown-button"
              >
                {buttonText}
              </GeneralButton>
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
              <Text size="xs">$0.002 FUSDC</Text>
            </section>
            <hr className="line" />
            <section className="fees">
              <Text size="xs">Gas fee</Text>
              <Text size="xs">$0.002 FUSDC</Text>
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
            handleClick={() => navigate("../performance")}
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
