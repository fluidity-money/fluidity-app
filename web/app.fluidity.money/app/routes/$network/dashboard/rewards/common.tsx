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
      <Card id="user-rewards" component="div" rounded={true} type={"holobox"}>
        {/* Icon */}
        <img id="logo" src="./tokens" alt="tokens" />

        {/* Unclaimed fluid rewards */}
        <section id="unclaimed">
          <Text size="md">Unclaimed fluid rewards</Text>
          <Display size="md">{numberToMonetaryString(6745)}</Display>
          <GeneralButton
            size={"large"}
            version={"primary"}
            buttonType="text"
            handleClick={onClick}
          >
            {buttonText}
          </GeneralButton>
        </section>

        {/* Auto-claims infobox */}
        <section id="infobox">
          <Heading as="h5">Auto-claims</Heading>
          <Text>{autoClaimInfo.join("\n")}</Text>
          <hr />
          <Heading as="h5">Instant-claim fees</Heading>
          <section>
            <Text>Network fee</Text>
            <Text>$0.002 FUSDC</Text>
          </section>
          <hr />
          <section>
            <Text>Gas fee</Text>
            <Text>$0.002 FUSDC</Text>
          </section>
          <hr />
        </section>
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
