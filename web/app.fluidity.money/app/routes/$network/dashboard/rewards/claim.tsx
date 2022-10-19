import type { LinksFunction } from "@remix-run/node";

import { LoaderFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useNavigate } from "@remix-run/react";
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

  const navigate = useNavigate();

  return (
    <div className="cover">
      {/* Bg Video*/}

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
        buttonType={"text"}
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
        buttonType={"text"}
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
        buttonType={"icon before"}
        icon={"Twitter"}
        size={"large"}
        handleClick={() => {
          console.log("Go To Share");
        }}
      >
        Share
      </GeneralButton>
      <LinkButton
        size={"small"}
        type={"internal"}
        handleClick={() => navigate("..")}
      >
        Reward History
      </LinkButton>
      </section>
    </div>
  );
};

export default ClaimedRewards;
