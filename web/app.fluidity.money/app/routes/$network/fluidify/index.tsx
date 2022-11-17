import { fluidAssetOf } from "~/util/chainUtils/tokens";
import useViewport from "~/hooks/useViewport";
import {
  Display,
  GeneralButton,
  LinkButton,
  Text,
} from "@fluidity-money/surfing";
import ConnectedWallet from "~/components/ConnectedWallet";
import ConnectWalletModal from "~/components/ConnectWalletModal";
import { ConnectedWalletModal } from "~/components/ConnectedWalletModal";
import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { debounce, DebouncedFunc } from "lodash";
import { useContext, useEffect, useMemo, useState } from "react";
import { DndProvider } from "react-dnd";
import {
  getTokenFromSymbol,
} from "~/util/chainUtils/tokens";
import FluidifyCard from "~/components/FluidifyCard";

import styles from "~/styles/fluidify.css";

// Use touch backend for mobile devices
import { HTML5Backend } from "react-dnd-html5-backend";

import config, { colors } from "~/webapp.config.server";
import FluidityFacadeContext from "contexts/FluidityFacade";
import SwapCircle from "~/components/Fluidify/SwapCircle";
import FluidifyForm from "~/components/Fluidify/FluidifyForm";
import AugmentedToken from "~/types/AugmentedToken";
import Draggable from "~/components/Draggable";
import ItemTypes from "~/types/ItemTypes";

export const loader: LoaderFunction = async ({ params }) => {
  const { network } = params;

  if (!network) throw new Error("Network not found");

  const ethereumWallets = config.config["ethereum"].wallets;

  const {
    config: {
      [network as string]: { tokens },
    },
  } = config;

  if (network === "ethereum") {
    const augmentedTokens = await Promise.all(
      tokens.map(async (token) => {
        const { isFluidOf } = token;
        // const { address } = token;

        const mintLimitEnabled = isFluidOf
          ? //? await userMintLimitedEnabled(provider, address, tokenAbi)
            true
          : false;

        const userMintLimit = mintLimitEnabled
          ? //? await getUsdUserMintLimit(provider, address, tokenAbi)
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
      const { isFluidOf } = token;
      // const { name } = token;

      const mintLimit = isFluidOf
        ? // ?await userMintLimit(name)
          undefined
        : undefined;

      const tokensMinted = mintLimit
        ? // ?await userAmountMinted(name)
          0
        : 0;

      return {
        ...token,
        userMintLimit: mintLimit,
        userMintedAmt: tokensMinted,
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

function ErrorBoundary(error: unknown) {
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

// Use the component if you're going to add it!
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  const isTablet = width < 1250;

  const [openMobModal, setOpenMobModal] = useState(false);

  useEffect(() => {
    if (!isTablet) return setOpenMobModal(false);
  }, [width]);

  const [tokens, setTokens] = useState<AugmentedToken[]>(tokens_);

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
      filter: () => true,
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

  // Start swap animation
  const [swapping, setSwapping] = useState(false);

  let tokensMinted: (number | undefined)[], userTokenBalance: number[];

  // get token data once user is connected
  useEffect(() => {
    if (address) {
      (async () => {
        switch (network) {
          case "ethereum":
            tokensMinted = await Promise.all(
              tokens.map(async (token) => {
                if (!token.isFluidOf) return undefined;

                return amountMinted?.(token.address);
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

          case "solana": {
            // get user token balances
            const userTokenBalance = await Promise.all(
              tokens.map(async ({ address }) => (await balance?.(address)) || 0)
            );

            setTokens(
              tokens.map((token, i) => ({
                ...token,
                userTokenBalance: userTokenBalance[i],
              }))
            );
            break;
          }
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

    // navigate(`./out?token=${tokenPair.symbol}&amount=${swapAmount}`);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      {/* Mobile Swap Modal */}
      {isTablet && openMobModal && (
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

          {assetToken && (
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
            <Link to="../dashboard/home">
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
                      .map((token) => {
                        const {
                          symbol,
                          name,
                          logo,
                          address,
                          userMintLimit,
                          userMintedAmt,
                          userTokenBalance,
                          isFluidOf,
                        } = token;

                        return (
                          <div
                            onClick={() => {
                              setAssetToken(token);
                              setOpenMobModal(true);
                            }}
                            key={`tok-${symbol}`}
                          >
                            <FluidifyCard
                              key={symbol}
                              onClick={(symbol: string) => {
                                if (width < 700) {
                                  // if mobile view, set token on click and open modal
                                  setOpenMobModal(true);
                                  // strange error where symbol is a string but appears as a the token...
                                  setAssetToken(
                                    tokens.find((t) => t.symbol === symbol)
                                  );
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
                          </div>
                        );
                      })}
                  </>
                ) : (
                  <>
                    {filteredTokens
                      .filter(() => {
                        return true;
                      })
                      .map((token) => {
                        const {
                          symbol,
                          name,
                          logo,
                          address,
                          userMintLimit,
                          userMintedAmt,
                          userTokenBalance,
                          isFluidOf,
                        } = token;

                        return (
                          <Draggable
                            key={`tok-${symbol}`}
                            type={
                              isFluidOf
                                ? ItemTypes.FLUID_ASSET
                                : ItemTypes.ASSET
                            }
                            dragItem={token}
                          >
                            <FluidifyCard
                              key={symbol}
                              fluid={isFluidOf !== undefined}
                              symbol={symbol}
                              name={name}
                              logo={logo}
                              address={address}
                              mintCapPercentage={!!userMintLimit && userMintedAmt !== undefined
                                ? userMintedAmt / userMintLimit
                                : undefined}
                              color={colors[symbol]}
                              amount={userTokenBalance}
                              onClick={() => { return }}                            />
                          </Draggable>
                        );
                      })}
                  </>
                )}
              </div>
            </aside>

            {/* Swap Circle */}
            {!isTablet && (
              <SwapCircle
                swapping={swapping}
                setSwapping={setSwapping}
                assetToken={assetToken}
                setAssetToken={setAssetToken}
              />
            )}

            <Text size="sm" className="footer-text">
              Fluidity employs daily limits on fluidifying assets for <br />{" "}
              maintained system stability. Limits reset at midnight EST. <br />
              Unlimited reversion of fluid to non-fluid assets per day.
            </Text>

            {/* Swap Token Form */}
            {!!assetToken && !isTablet && !!toToken && (
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
