import { fluidAssetOf, Token } from "~/util/chainUtils/tokens";
import useViewport from "~/hooks/useViewport";
import {
  Display,
  GeneralButton,
  LinkButton,
  Text,
  numberToMonetaryString,
} from "@fluidity-money/surfing";
import ConnectedWallet from "~/components/ConnectedWallet";
import ConnectWalletModal from "~/components/ConnectWalletModal";
import { ConnectedWalletModal } from "~/components/ConnectedWalletModal";
import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { debounce, DebouncedFunc } from "lodash";
import { useContext, useEffect, useMemo, useState } from "react";
import { DndProvider, useDrop } from "react-dnd";
import {
  getTokenFromSymbol,
  getTokenForNetwork,
} from "~/util/chainUtils/tokens";
import ItemTypes from "~/types/ItemTypes";
import DragCard from "~/components/DragCard";
import FluidifyCard from "~/components/FluidifyCard";
import Video from "~/components/Video";

import styles from "~/styles/fluidify.css";

// Use touch backend for mobile devices
import { HTML5Backend } from "react-dnd-html5-backend";

import config, { colors } from "~/webapp.config.server";
import {
  getUsdAmountMinted,
  getUsdUserMintLimit,
} from "~/util/chainUtils/ethereum/transaction";
import FluidityFacadeContext from "contexts/FluidityFacade";
import { JsonRpcProvider } from "@ethersproject/providers";
import { AnimatePresence, motion } from "framer-motion";
import { userMintLimit } from "~/util/chainUtils/solana/mintLimits";

export const loader: LoaderFunction = async ({ params }) => {
  const { network } = params;

  if (!network) throw new Error("Network not found");

  const ethereumWallets = config.config["ethereum"].wallets;

  const networkIndex = 0;

  const {
    config: {
      [network as string]: { tokens },
    },
    drivers: {
      [network as string]: {
        [networkIndex]: {
          rpc: { http: rpcUrl },
        },
      },
    },
  } = config;

  const fluidTokenSet = new Set(getTokenForNetwork(network ?? ""));

  if (network === "ethereum") {
    const provider = new JsonRpcProvider(rpcUrl);

    const augmentedTokens = await Promise.all(
      tokens.map(async (token) => {
        const mintLimitEnabled = fluidTokenSet.has(token.address)
          ? //? await userMintLimitedEnabled(provider, token.address, tokenAbi)
            true
          : false;

        const userMintLimit = mintLimitEnabled
          ? //? await getUsdUserMintLimit(provider, token.address, tokenAbi)
            undefined
          : undefined;

        return {
          ...token,
          userMintLimit: userMintLimit,
          userTokenBalance: 0,
        };
      })
    );

    return json({
      network,
      tokens: augmentedTokens,
      ethereumWallets,
      colors: (await colors)[network as string],
    });
  }

  // Network === "solana"
  const augmentedTokens = await Promise.all(
    tokens.map(async (token) => {
      const mintLimit = undefined;

      return {
        ...token,
        userMintLimit: mintLimit,
        userTokenBalance: 0,
      };
    })
  );

  return json({
    network,
    tokens: augmentedTokens,
    ethereumWallets,
    colors: (await colors)[network as string],
  });
};

type AugmentedToken = Token & {
  userMintLimit?: number;
  userMintedAmt?: number;
  userTokenBalance: number;
};

type LoaderData = {
  network: string;
  tokens: AugmentedToken[];
  colors: {
    [symbol: string]: string;
  };
};

export const links = () => {
  return [
    {
      rel: "stylesheet",
      href: styles,
    },
  ];
};

