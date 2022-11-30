import { Card, Heading, Text } from "@fluidity-money/surfing";
import config from "~/webapp.config.server";
import { motion } from "framer-motion";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import BloomEffect from "../BloomEffect";

const parent = {
  variantA: { scale: 1 },
  variantB: { scale: 1 },
};

const child = {
  variantA: { scale: 1 },
  variantB: { scale: 1.05 },
};

type LoaderData = {
  provider: typeof config.liquidity_providers;
  network: string;
  tokensConfig: typeof config.config;
};

const ProvideLiquidity = () => {
  const { provider, network, tokensConfig } = useLoaderData<LoaderData>();

  const fluidTokens = tokensConfig[network].tokens
    .map((token) => token)
    .filter((token) => token.isFluidOf);

  const [poolToken, setPoolToken] = useState(fluidTokens[3]);

  const providers =
    network === "ethereum"
      ? provider["ethereum"].providers
      : provider["solana"].providers;

  const liqidityProviders = (
    <div className="liquidity-providers">
      {providers.map((provider) => (
        <motion.a
          key={provider.name}
          href={provider.link}
          rel="noopener noreferrer"
          target="_blank"
          variants={parent}
          initial="variantA"
          whileHover="variantB"
        >
          <motion.img src={provider.img} variants={child} />
        </motion.a>
      ))}
    </div>
  );

  return (
    <Card
      id="provide-liquidity"
      className="card-outer"
      component="div"
      rounded={true}
      type={"box"}
    >
      <div className="card-inner">
        <section className="provide-liquidity-left">
          <Heading as="h2" className="provide-heading">
            Provide Liquidity for{" "}
            <Text className="fluid-liquidity-token" prominent={true}>
              {poolToken.symbol}
            </Text>
          </Heading>

          {liqidityProviders}
          <Text size="lg">
            Make your assets work harder for your rewards. Get involved.
          </Text>
        </section>
        <section className="provide-liquidity-right">
          <div className="provide-liquidity-right-images">
            <BloomEffect color={poolToken.colour} type={"static"} />
            <span className="dashed-circle"></span>
            <img
              src={poolToken.logo}
              style={{
                height: 110,
                width: 110,
                position: "absolute",
                transform: "translate(41%, 41%)",
              }}
            />
          </div>
        </section>
      </div>
    </Card>
  );
};

export default ProvideLiquidity;
