import { useContext, useState } from "react";
import { useNavigate, Link } from "@remix-run/react";
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
import FluidityFacadeContext from "contexts/FluidityFacade";

type IUserRewards = {
  claimNow: boolean;
  unclaimedRewards: number;
  claimedRewards: number;
  network: string;
  networkFee: number;
  gasFee: number;
  tokenAddrs?: string[];
};

const UserRewards = ({
  claimNow,
  unclaimedRewards,
  claimedRewards,
  network,
  networkFee,
  gasFee,
  tokenAddrs = [],
}: IUserRewards) => {
  const { manualReward, address } = useContext(FluidityFacadeContext);

  const navigate = useNavigate();

  const [claiming, setClaiming] = useState(false);

  const buttonText = claimNow ? "Claim now with fees" : "View breakdown";

  const networkNotEth = network !== "ethereum";

  const onClick = async () => {
    if (networkNotEth) return;

    if (!claimNow) return navigate("../unclaimed");

    if (claiming) return;

    setClaiming(true);

    const rewards = await manualReward?.(tokenAddrs, address ?? "");

    if (!rewards?.length) {
      // Toast Error
      setClaiming(false);

      return;
    }

    const rewardedSum = rewards.reduce(
      (sum, res) => sum + (res?.amount || 0),
      0
    );

    if (!rewardedSum) {
      // Toast Error
      setClaiming(false);

      return;
    }

    const networkFee = rewards.reduce(
      (sum, res) => sum + (res?.networkFee || 0),
      0
    );

    const gasFee = rewards.reduce((sum, res) => sum + (res?.gasFee || 0), 0);

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
              <Text size="xs">
                ${networkFee} {network === "ethereum" ? "ETH" : "SOL"}
              </Text>
            </section>
            <hr className="line" />
            <section className="fees">
              <Text size="xs">Gas fee</Text>
              <Text size="xs">
                ${gasFee} {network === "ethereum" ? "ETH" : "SOL"}
              </Text>
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
              <strong>{numberToMonetaryString(claimedRewards)}</strong>
            </Text>
          </div>
          <br />

          <Link to="..">
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

export { UserRewards };

const autoClaimInfo = [
  "Rewards will be claimed automatically, without fees",
  "when market volume is reached. Claiming before this",
  "time will incur instant-claim fees stated below.",
];