function ErrorBoundary(error: any) {
  console.log(error);
  return (
    <div
      style={{
        paddingTop: "40px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img src="/images/logoMetallic.png" alt="" style={{ height: "40px" }} />
      <h1 style={{ textAlign: "center" }}>Could not find Token to Fluidify!</h1>
    </div>
  );
}

const FluidityHotSpot = ({
  activeToken,
  callBack,
}: {
  activeToken?: AugmentedToken;
  callBack: React.Dispatch<React.SetStateAction<AugmentedToken | undefined>>;
}) => {
  const drop = useDrop(() => ({
    accept: [ItemTypes.ASSET, ItemTypes.FLUID_ASSET],
    drop: callBack,
    collect: (monitor) => ({
      canDrop: monitor.canDrop(),
    }),
  }))[1];

  return (
    <AnimatePresence>
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        exit={{ opacity: 0 }}
        className="main-hotspot"
      >
        <div ref={drop} className="fluidify-hot-spot">
          <img
            className="fluidify-circle"
            src="/images/fluidify/fluidify-hotspot.png"
          />
          <span className={"dashed-circle"}>
            {!activeToken && (
              <Text size="sm" className="circle-text">
                Drag and drop the asset <br /> you want to fluidify here.{" "}
              </Text>
            )}
            {activeToken && (
              <img
                className={`fluidify-token ${
                  activeToken.isFluidOf ? "fluid-token" : ""
                }`}
                src={activeToken.logo}
              />
            )}
          </span>
        </div>
      </motion.main>
    </AnimatePresence>
  );
};

interface ISwapCircleProps {
  swapping: boolean;
  setSwapping: React.Dispatch<React.SetStateAction<boolean>>;
  assetToken?: AugmentedToken;
  setAssetToken: React.Dispatch<
    React.SetStateAction<AugmentedToken | undefined>
  >;
}

export const SwapCircle = ({
  swapping,
  setSwapping,
  assetToken,
  setAssetToken,
}: ISwapCircleProps) => {
  return (
    <>
      {swapping ? (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            exit={{ opacity: 0 }}
            className="video-container"
          >
            <Video
              className="swapping-video"
              src={"/videos/FLUIDITY_01.mp4"}
              loop={false}
              type="none"
              scale={2}
              onEnded={() => {
                setSwapping(false);
              }}
            />
            <img src={assetToken!.logo} />
          </motion.div>
        </AnimatePresence>
      ) : (
        <FluidityHotSpot activeToken={assetToken} callBack={setAssetToken} />
      )}
    </>
  );
};

interface IFluidifyFormProps {
  handleSwap: (e: React.FormEvent<HTMLFormElement>) => void;
  tokenIsFluid: boolean;
  swapAmount: number;
  setSwapAmount: React.Dispatch<React.SetStateAction<number>>;
  assetToken: AugmentedToken;
  toToken: SerializeObject<UndefinedToOptional<AugmentedToken>>;
  userTokenAmount?: number;
  swapping: boolean;
}

export const FluidifyForm = ({
  handleSwap,
  tokenIsFluid,
  swapAmount,
  setSwapAmount,
  assetToken,
  toToken,
  userTokenAmount,
  swapping,
}: IFluidifyFormProps) => {
  return (
    <form className={"fluidify-form"} onSubmit={handleSwap}>
      <Text size="lg" prominent>
        AMOUNT TO {tokenIsFluid ? "REVERT" : "FLUIDIFY"}
      </Text>

      <section className={"fluidify-form-el fluidify-input-container"}>
        <img
          className={`fluidify-form-logo ${
            tokenIsFluid ? "fluid-token-form-logo" : ""
          }`}
          src={assetToken.logo}
        />
        {/* Swap Field */}
        <input
          className={"fluidify-input"}
          type={"number"}
          min={"0"}
          value={swapAmount}
          onChange={(e) =>
            setSwapAmount(
              Math.min(parseFloat(e.target.value) || 0, userTokenAmount || 0)
            )
          }
          placeholder=""
          step="any"
        />
        <Text size="lg">{assetToken.symbol}</Text>
      </section>

      <hr className={"fluidify-form-el"} />

      {/* Creating / Remaining Tokens */}
      <Text>
        Creating ${swapAmount} {toToken?.symbol || ""}
      </Text>
      {/* Tokens User Holds */}
      <Text prominent>
        {userTokenAmount} {assetToken.symbol} (
        {numberToMonetaryString(userTokenAmount || 0)}) remaining in wallet.
      </Text>

      {/* Daily Limit */}
      {!!assetToken.userMintLimit && (
        <Text>
          Daily {assetToken.symbol} limit: {assetToken.userMintedAmt}/
          {assetToken.userMintLimit}
        </Text>
      )}

      {/* Submit Button */}
      <GeneralButton
        version={"primary"}
        size="large"
        buttontype="text"
        type={"submit"}
        handleClick={() => null}
        disabled={swapping}
        className={"fluidify-form-submit"}
      >
        {tokenIsFluid
          ? !swapping
            ? "Revert Fluid Asset"
            : `Reverting ${assetToken.symbol}`
          : !swapping
          ? "Create Fluid Asset"
          : `Creating ${toToken?.symbol || ""}...`}
      </GeneralButton>
    </form>
  );
};

const FooterText = () => {
  return (
    <Text size="sm" className="footer-text">
      Fluidity employ daily limits on fluidifying assets for <br /> maintained
      system stability. Limits reset at midnight EST. <br />
      Unlimited reversion of fluid to non-fluid assets per day.
    </Text>
  );
};

export default function FluidifyToken() {
  const { tokens: tokens_, colors, network } = useLoaderData<LoaderData>();
  const {
    address,
    swap,
    amountMinted,
    connected,
    connecting,
    disconnect,
    balance,
  } = useContext(FluidityFacadeContext);

  const { width } = useViewport();

  const isTablet = width < 1200;

  const [tokens, setTokens] = useState(tokens_);

  const [assetToken, setAssetToken] = useState<AugmentedToken>();

  const tokenIsFluid = !!assetToken?.isFluidOf;

  const fluidTokenAddress = useMemo(
    () => (assetToken ? fluidAssetOf(tokens, assetToken) : undefined),
    [assetToken]
  );

  const toToken = useMemo(
    () =>
      assetToken
        ? tokenIsFluid
          ? tokens.find((t) => t.address === assetToken.isFluidOf)
          : tokens.find((t) => t.isFluidOf === assetToken.address)
        : undefined,
    [assetToken]
  );

  const [connectedWalletModalVisibility, setConnectedWalletModalVisibility] =
    useState(false);
  const [walletModalVisibility, setWalletModalVisibility] = useState(
    !connected
  );

  useEffect(() => {
    connected && setWalletModalVisibility(false);
  }, [connected]);

  const [userTokenAmount, setUserTokenAmount] = useState<number | undefined>();

  const [search, setSearch] = useState("");
  const [activeFilterIndex, setActiveFilterIndex] = useState(0);

  const searchFilters = [
    {
      name: "All assets",
      filter: (_: AugmentedToken) => true,
    },
    {
      name: "Fluid",
      filter: (t: AugmentedToken) => t.isFluidOf,
    },
    {
      name: "Regular",
      filter: (t: AugmentedToken) => !t.isFluidOf,
    },
  ];
  // loop = false, once video over, on end reset.
  const [swapAmount, setSwapAmount] = useState(0);

  const [swapping, setSwapping] = useState(false);
  const [finishing, setFinishing] = useState(false);

  useEffect(() => {
    if (address) {
      (async () => {
        switch (network) {
          case "ethereum":
            let tokensMinted = await Promise.all(
              tokens.map(async (token) => {
                if (!token.isFluidOf) return undefined;

                return amountMinted?.(token.address);
              })
            );

            let userTokenBalance = await Promise.all(
              tokens.map(async ({ address }) => (await balance?.(address)) || 0)
            );

            setTokens(
              tokens.map((token, i) => ({
                ...token,
                userMintedAmt: tokensMinted[i],
                userTokenBalance: userTokenBalance[i],
              }))
            );
            break;

          case "solana":
            tokensMinted = await Promise.all(
              tokens.map(async (token) => {
                if (!token.isFluidOf) return undefined;
                return await amountMinted?.(token.name);
              })
            );

            userTokenBalance = await Promise.all(
              tokens.map(async ({ address }) => (await balance?.(address)) || 0)
            );

            setTokens(
              tokens.map((token, i) => ({
                ...token,
                userMintedAmt: tokensMinted[i],
                userTokenBalance: userTokenBalance[i],
              }))
            );
            break;
        }
      })();
    }
  }, [address]);

  useEffect(() => {
    if (assetToken && address) {
      balance?.(assetToken.address).then(setUserTokenAmount);
    } else {
      setUserTokenAmount(0);
    }
  }, [assetToken, address]);

  const [filteredTokens, setFilteredTokens] = useState<AugmentedToken[]>(
    tokens as AugmentedToken[]
  );

  const debouncedSearch: DebouncedFunc<
    (tokens: AugmentedToken[]) => AugmentedToken[]
  > = debounce((tokens: AugmentedToken[]) => {
    const filteredTokens = tokens.filter(
      (token) =>
        token.name.toLowerCase().includes(search.toLowerCase()) ||
        token.symbol.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredTokens(filteredTokens);
  }, 500);

  useEffect(() => {
    const typeFilteredTokens = tokens.filter(
      searchFilters[activeFilterIndex].filter
    );
    debouncedSearch(typeFilteredTokens);

    return () => {
      debouncedSearch.cancel();
    };
  }, [search, activeFilterIndex, tokens]);

  const handleSwap = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!fluidTokenAddress) return;

    if (!connected || !address) return;

    if (!swap) return;

    if (!userTokenAmount) return;

    if (!swapAmount) return;

    if (swapAmount > (userTokenAmount || 0)) return;

    if (!assetToken) return;

    if (
      assetToken.userMintLimit !== undefined &&
      swapAmount + (assetToken.userMintedAmt || 0) > assetToken.userMintLimit
    )
      return;

    swapAndRedirect();
  };

  const swapAndRedirect = async () => {
    if (!swap) return;

    if (!assetToken) return;

    const rawTokenAmount = `${Math.floor(
      swapAmount * 10 ** assetToken.decimals
    )}`;

    setSwapping(true);

    await swap(rawTokenAmount.toString(), assetToken.address);

    setFinishing(true);

    // navigate(`./out?token=${tokenPair.symbol}&amount=${swapAmount}`);
  };

  const [openMobModal, setOpenMobModal] = useState(false);

  return (
    <DndProvider backend={HTML5Backend}>
      {/* Mobile Swap Modal */}
      {width < 700 && openMobModal && (
        <div className="mob-swap-modal">
          <div>
            <LinkButton
              handleClick={() => setOpenMobModal(false)}
              size="large"
              type="internal"
              left={true}
              className="cancel-btn"
            >
              Cancel
            </LinkButton>
          </div>

          <SwapCircle
            swapping={swapping}
            setSwapping={setSwapping}
            assetToken={assetToken}
            setAssetToken={setAssetToken}
          />

          <FluidifyForm
            handleSwap={handleSwap}
            tokenIsFluid={tokenIsFluid}
            swapAmount={swapAmount}
            setSwapAmount={setSwapAmount}
            assetToken={assetToken}
            toToken={toToken}
            userTokenAmount={userTokenAmount}
            swapping={swapping}
          />

          <Text size="sm" className="swap-footer-text">
            By pressing the button you agree to our <a>terms of service</a>.
          </Text>
        </div>
      )}

      {!openMobModal && (
        <>
          <header className={"fluidify-heading"}>
            <section>
              <Display size="xs" style={{ margin: 0 }}>
                Create or revert <br /> fluid assets
              </Display>

              {connected && address ? (
                <ConnectedWallet
                  address={address.toString()}
                  callback={() => {
                    setConnectedWalletModalVisibility(
                      !connectedWalletModalVisibility
                    );
                  }}
                  className="connect-wallet-btn"
                />
              ) : (
                <GeneralButton
                  version={connected || connecting ? "transparent" : "primary"}
                  buttontype="text"
                  size={"medium"}
                  handleClick={() =>
                    connecting ? null : setWalletModalVisibility(true)
                  }
                  className="connect-wallet-btn"
                >
                  {connecting ? `Connecting...` : `Connect Wallet`}
                </GeneralButton>
              )}

              {/* Connected Wallet Modal */}
              <ConnectedWalletModal
                visible={connectedWalletModalVisibility}
                address={address ? address.toString() : ""}
                close={() => {
                  setConnectedWalletModalVisibility(false);
                }}
                disconnect={() => {
                  disconnect?.();
                  setConnectedWalletModalVisibility(false);
                }}
              />

              {/* Connect Wallet Modal */}
              <ConnectWalletModal
                visible={walletModalVisibility}
                close={() => setWalletModalVisibility(false)}
              />
            </section>
            <Link to="../..">
              <LinkButton
                handleClick={() => null}
                size="large"
                type="internal"
                left={true}
                className="cancel-btn"
              >
                Cancel
              </LinkButton>
            </Link>
          </header>

          {/* Token List */}
          <div className={"fluidify-container"}>
            <aside className={"fluidify-tokens-container"}>
              {/* Search Bar */}
              <input
                className={"search-bar"}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search your assets"
              />

              {/* Filters*/}
              <div className={"fluidify-token-filters"}>
                {searchFilters.map((filter, i) => (
                  <button
                    key={`filter-${filter.name}`}
                    onClick={() => setActiveFilterIndex(i)}
                  >
                    <Text
                      size="lg"
                      prominent={activeFilterIndex === i}
                      className={activeFilterIndex === i ? "selected" : ""}
                    >
                      {filter.name}
                    </Text>
                  </button>
                ))}
              </div>

              <div className="fluidify-tokens">
                {isTablet ? (
                  <>
                    {filteredTokens
                      .filter(() => {
                        return true;
                      })
                      .map(
                        ({
                          address,
                          name,
                          symbol,
                          logo,
                          isFluidOf,
                          userTokenBalance,
                          userMintLimit,
                          userMintedAmt,
                        }) => {
                          return (
                            <FluidifyCard
                              key={symbol}
                              onClick={(symbol: string) => {
                                if (width < 700) {
                                  // if mobile view, set token on click and open modal
                                  setOpenMobModal(true);
                                  // strange error where symbol is a string but appears as a the token...
                                  setAssetToken(symbol);
                                }
                                getTokenFromSymbol(network, symbol);
                              }}
                              fluid={isFluidOf !== undefined}
                              symbol={symbol}
                              name={name}
                              logo={logo}
                              address={address}
                              mintCapPercentage={
                                !!userMintLimit && userMintedAmt !== undefined
                                  ? userMintedAmt / userMintLimit
                                  : undefined
                              }
                              color={colors[symbol]}
                              amount={userTokenBalance}
                            />
                          );
                        }
                      )}
                  </>
                ) : (
                  <>
                    {filteredTokens
                      .filter(() => {
                        return true;
                      })
                      .map((token) => {
                        return (
                          <DragCard
                            key={token.symbol}
                            fluid={token.isFluidOf !== undefined}
                            symbol={token.symbol}
                            name={token.name}
                            logo={token.logo}
                            address={token.address}
                            mintCapPercentage={
                              !!token.userMintLimit &&
                              token.userMintedAmt !== undefined
                                ? token.userMintedAmt / token.userMintLimit
                                : undefined
                            }
                            color={colors[token.symbol]}
                            amount={token.userTokenBalance}
                            token={token}
                          />
                        );
                      })}
                  </>
                )}
              </div>
            </aside>

            {/* Swap Circle */}
            {width > 700 && (
              <SwapCircle
                swapping={swapping}
                setSwapping={setSwapping}
                assetToken={assetToken}
                setAssetToken={setAssetToken}
              />
            )}

            {/* Swap Token Form */}
            {!!assetToken && width > 700 && (
              <FluidifyForm
                handleSwap={handleSwap}
                tokenIsFluid={tokenIsFluid}
                swapAmount={swapAmount}
                setSwapAmount={setSwapAmount}
                assetToken={assetToken}
                toToken={toToken}
                userTokenAmount={userTokenAmount}
                swapping={swapping}
              />
            )}
          </div>
        </>
      )}
    </DndProvider>
  );
}

export { ErrorBoundary };
