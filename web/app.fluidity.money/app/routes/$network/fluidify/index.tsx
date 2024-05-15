import { Token } from "~/util/chainUtils/tokens";
import type AugmentedToken from "~/types/AugmentedToken";
import type { TransactionResponse } from "~/util/chainUtils/instructions";

import { useLoaderData, Link, useSearchParams } from "@remix-run/react";
import BN from "bn.js";
import { getUsdFromTokenAmount } from "~/util/chainUtils/tokens";
import { debounce, DebouncedFunc } from "lodash";
import { useContext, useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import ItemTypes from "~/types/ItemTypes";
import FluidityFacadeContext from "contexts/FluidityFacade";
// Use touch backend for mobile devices
import { HTML5Backend } from "react-dnd-html5-backend";
import config, { colors } from "~/webapp.config.server";
import {
  Display,
  GeneralButton,
  LinkButton,
  Text,
  useViewport,
  ConnectedWallet,
  ConnectedWalletModal,
  FluidifyCard,
  TabButton,
} from "@fluidity-money/surfing";
import Draggable from "~/components/Draggable";
import ConnectWalletModal from "~/components/ConnectWalletModal";
import SwapCircle from "~/components/Fluidify/SwapCircle";
import FluidifyForm from "~/components/Fluidify/FluidifyForm";
import SwapCompleteModal from "~/components/SwapCompleteModal";
import { captureException } from "@sentry/react";
import { json, LoaderFunction } from "@remix-run/node";
import { Chain, chainType } from "~/util/chainUtils/chains";

type LoaderData = {
  tokens: Token[];
  ethereumWallets: {
    name: string;
    id: string;
    description: string;
    logo: string;
  }[];
  network: Chain;
  colors: {
    [symbol: string]: string;
  };
};

export const loader: LoaderFunction = async ({ params }) => {
  const { network } = params;

  const ethereumWallets = config.config["ethereum"].wallets;

  const {
    config: {
      [network as string]: { tokens },
    },
  } = config;

  const pairedTokenAddrs = new Set();
  tokens.forEach(({ address, isFluidOf }) => {
    if (isFluidOf) {
      pairedTokenAddrs.add(address);
      pairedTokenAddrs.add(isFluidOf);
    }
  });

  return json({
    tokens: tokens.filter(({ address }) => pairedTokenAddrs.has(address)),
    ethereumWallets,
    network,
    colors: (await colors)[network as string],
  } as LoaderData);
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

export default function FluidifyToken() {
  const {
    network,
    tokens: defaultTokens,
    colors,
  } = useLoaderData<LoaderData>();

  const {
    address,
    rawAddress,
    amountMinted,
    connected,
    connecting,
    disconnect,
    balance,
    addToken,
  } = useContext(FluidityFacadeContext);

  // Tokens return from loader
  const [tokens, setTokens] = useState<AugmentedToken[]>(
    defaultTokens.map((tok) => ({ ...tok, userTokenBalance: new BN(0) }))
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const token = searchParams.get("token");

  const deeplinkAssetToken = tokens.find(
    (t) => t.symbol.toLowerCase() === token?.toLowerCase()
  );

  // Currently selected token
  const [assetToken, setAssetToken] = useState<AugmentedToken | undefined>(
    deeplinkAssetToken
  );

  const { width } = useViewport();

  const isTablet = width < 1250;

  // Switch over to Form, on Mobile
  const [openMobModal, setOpenMobModal] = useState(assetToken ? true : false);

  // If screen is Desktop, restore normal view
  useEffect(() => {
    if (!isTablet) return setOpenMobModal(false);
  }, [width]);

  // TODO: Remove this entirely. Use search params exclusively as the source of truth w/o side effects.
  useEffect(() => {
    if (!assetToken) {
      return setSearchParams((prev) => {
        const searchParams = prev;
        searchParams.delete("token");
        return searchParams;
      });
    }
    setSearchParams((prev) => {
      const searchParams = prev;
      searchParams.set("token", assetToken.symbol);
      return searchParams;
    });
  }, [assetToken]);

  const tokenIsFluid = !!assetToken?.isFluidOf;

  // Destination token
  const toToken = assetToken
    ? tokenIsFluid
      ? tokens.find((t) => t.address === assetToken.isFluidOf)
      : tokens.find((t) => t.isFluidOf === assetToken.address)
    : undefined;

  const handleAddToken = (symbol: string) => {
    if (!connected || !addToken) return;

    addToken(symbol);
  };

  const [connectedWalletModalVisibility, setConnectedWalletModalVisibility] =
    useState(false);
  const [walletModalVisibility, setWalletModalVisibility] = useState(
    !connected
  );

  // If not connected, prompt user to connect
  useEffect(() => {
    connected && setWalletModalVisibility(false);
  }, [connected]);

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

  // Start swap animation
  const [swapping, setSwapping] = useState(false);
  const [{ amount, txHash }, setSwapData] = useState({
    amount: "",
    txHash: "",
  });
  const [swapError, setSwapError] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  // get token data once user is connected
  useEffect(() => {
    if (!address || swapping) {
      return setTokens(
        tokens.map((token) => ({
          ...token,
          userTokenBalance: new BN(0),
        }))
      );
    }

    (async () => {
      switch (chainType(network)) {
        case "evm": {
          const [tokensMinted, userTokenBalance] = await Promise.all([
            Promise.all(
              tokens.map(async (token) => {
                if (token.isFluidOf) return undefined;

                const fluidToken = tokens.find(
                  ({ isFluidOf }) => isFluidOf === token.address
                );

                if (!fluidToken) return undefined;

                return amountMinted?.(fluidToken.address);
              })
            ),
            Promise.all(
              tokens.map(
                async ({ address }) => (await balance?.(address)) || new BN(0)
              )
            ),
          ]);

          return setTokens(
            tokens.map((token, i) => ({
              ...token,
              userMintedAmt: tokensMinted[i],
              userTokenBalance: userTokenBalance[i],
            }))
          );
        }
        case "solana": {
          // get user token balances
          const userTokenBalance = await Promise.all(
            tokens.map(
              async ({ address }) => (await balance?.(address)) || new BN(0)
            )
          );

          return setTokens(
            tokens.map((token, i) => ({
              ...token,
              userTokenBalance: userTokenBalance[i],
            }))
          );
        }
        case "sui": {
          // get user token balances
          const userTokenBalance = await Promise.all(
            tokens.map(
              async ({ address }) => (await balance?.(address)) || new BN(0)
            )
          );

          return setTokens(
            tokens.map((token, i) => ({
              ...token,
              userTokenBalance: userTokenBalance[i],
            }))
          );
        }
      }
    })();
  }, [address, swapping]);

  // keep asset token up to date once token data is fetched
  useEffect(() => {
    if (assetToken && !assetToken.userMintLimit)
      setAssetToken(tokens.find((t) => t.address === assetToken.address));
  }, [tokens]);

  const handleRedirect = async (
    transaction: TransactionResponse,
    amount: string
  ) => {
    setSwapData({
      amount: amount,
      txHash: transaction.txHash,
    });

    setSwapping(true);

    try {
      const success = await transaction.confirmTx();
      setSwapError(!success);
    } catch (e) {
      captureException(e);
    } finally {
      setConfirmed(true);
    }
  };

  const supportedTokens = ({ enabled }: AugmentedToken) => enabled;

  const [filteredTokens, setFilteredTokens] = useState<AugmentedToken[]>(
    tokens.filter(supportedTokens)
  );

  const debouncedSearch: DebouncedFunc<
    (tokens: AugmentedToken[]) => AugmentedToken[]
  > = debounce((tokens: AugmentedToken[]) => {
    const filteredTokens = tokens
      .filter(supportedTokens)
      .filter(
        (token) =>
          token.name.toLowerCase().includes(search.toLowerCase()) ||
          token.symbol.toLowerCase().includes(search.toLowerCase())
      );

    setFilteredTokens(filteredTokens);
  }, 500);

  useEffect(() => {
    const typeFilteredTokens = tokens
      .filter((n) => n.symbol != "FLY")
      .filter(searchFilters[activeFilterIndex].filter)
      .sort(
        (first, second) =>
          getUsdFromTokenAmount(second.userTokenBalance, second) -
          getUsdFromTokenAmount(first.userTokenBalance, first)
      );

    debouncedSearch(typeFilteredTokens);

    return () => {
      debouncedSearch.cancel();
    };
  }, [search, activeFilterIndex, tokens]);

  return (
    <DndProvider backend={HTML5Backend}>
      {/* Swapping Modal */}
      {swapping && assetToken && toToken && (
        <SwapCompleteModal
          visible={swapping}
          confirmed={confirmed}
          close={() => {
            setSwapping(false);
            setSwapData({
              amount: "",
              txHash: "",
            });
            setSwapError(false);
          }}
          colorMap={colors}
          assetToken={assetToken}
          tokenPair={toToken}
          amount={amount}
          network={network}
          txHash={txHash}
          error={swapError}
        />
      )}

      {/* Mobile Swap Modal */}
      {isTablet && openMobModal && !swapping && (
        <div className="mob-swap-modal">
          <div>
            <LinkButton
              handleClick={() => {
                setOpenMobModal(false);
              }}
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
            colorMap={colors}
          />

          {assetToken &&
            toToken &&
            (!assetToken.isFluidOf && assetToken.symbol !== "USDC" ? (
              <Text size="lg" prominent>
                Token no longer supported!
              </Text>
            ) : (
              <FluidifyForm
                handleSwap={handleRedirect}
                assetToken={assetToken}
                toToken={toToken}
                swapping={swapping}
              />
            ))}
        </div>
      )}

      {!openMobModal && !swapping && (
        <>
          <header className={"fluidify-heading"}>
            <section>
              <Display size="xs" style={{ margin: 0 }}>
                Create or revert <br /> fluid assets
              </Display>
            </section>
            <Link to={`/${network}/dashboard/home`}>
              <LinkButton
                handleClick={() => {
                  // do nothing
                }}
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
              {connected && address ? (
                <ConnectedWallet
                  address={rawAddress ?? ""}
                  callback={() => {
                    setConnectedWalletModalVisibility(
                      !connectedWalletModalVisibility
                    );
                  }}
                  className="connect-wallet-btn"
                />
              ) : (
                <GeneralButton
                  type={connected || connecting ? "transparent" : "primary"}
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
                address={rawAddress ?? ""}
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
                  <TabButton
                    size="default"
                    key={`filter-${filter.name}`}
                    onClick={() => setActiveFilterIndex(i)}
                  >
                    <Text
                      prominent={activeFilterIndex === i}
                      className={activeFilterIndex === i ? "selected" : ""}
                    >
                      {filter.name}
                    </Text>
                  </TabButton>
                ))}
              </div>

              <div className="fluidify-tokens">
                {tokens.length === 0 && (
                  <div
                    style={{
                      padding: "1rem",
                    }}
                  >
                    <Text prominent>
                      <span
                        role="img"
                        aria-label="loading"
                        style={{ padding: "10px" }}
                      >
                        🚀
                      </span>
                      Loading tokens for the first time...
                    </Text>
                  </div>
                )}
                {filteredTokens.length === 0 && search.length > 0 && (
                  <div
                    style={{
                      padding: "1rem",
                    }}
                  >
                    <Text prominent>{`No tokens found for "${search}"`}</Text>
                  </div>
                )}
                {filteredTokens.map((token) => {
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

                  return isTablet ? (
                    <div
                      onClick={() => {
                        setAssetToken(token);
                        setOpenMobModal(true);
                      }}
                      key={`tok-${symbol}`}
                    >
                      <FluidifyCard
                        key={symbol}
                        fluid={isFluidOf !== undefined}
                        symbol={symbol}
                        name={name}
                        logo={logo}
                        address={address}
                        mintCapPercentage={
                          !!userMintLimit && userMintedAmt !== undefined
                            ? userMintedAmt.div(userMintLimit).toNumber()
                            : undefined
                        }
                        color={colors[symbol]}
                        amount={getUsdFromTokenAmount(userTokenBalance, token)}
                        addToken={handleAddToken}
                      />
                    </div>
                  ) : (
                    <div
                      onClick={() => {
                        setAssetToken(token);
                      }}
                      key={`tok-${symbol}`}
                    >
                      <Draggable
                        type={
                          isFluidOf ? ItemTypes.FLUID_ASSET : ItemTypes.ASSET
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
                          mintCapPercentage={
                            !!userMintLimit && userMintedAmt !== undefined
                              ? userMintedAmt.div(userMintLimit).toNumber()
                              : undefined
                          }
                          color={colors[symbol]}
                          amount={getUsdFromTokenAmount(
                            userTokenBalance,
                            token
                          )}
                          addToken={handleAddToken}
                        />
                      </Draggable>
                    </div>
                  );
                })}
              </div>
            </aside>

            {/* Swap Circle */}
            {!isTablet && (
              <SwapCircle
                swapping={swapping}
                setSwapping={setSwapping}
                assetToken={assetToken}
                setAssetToken={setAssetToken}
                colorMap={colors}
              />
            )}

            {/* Swap Token Form */}
            {!!assetToken &&
              !isTablet &&
              !!toToken &&
              (!assetToken.enabled ? (
                <Text size="lg" prominent>
                  Token no longer supported!
                </Text>
              ) : (
                <FluidifyForm
                  handleSwap={handleRedirect}
                  assetToken={assetToken}
                  toToken={toToken}
                  swapping={swapping}
                />
              ))}
          </div>
        </>
      )}
    </DndProvider>
  );
}

export { ErrorBoundary };
