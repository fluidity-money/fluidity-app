import type { LinksFunction } from "@remix-run/node";

import { LoaderFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useContext } from "react";
import { useNavigate } from "@remix-run/react";
import FluidityFacadeContext from "contexts/FluidityFacade";
import {
  Text,
  numberToMonetaryString,
  GeneralButton,
  LinkButton,
  Heading,
  Twitter,
} from "@fluidity-money/surfing";

import claimStyles from "~/styles/dashboard/rewards/claim.css";
import { generateRewardTweet } from "~/util/tweeter";
import { networkMapper } from "~/util";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: claimStyles }];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const { network } = params;

  const url = new URL(request.url);
  const _reward = url.searchParams.get("reward");
  const reward = _reward ? parseInt(_reward) : 0;

  const _networkFee = url.searchParams.get("networkFee");
  const networkFee = _networkFee ? parseInt(_networkFee) : 0;

  const _gasFee = url.searchParams.get("gasFee");
  const gasFee = _gasFee ? parseInt(_gasFee) : 0;

  return json({
    network,
    reward,
    networkFee,
    gasFee,
  });
};

type LoaderData = {
  network: string;
  reward: number;
  networkFee: number;
  gasFee: number;
};

const ClaimedRewards = () => {
  const { reward, networkFee, gasFee, network } = useLoaderData<LoaderData>();

  const { connected } = useContext(FluidityFacadeContext);

  const navigate = useNavigate();

  if (!connected) return navigate(`/${network}/dashboard/home`);

  return (
    <div id="claim-container" className="cover">
      {/* Bg Video*/}
      <video
        id="cover-vid"
        src={"https://app-cdn.fluidity.money/images/FluidityOpportunityB.mp4"}
        autoPlay={true}
        loop={true}
      />

      {/* Navigation Bar */}
      <header id="claim-header">
        <img src="https://app-cdn.fluidity.money/images/logoOutline.svg" alt="FluidLogo" />
        <LinkButton
          size={"small"}
          type={"internal"}
          handleClick={() => navigate(`/${network}/dashboard/rewards`)}
        >
          Close
        </LinkButton>
      </header>

      {/* Claimed Info */}
      <section id="claim-body">
        <Text>Congrats! You&rsquo;ve claimed</Text>
        <Heading as="h1">{numberToMonetaryString(reward)} USD</Heading>
        <Text>The funds have been added to your wallet.</Text>

        {/* Fee Info*/}
        <section className="spread">
          <section className="spread-text">
            <Text>Network fee</Text>
            <Text>
              {networkFee} {networkMapper(network)}
            </Text>
          </section>
          <hr />
          <section className="spread-text">
            <Text>Gas fee</Text>
            <Text>
              {gasFee} {networkMapper(network)}
            </Text>
          </section>
          <hr />
        </section>

        {/* Fluidify Button */}
        <GeneralButton
          className="spread"
          type={"primary"}
          size={"large"}
          handleClick={() => {
            navigate(`/${network}/dashboard/fluidify`);
          }}
        >
          Fluidify Your Money
        </GeneralButton>

        {/* Share on Twitter */}
        <GeneralButton
          className="spread"
          size="large"
          type="transparent"
          layout="before"
          icon={<Twitter />}
          handleClick={() => {
            window.open(generateRewardTweet(reward, "claim"));
          }}
        >
          SHARE
        </GeneralButton>

        {/* Rewards History */}
        <LinkButton
          size={"small"}
          type={"internal"}
          handleClick={() => navigate(`/${network}/dashboard/rewards`)}
        >
          Rewards History
        </LinkButton>
      </section>
    </div>
  );
};

export default ClaimedRewards;
