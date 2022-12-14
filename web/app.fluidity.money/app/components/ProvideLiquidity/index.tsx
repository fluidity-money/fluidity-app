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

  // type for TOML type
  type FluidTokens = "fUSDC" | "fUSDT" | "fTUSD" | "fFRAX" | "fDAI";

  const fluidTokens = tokensConfig[network].tokens
    .map((token) => token)
    .filter((token) => token.isFluidOf);

  // token for liquidity provider pools
  const [poolToken, setPoolToken] = useState(fluidTokens[0]);

  const providers =
    network === "ethereum"
      ? provider["ethereum"].providers
      : provider["solana"].providers;

  const liqidityProviders = (
    <div className="liquidity-providers">
      {providers.map((provider) => (
        <motion.a
          key={provider.name}
          href={provider.link[poolToken.symbol as FluidTokens]}
          rel="noopener noreferrer"
          target="_blank"
          variants={parent}
          initial="variantA"
          whileHover="variantB"
        >
          <motion.img
            src={provider.img}
            variants={child}
            style={{ width: 72, height: 72 }}
          />
        </motion.a>
      ))}
    </div>
  );

  const [openDropdown, setOpenDropdown] = useState(false);

  const dropdownOptions = (
    <div className="dropdown-options">
      {fluidTokens.map((option) => (
        <button
          className="token-option"
          onClick={() => {
            setPoolToken(() => option);
          }}
          key={`${option.name} ${option.logo}`}
        >
          <Text size="xl" prominent={true}>
            {option.symbol}
          </Text>
          <img style={{ width: 30, height: 30 }} src={option.logo} />
        </button>
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
            <button
              className="open-provider-dropdown"
              onClick={() => {
                setOpenDropdown(() => !openDropdown);
              }}
              // onBlur={() => setOpenDropdown(false)}
            >
              {openDropdown && dropdownOptions}
              <Heading as="h1" className="fluid-liquidity-token">
                {`ƒ${poolToken.symbol.slice(1)}`}
              </Heading>
              <img
                src="/images/icons/triangleDown.svg"
                style={{ width: 18, height: 8 }}
              />
            </button>
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
