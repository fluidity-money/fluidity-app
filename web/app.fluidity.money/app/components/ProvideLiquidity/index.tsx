import type { Token } from "~/util/chainUtils/tokens";

import { Card, Heading, Text } from "@fluidity-money/surfing";
import config from "~/webapp.config.server";
import { motion } from "framer-motion";
import { useLoaderData } from "@remix-run/react";
import { MutableRefObject, useEffect, useRef, useState } from "react";
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

const useClickOutside = (
  ref: MutableRefObject<HTMLElement | null>,
  handleClick: VoidFunction
) => {
  useEffect(() => {
    /**
     * Run callback if clicked on outside of element
     */
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handleClick();
      }
    };

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
};

type Provider = {
  name: string;
  link: { [symbol: string]: string };
  img: string;
};

const ProvideLiquidity = () => {
  const { provider, network, tokensConfig } = useLoaderData<LoaderData>();

  // type for TOML type
  type FluidTokens = "fUSDC" | "fUSDT" | "fTUSD" | "fFRAX" | "fDAI";

  const fluidTokens = tokensConfig[network].tokens.filter(
    (token: Token) => token.isFluidOf
  );

  // token for liquidity provider pools
  const [poolToken, setPoolToken] = useState(fluidTokens[0]);

  const providers =
    network === "ethereum"
      ? provider["ethereum"].providers
      : provider["solana"].providers;

  const liqidityProviders = (
    <div className="liquidity-providers">
      {providers.map((provider: Provider) => (
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

  const dropdownRef = useRef(null);
  useClickOutside(dropdownRef, () =>
    setTimeout(() => setOpenDropdown(false), 200)
  );

  const dropdownOptions = (
    <div className="dropdown-options">
      <ul>
        {fluidTokens.map((option: Token) => (
          <li key={`${option.name} ${option.logo}`}>
            <button
              className="token-option"
              onClick={() => {
                setPoolToken(() => option);
              }}
            >
              <Text size="xl" prominent={true}>
                {option.symbol}
              </Text>
              <img style={{ width: 30, height: 30 }} src={option.logo} />
            </button>
          </li>
        ))}
      </ul>
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
          <div>
            {liqidityProviders}
            <Heading as="h2" className="provide-heading">
              Provide Liquidity for{" "}
              <button
                ref={dropdownRef}
                className="open-provider-dropdown"
                onClick={() => {
                  setOpenDropdown(!openDropdown);
                }}
              >
                <Heading as="h1" className="fluid-liquidity-token">
                  {`ƒ${poolToken.symbol.slice(1)}`}
                </Heading>
                <img
                  src="/images/icons/triangleDown.svg"
                  style={{ width: 18, height: 8 }}
                />
                {openDropdown && dropdownOptions}
              </button>
            </Heading>
          </div>

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
