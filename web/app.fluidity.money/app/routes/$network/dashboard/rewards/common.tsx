import { useState } from "react";
import { useNavigate } from "@remix-run/react";
import { getTokenForNetwork, getTokenFromAddress } from "~/util/api/graphql";
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

type IUserRewards = {
  claimNow: boolean;
  unclaimedRewards: number;
  network: string;
  networkFee: number;
  gasFee: number;
};

const claimReward = async (network: string) => {
  const tokens = getTokenForNetwork(network);

  const url = "https://mainnet.fluidity.money:8081/manual-reward";

  const abi = {};

  const rewards = await Promise.all(
    tokens.map(async (tokenAddr) => {
      const tokenConfig = getTokenFromAddress(network, tokenAddr);

      const manualRewardBody = {
        address: tokenAddr,
        token_short_name: tokenConfig.symbol,
      };

      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(manualRewardBody),
      });

      const { error, payload } = await res.json();

      if (error || !payload) return 0;

      // Call eth contract
      const tokenContract = new web3.eth.Contract(abi, tokenAddr);

      const reward = await tokenContract.methods.manual_reward(payload).call();

      return reward;
    })
  );

  const rewardedSum = rewards.reduce((sum, reward) => sum + reward, 0);
  const networkFee = 0.002;
  const gasFee = 0.002;

  const navigate = useNavigate();

  navigate(
    `../claim?reward=${rewardedSum}&networkfee=${networkFee}&gasfee=${gasFee}`
  );

  return rewardedSum;
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

  const onClick = () => {
    if (!claimNow) return navigate("../unclaimed");

    setClaiming(true);

    return claimReward(network);
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
