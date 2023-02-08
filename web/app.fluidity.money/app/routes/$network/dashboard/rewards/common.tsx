import { useContext, useEffect, useState } from "react";
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
  const navigate = useNavigate();

  const onClick = async () => {
    navigate('unclaimed')
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
        <div className="card-inner unclaimed-inner">
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
              {!claimNow && (
                <GeneralButton
                  size={"large"}
                  version={"primary"}
                  buttontype="text"
                  handleClick={onClick}
                  className="view-breakdown-button"
                >
                  View Breakdown
                </GeneralButton>
              )
            }
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
                {networkFee} {network === "ethereum" ? "ETH" : "SOL"}
              </Text>
            </section>
            <hr className="line" />
            <section className="fees">
              <Text size="xs">Gas fee</Text>
              <Text size="xs">
                {gasFee} {network === "ethereum" ? "ETH" : "SOL"}
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

type INoUserRewards = {
  prizePool: number
}

const NoUserRewards = ({prizePool}: INoUserRewards) => {
  const { width } = useViewport();

  const isMobile = width < 500 && width > 0;

  return (
    <Card
      id="no-user-rewards"
      className="card-outer"
      component="div"
      rounded={true}
      type={isMobile ? "transparent" : "box"}
    >
      <div className="card-inner unclaimed-inner">
        <section id="unclaimed-left">
          <Text>Total Prize Pool</Text>
          <Display size={"sm"}><strong>{numberToMonetaryString(prizePool)}</strong></Display>
        </section>

        {/* Auto-claims infobox */}
        <section id="infobox">
          <Heading as="h5">No Unclaimed Rewards</Heading>
          <Text>You currently have no unclaimed rewards</Text>
          <br/>
          <Text>Use, Send & Receive Fluid Assets to gain yield</Text>
        </section>
      </div>
    </Card>
  )
}

export { UserRewards, NoUserRewards };
