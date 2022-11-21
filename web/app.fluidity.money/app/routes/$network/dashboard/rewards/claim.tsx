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
} from "@fluidity-money/surfing";

import claimStyles from "~/styles/dashboard/rewards/claim.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: claimStyles }];
};

export const loader: LoaderFunction = async ({ request }) => {
  // TODO: Get reward TX and fetch reward that way

  const url = new URL(request.url);
  const _reward = url.searchParams.get("reward");
  const reward = _reward ? parseInt(_reward) : 0;

  const _networkFee = url.searchParams.get("networkfee");
  const networkFee = _networkFee ? parseInt(_networkFee) : 0;

  const _gasFee = url.searchParams.get("gasfee");
  const gasFee = _gasFee ? parseInt(_gasFee) : 0;

  return json({
    reward,
    networkFee,
    gasFee,
  });
};

type LoaderData = {
  reward: number;
  networkFee: number;
  gasFee: number;
};

const ClaimedRewards = () => {
  const { reward, networkFee, gasFee } = useLoaderData<LoaderData>();

  const { connected } = useContext(FluidityFacadeContext);

  const navigate = useNavigate();

  if (!connected) return navigate("../../home");

  const generateTweet = () => {
    const twitterUrl = new URL("https://twitter.com/intent/tweet?text=");

    const tweetMsg = `I just redeemed ${numberToMonetaryString(reward)}`;

    twitterUrl.searchParams.set("text", tweetMsg);

    const fluTwitterHandle = `fluiditymoney`;

    twitterUrl.searchParams.set("via", fluTwitterHandle);

    return twitterUrl.href;
  };

  return (
    <div id="claim-container" className="cover">
      {/* Bg Video*/}
      <video
        id="cover-vid"
        src={"/images/FluidityOpportunityB.mp4"}
        autoPlay={true}
        loop={true}
      />

      {/* Navigation Bar */}
      <header id="claim-header">
        <img src="FluidLogo" alt="FluidLogo" />
        <LinkButton
          size={"small"}
          type={"internal"}
          handleClick={() => navigate("..")}
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
            <Text>${networkFee} FUSDC</Text>
          </section>
          <hr />
          <section className="spread-text">
            <Text>Gas fee</Text>
            <Text>${gasFee} FUSDC</Text>
          </section>
          <hr />
        </section>

        {/* Navigation Buttons*/}
        {/* Assets Button - SCOPED OUT */}
        {/*
      <GeneralButton
        version={"primary"}
        buttontype={"text"}
        size={"large"}
        handleClick={() => navigate("assets")}
      >
        Go to Assets
      </GeneralButton>
      */}

        {/* Share on Twitter */}
        <GeneralButton
          className="spread"
          version={"primary"}
          buttontype={"text"}
          size={"large"}
          handleClick={() => {
            navigate("../../../fluidify");
          }}
        >
          Fluidify Your Money
        </GeneralButton>

        {/* Share on Twitter */}
        <GeneralButton
          className="spread"
          version={"secondary"}
          buttontype={"icon before"}
          icon={<img src="/images/socials/twitter.svg" />}
          size={"large"}
          handleClick={() => {
            navigate(generateTweet());
          }}
        >
          Share
        </GeneralButton>
        <LinkButton
          size={"small"}
          type={"internal"}
          handleClick={() => navigate("..")}
        >
          Rewards History
        </LinkButton>
      </section>
    </div>
  );
};

export default ClaimedRewards;
