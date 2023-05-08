import {
  Card,
  Heading,
  Text,
  BloomEffect,
  TokenIcon,
  ArrowDown,
  ProviderIcon,
} from "~/components";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { useClickOutside } from "~/util";
import { Provider, Token } from "~/types";

import styles from "./ProvideLiquidity.module.scss";

type TokenType = {
  symbol: Token;
  name: string;
  logo: string;
  address: string;
  isFluidOf?: string;
  obligationAccount?: string;
  dataAccount?: string;
  decimals: number;
  colour: string;
};

const parent = {
  variantA: { scale: 1 },
  variantB: { scale: 1 },
};

const child = {
  variantA: { scale: 1 },
  variantB: { scale: 1.05 },
};

type AugmentedProvider = {
  name: Provider;
  link: {
    fUSDC?: string;
    fUSDT?: string;
    fTUSD?: string;
    fFRAX?: string;
    fDAI?: string;
  };
};

interface IProvideLiquidity {
  provider: {
    [x: string]: {
      providers: AugmentedProvider[];
    };
  };
  network: string;
  tokensConfig: {
    [x: string]: {
      tokens: {
        symbol: Token;
        address: string;
        name: string;
        logo: string;
        colour: string;
        isFluidOf?: string;
        obligationAccount?: string;
        dataAccount?: string;
        decimals: number;
        userMintLimit?: number;
      }[];
    };
  };
}

const ProvideLiquidity = (props: IProvideLiquidity) => {
  const { provider, network, tokensConfig } = props;

  // type for TOML type
  type FluidTokens = "fUSDC" | "fUSDT" | "fTUSD" | "fFRAX" | "fDAI";

  const fluidTokens = tokensConfig[network].tokens.filter(
    (token: TokenType) => token.isFluidOf
  );

  // token for liquidity provider pools
  const [poolToken, setPoolToken] = useState(fluidTokens[0]);

  const providers =
    network === "ethereum"
      ? provider["ethereum"].providers
      : network === "solana"
        ? provider["solana"].providers
        : provider["arbitrum"].providers;

  const LiquidityProviders = () => (
    <div className={styles["liquidity-providers"]}>
      {providers
        .filter((provider) => !!provider.link[poolToken.symbol as FluidTokens])
        .map((provider: AugmentedProvider) => (
          <motion.a
            key={provider.name}
            href={provider.link[poolToken.symbol as FluidTokens]}
            rel="noopener noreferrer"
            target="_blank"
            variants={parent}
            initial="variantA"
            whileHover="variantB"
          >
            <motion.div variants={child} style={{ width: 72, height: 72 }}>
              <ProviderIcon provider={provider.name} />
            </motion.div>
          </motion.a>
        ))}
    </div>
  );

  const [openDropdown, setOpenDropdown] = useState(false);

  const dropdownRef = useRef(null);
  useClickOutside(dropdownRef, () =>
    setTimeout(() => setOpenDropdown(false), 200)
  );

  const DropdownOptions = () => {
    const supportedFluidTokenNames = new Set(
      providers.map((provider) => Object.keys(provider.link)).flat()
    );

    const supportedFluidTokens = fluidTokens.filter((fluidToken) =>
      supportedFluidTokenNames.has(fluidToken.symbol)
    );

    return (
      <div className={styles["dropdown-options"]}>
        <ul>
          {supportedFluidTokens.map((option: TokenType) => (
            <li key={`${option.name} ${option.logo}`}>
              <button
                className={styles["token-option"]}
                onClick={() => {
                  setPoolToken(() => option);
                }}
              >
                <Text size="xl" prominent={true}>
                  {option.symbol}
                </Text>
                <div
                  style={{
                    height: 32,
                    width: 32,
                  }}
                >
                  <TokenIcon token={option.symbol} />
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <Card
      className={styles.ProvideLiquidity}
      rounded
      type={"transparent"}
      color="holo"
      border="solid"
    >
      <section className={styles["provide-liquidity-left"]}>
        <Heading as="h2" className={styles["provide-heading"]}>
          Provide Liquidity for{" "}
          <button
            ref={dropdownRef}
            className={styles["open-provider-dropdown"]}
            onClick={() => {
              setOpenDropdown(!openDropdown);
            }}
          >
            <span className={styles["fluid-liquidity-token"]}>
              {`ƒ${poolToken.symbol?.slice(1)}`}
            </span>
            <ArrowDown width={18} fill={"white"} />
            {openDropdown && <DropdownOptions />}
          </button>
        </Heading>

        <LiquidityProviders />

        <Text size="lg">
          Make your assets work harder for your rewards. Get involved.
        </Text>
      </section>
      <section className={styles["provide-liquidity-right"]}>
        <div className={styles["provide-liquidity-right-images"]}>
          <BloomEffect color={poolToken.colour} type={"static"} />
          <span className={styles["dashed-circle"]}></span>
          <div
            style={{
              height: 110,
              width: 110,
              position: "absolute",
              transform: "translate(41%, 41%)",
            }}
          >
            <TokenIcon token={poolToken.symbol} />
          </div>
        </div>
      </section>
    </Card>
  );
};

export default ProvideLiquidity;
