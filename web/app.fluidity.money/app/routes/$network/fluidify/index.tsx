import type AugmentedToken from "~/types/AugmentedToken";
import type { TransactionResponse } from "~/util/chainUtils/instructions";

import { useLoaderData, Link } from "@remix-run/react";
import { debounce, DebouncedFunc } from "lodash";
import { useContext, useEffect, useMemo, useState } from "react";
import { DndProvider } from "react-dnd";
import ItemTypes from "~/types/ItemTypes";
import useViewport from "~/hooks/useViewport";
import FluidityFacadeContext from "contexts/FluidityFacade";
// Use touch backend for mobile devices
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  Display,
  GeneralButton,
  LinkButton,
  Text,
} from "@fluidity-money/surfing";
import Draggable from "~/components/Draggable";
import FluidifyCard from "~/components/FluidifyCard";
import ConnectedWallet from "~/components/ConnectedWallet";
import ConnectWalletModal from "~/components/ConnectWalletModal";
import { ConnectedWalletModal } from "~/components/ConnectedWalletModal";
import SwapCircle from "~/components/Fluidify/SwapCircle";
import FluidifyForm from "~/components/Fluidify/FluidifyForm";
import SwapCompleteModal from "~/components/SwapCompleteModal";
import { captureException } from "@sentry/react";
import { json, LoaderFunction } from "@remix-run/node";
import { useCache } from "~/hooks/useCache";
import { Chain } from "~/util/chainUtils/chains";
import config from "~/webapp.config.server";


type LoaderData = {
  network: string;
  tokens: AugmentedToken[];
  colors: {
    [symbol: string]: string;
  };
};

export const loader: LoaderFunction = async ({ params }) => {
  const { network } = params;

  const ethereumWallets = config.config["ethereum"].wallets;
  
  return json({
    ethereumWallets,
    network,
  })
}

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
  const { network } = useLoaderData<{network: Chain}>();
  const { data: loaderData } = useCache<LoaderData>(`/${network}/query/fluidify`);

  const defaultData: LoaderData = {
    tokens: [],
    colors: {},
    network: network,
  }

  const { tokens: tokens_, colors } = loaderData || defaultData;

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

  const { width } = useViewport();

  const isTablet = width < 1250;

  // Switch over to Form, on Mobile
  const [openMobModal, setOpenMobModal] = useState(false);

  // If screen is Desktop, restore normal view
  useEffect(() => {
    if (!isTablet) return setOpenMobModal(false);
  }, [width]);

  // Tokens return from loader
  const [tokens, setTokens] = useState<AugmentedToken[]>(tokens_);

  // Currently selected token
  const [assetToken, setAssetToken] = useState<AugmentedToken | undefined>();

  const tokenIsFluid = !!assetToken?.isFluidOf;

  // Destination token
  const toToken = useMemo(
    () =>
      assetToken
        ? tokenIsFluid
          ? tokens.find((t) => t.address === assetToken.isFluidOf)
          : tokens.find((t) => t.isFluidOf === assetToken.address)
        : undefined,
    [assetToken]
  );

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
    amount: 0,
    txHash: "",
  });
  const [swapError, setSwapError] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  let tokensMinted: (number | undefined)[], userTokenBalance: number[];

  // get token data once user is connected
  useEffect(() => {
    if (address) {
      (async () => {
        switch (network) {
          case "ethereum":
            tokensMinted = await Promise.all(
              tokens.map(async (token) => {
                if (token.isFluidOf) return undefined;
                const fluidToken = tokens.find(
                  ({ isFluidOf }) => isFluidOf === token.address
                );

                if (!fluidToken) return undefined;

                return amountMinted?.(fluidToken.address);
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
  }, [address, swapping]);

  const handleRedirect = async (
    transaction: TransactionResponse,
    amount: number
  ) => {
    setSwapData({
      amount,
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
    const typeFilteredTokens = tokens
      .filter(searchFilters[activeFilterIndex].filter)
      .sort((token) => token.userTokenBalance)
      .reverse();

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
              amount: 0,
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
            colorMap={colors}
          />

          {assetToken && toToken && (
            <FluidifyForm
              handleSwap={handleRedirect}
              assetToken={assetToken}
              toToken={toToken}
              swapping={swapping}
            />
          )}
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
            <Link to="../../dashboard/home">
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
                            ? userMintedAmt / userMintLimit
                            : undefined
                        }
                        color={colors[symbol]}
                        amount={userTokenBalance}
                        addToken={handleAddToken}
                      />
                    </div>
                  ) : (
                    <Draggable
                      key={`tok-${symbol}`}
                      type={isFluidOf ? ItemTypes.FLUID_ASSET : ItemTypes.ASSET}
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
                            ? userMintedAmt / userMintLimit
                            : undefined
                        }
                        color={colors[symbol]}
                        amount={userTokenBalance}
                        addToken={handleAddToken}
                      />
                    </Draggable>
                  );
                })}
                {isTablet && (
                  <Text size="xs" className="footer-text">
                    Fluidity employs daily limits on fluidifying assets for{" "}
                    <br /> maintained system stability. Limits reset at midnight
                    EST. <br />
                    Unlimited reversion of fluid to non-fluid assets per day.
                  </Text>
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
                colorMap={colors}
              />
            )}

            {!isTablet && (
              <Text size="xs" className="footer-text">
                Fluidity employs daily limits on fluidifying assets for <br />{" "}
                maintained system stability. Limits reset at midnight EST.{" "}
                <br />
                Unlimited reversion of fluid to non-fluid assets per day.
              </Text>
            )}

            {/* Swap Token Form */}
            {!!assetToken && !isTablet && !!toToken && (
              <FluidifyForm
                handleSwap={handleRedirect}
                assetToken={assetToken}
                toToken={toToken}
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
