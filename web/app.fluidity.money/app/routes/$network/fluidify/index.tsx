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
import { useLoaderData, Link, useNavigate } from "@remix-run/react";
import { debounce, DebouncedFunc } from "lodash";
import { useContext, useEffect, useMemo, useState } from "react";
import { DndProvider } from "react-dnd";
import FluidifyCard from "~/components/FluidifyCard";

// Use touch backend for mobile devices
import { HTML5Backend } from "react-dnd-html5-backend";

import config, { colors } from "~/webapp.config.server";
import FluidityFacadeContext from "contexts/FluidityFacade";
import SwapCircle from "~/components/Fluidify/SwapCircle";
import FluidifyForm from "~/components/Fluidify/FluidifyForm";
import AugmentedToken from "~/types/AugmentedToken";
import Draggable from "~/components/Draggable";
import ItemTypes from "~/types/ItemTypes";
import tokenAbi from "~/util/chainUtils/ethereum/Token.json";
import { JsonRpcProvider } from "@ethersproject/providers";
import {
  userMintLimitedEnabled,
  getUsdUserMintLimit,
} from "~/util/chainUtils/ethereum/transaction";
import SwapCompleteModal from "~/components/SwapCompleteModal";

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
    const mainnetId = 0;

    const {
      drivers: {
        ethereum: {
          [mainnetId]: {
            rpc: { http: infuraUri },
          },
        },
      },
    } = config;

    const provider = new JsonRpcProvider(infuraUri);

    const augmentedTokens: AugmentedToken[] = await Promise.all(
      tokens.map(async (token) => {
        const { isFluidOf, address } = token;

        // Reverting has no mint limits
        if (isFluidOf) {
          return {
            ...token,
            userMintLimit: undefined,
            userTokenBalance: 0,
          };
        }

        const fluidPair = tokens.find(({ isFluidOf }) => isFluidOf === address);

        if (!fluidPair)
          throw new Error(`Could not find fluid Pair of ${token.name}`);

        const mintLimitEnabled = await userMintLimitedEnabled(
          provider,
          fluidPair.address,
          tokenAbi
        );

        const userMintLimit = mintLimitEnabled
          ? await getUsdUserMintLimit(provider, fluidPair.address, tokenAbi)
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
      // const { name, symbol } = token;

      const mintLimit = isFluidOf
        ? // ?await userMintLimit(name)
          undefined
        : undefined;

      const tokensMinted = mintLimit
        ? // ?await userAmountMinted(symbol)
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
  const { tokens: tokens_, colors, network } = useLoaderData<LoaderData>();
  const { address, amountMinted, connected, connecting, disconnect, balance } =
    useContext(FluidityFacadeContext);

  const navigate = useNavigate();

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
  const [assetToken, setAssetToken] = useState<AugmentedToken>();

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

  const [connectedWalletModalVisibility, setConnectedWalletModalVisibility] =
    useState(false);
  const [walletModalVisibility, setWalletModalVisibility] = useState(
    !connected
  );

  // If not connected, prompt user to connect
  useEffect(() => {
    connected && setWalletModalVisibility(false);
  }, [connected]);

  const [swapAmount, setSwapAmount] = useState(0);

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

  const handleRedirect = (amount: number) => {
    return navigate(`out?toToken=${toToken?.symbol}&amount=${amount}`);
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
    const typeFilteredTokens = tokens.filter(
      searchFilters[activeFilterIndex].filter
    );
    debouncedSearch(typeFilteredTokens);

    return () => {
      debouncedSearch.cancel();
    };
  }, [search, activeFilterIndex, tokens]);

  const [swapCompleteModal, setSwapCompleteModal] = useState(false);

  return (
    <DndProvider backend={HTML5Backend}>
      {swapCompleteModal && (
        <SwapCompleteModal
          visible={swapCompleteModal}
          close={() => setSwapCompleteModal(false)}
          colorMap={colors}
          assetToken={tokens[0]}
        />
      )}
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
            colorMap={colors}
          />

          {assetToken && toToken && (
            <FluidifyForm
              handleSwap={handleRedirect}
              swapAmount={swapAmount}
              setSwapAmount={setSwapAmount}
              assetToken={assetToken}
              toToken={toToken}
              swapping={swapping}
            />
          )}
        </div>
      )}

      {!openMobModal && (
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
                      />
                    </Draggable>
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
                swapAmount={swapAmount}
                setSwapAmount={setSwapAmount}
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
