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
import { getChainNativeToken } from "~/util/chainUtils/chains";

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

  const networkNotEvm = network !== "ethereum" && network !== "arbitrum";

  const onClick = async () => {
    if (networkNotEvm) return;

    if (!claimNow) return navigate(`/${network}/dashboard/rewards/unclaimed`);

    if (claiming) return;

    setClaiming(true);

    try {
      const rewards = await manualReward?.(tokenAddrs, address ?? "");

      if (!rewards?.length) {
        // Toast Error

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
        `/${network}/dashboard/rewards/claim?reward=${rewardedSum}&networkfee=${networkFee}&gasfee=${gasFee}`
      );
    } catch (e) {
      console.error(e);
    } finally {
      setClaiming(false);
    }
  };

  return (
    <>
      {/* Info card*/}
      <Card rounded type="holobox" style={{ padding: "2em" }}>
        <div className="unclaimed-inner">
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
                {numberToMonetaryString(unclaimedRewards)}
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
                  {networkNotEvm ? "Coming Soon!" : buttonText}
                </GeneralButton>
              )}
            </section>
          </section>

          {/* Auto-claims infobox */}
          <section id="infobox">
            <Heading className="claims-title" as="h5">
              Auto-claims
            </Heading>

            <Text size={"xs"}>
              Rewards will be claimed automatically without fees when market
              volume is reached. Claiming before this, time will incur
              instant-claim fees stated below.
              <br />
            </Text>

            <hr className="gradient-line" />
            <Heading className="claims-title" as="h5">
              Instant-claim fees
            </Heading>
            <section className="fees">
              <Text size="xs">Network fee</Text>
              <Text size="xs">
                {networkFee} {getChainNativeToken(network)}
              </Text>
            </section>
            <hr className="line" />
            <section className="fees">
              <Text size="xs">Gas fee</Text>
              <Text size="xs">
                {gasFee} {getChainNativeToken(network)}
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

export { UserRewards };
