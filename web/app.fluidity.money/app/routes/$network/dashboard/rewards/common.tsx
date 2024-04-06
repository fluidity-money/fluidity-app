import { useNavigate, Link } from "@remix-run/react";
import {
  Card,
  Text,
  Display,
  numberToMonetaryString,
  GeneralButton,
  LinkButton,
  Heading,
  useViewport,
} from "@fluidity-money/surfing";

type IUserRewards = {
  claimNow: boolean;
  unclaimedRewards: number;
  claimedRewards: number;
  network: string;
};

const UserRewards = ({
  claimNow,
  unclaimedRewards,
  claimedRewards,
  network,
}: IUserRewards) => {
  const navigate = useNavigate();

  const onClick = async () => {
    navigate("unclaimed");
  };

  return (
    <>
      {/* Info card*/}
      <Card
        rounded
        type="transparent"
        color="holo"
        border="solid"
        className="unclaimed-rewards"
      >
        <div id="unclaimed-left">
          {/* Icon */}
          <img
            id="card-logo"
            src="https://app-cdn.fluidity.money/images/fluidTokensMetallicCropped.svg"
            alt="tokens"
            style={{ width: 200 }}
          />

          {/* Unclaimed fluid rewards */}
          <div id="unclaimed">
            <Text size="sm" style={{ whiteSpace: "nowrap" }}>
              Unclaimed fluid rewards
            </Text>
            <Display className="unclaimed-total" size={"sm"}>
              {numberToMonetaryString(unclaimedRewards)}
            </Display>
            {!claimNow && (
              <GeneralButton
                size={"medium"}
                type={"primary"}
                handleClick={onClick}
                className="view-breakdown-button"
                style={{ whiteSpace: "nowrap" }}
              >
                View Breakdown
              </GeneralButton>
            )}
          </div>
        </div>

        {/* Auto-claims infobox */}
        <div id="infobox">
          <Heading className="claims-title" as="h4">
            Auto-claims
          </Heading>

          <Text size={"md"}>
            Rewards will be claimed automatically without fees when market
            volume is reached.
            <br />
          </Text>
        </div>
      </Card>

      {/* Total claimed, Reward History */}
      {claimNow && (
        <section>
          <div>
            <Text>Total yield claimed to date </Text>
            <Text>
              <strong>{numberToMonetaryString(claimedRewards)}</strong>
            </Text>
          </div>
          <br />

          <Link to={`/${network}/dashboard/rewards`}>
            <LinkButton
              size={"small"}
              type={"internal"}
              handleClick={() => {
                return;
              }}
            >
              Reward History
            </LinkButton>
          </Link>
        </section>
      )}
    </>
  );
};

type INoUserRewards = {
  prizePool: number;
};

const NoUserRewards = ({ prizePool }: INoUserRewards) => {
  const { width } = useViewport();

  const isMobile = width < 500 && width > 0;

  return (
    <Card
      id="no-user-rewards"
      component="div"
      rounded={true}
      type="transparent"
      color="holo"
      border={isMobile ? "none" : "solid"}
    >
      <div id="unclaimed-left">
        <Text size="lg">Total Prize Pool</Text>
        <Display size={"sm"}>
          {isMobile ? (
            numberToMonetaryString(prizePool)
          ) : (
            <strong>{numberToMonetaryString(prizePool)}</strong>
          )}
        </Display>
      </div>

      {/* Auto-claims infobox */}
      <div id="infobox">
        {isMobile ? (
          <>
            <Text size="md" code prominent>
              NO UNCLAIMED REWARDS
            </Text>
            <br />
          </>
        ) : (
          <Heading as="h4">No Unclaimed Rewards</Heading>
        )}
        <p style={{ margin: 0 }}>
          <Text>You currently have no unclaimed rewards.</Text>
          <br />
          <Text>Use, Send & Receive Fluid Assets to gain yield.</Text>
        </p>
      </div>
    </Card>
  );
};

export { UserRewards, NoUserRewards };
