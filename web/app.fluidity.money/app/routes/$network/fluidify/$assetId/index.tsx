import { fluidAssetOf, Token } from "~/util/chainUtils/tokens";
import useViewport from "~/hooks/useViewport";
import {
  Display,
  GeneralButton,
  LinkButton,
  Text,
  numberToMonetaryString,
  ManualCarousel,
} from "@fluidity-money/surfing";
import ConnectedWallet from "~/components/ConnectedWallet";
import ConnectWalletModal from "~/components/ConnectWalletModal";
import { ConnectedWalletModal } from "~/components/ConnectedWalletModal";
import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData, useNavigate, Link } from "@remix-run/react";
import { debounce, DebouncedFunc } from "lodash";
import { useContext, useEffect, useMemo, useState } from "react";
import { DndProvider, useDrop } from "react-dnd";
import { getTokenFromSymbol } from "~/util/chainUtils/tokens";
import tokenAbi from "~/util/chainUtils/ethereum/Token.json";
import ItemTypes from "~/types/ItemTypes";
import DragCard from "~/components/DragCard";
import Video from "~/components/Video";

import styles from "~/styles/fluidify.css";

// Use touch backend for mobile devices
import { HTML5Backend } from "react-dnd-html5-backend";

import config, { colors } from "~/webapp.config.server";
import {
  getUsdAmountMinted,
  getUsdUserMintLimit,
  userMintLimitedEnabled,
} from "~/util/chainUtils/ethereum/transaction";
import FluidityFacadeContext from "contexts/FluidityFacade";
import { JsonRpcProvider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";

export const loader: LoaderFunction = async ({ params }) => {
  const { network, assetId } = params;

  if (!network) throw new Error("Network not found");
  if (!assetId) throw new Error("Asset not found");

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

  const assetToken = getTokenFromSymbol(network, assetId);
  if (!assetToken) throw new Error(`Asset ${assetId} not found`);

  // find the fluid asset to get its mint limits
  const fluidAssetAddress = fluidAssetOf(tokens, assetToken);
  if (!fluidAssetAddress)
    throw new Error(`No matching fluid token for ${assetId}`);

  const provider = new JsonRpcProvider(rpcUrl);

  const mintLimitEnabled = await userMintLimitedEnabled(
    provider,
    fluidAssetAddress,
    tokenAbi
  );

  // NOTE: Should be undefined
  const userMintLimit = mintLimitEnabled
    ? await getUsdUserMintLimit(provider, fluidAssetAddress, tokenAbi)
    : 10000;

  return json({
    network,
    tokens,
    ethereumWallets,
    assetToken: {
      ...assetToken,
      userMintLimit,
    },
    colors: (await colors)[network as string],
  });
};

type LoaderData = {
  network: string;
  tokens: Token[];
  assetToken: Token & { userMintLimit?: number };
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

function ErrorBoundary() {
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
      <h1>Could not load Fluidify!</h1>
      <br />
      <h2>Our team has been notified, and are working on fixing it!</h2>
    </div>
  );
}

const FluidityHotSpot = ({ activeToken }: { activeToken: Token }) => {
  const navigate = useNavigate();

  const drop = useDrop(() => ({
    accept: [ItemTypes.ASSET, ItemTypes.FLUID_ASSET],
    drop: ({ symbol }: Token) => navigate(`./../${symbol}`),
    collect: (monitor) => ({
      canDrop: monitor.canDrop(),
    }),
  }))[1];

  return (
    <main>
      <div ref={drop} className="fluidify-hot-spot">
        <img
          className="fluidify-circle"
          src="/images/fluidify/fluidify-hotspot.png"
        />
        <span className={"dashed-circle"}>
          <img src={activeToken.logo} />
        </span>
      </div>
    </main>
  );
};

export default function FluidifyToken() {
  const { tokens, colors, assetToken, network } = useLoaderData<LoaderData>();
  const { address, swap, connected, connecting, disconnect, balance } =
    useContext(FluidityFacadeContext);
  const { provider } = useWeb3React();

  const { width } = useViewport();

  const navigate = useNavigate();

  const isTablet = width < 1200;

  const fluidTokenAddress = useMemo(
    () => fluidAssetOf(tokens, assetToken),
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

  const [amountMinted, setAmountMinted] = useState<number | undefined>();
  const [userTokenAmount, setUserTokenAmount] = useState<number | undefined>();
  const [search, setSearch] = useState("");
  const [swapAmount, setSwapAmount] = useState(0);

  const [swapping, setSwapping] = useState(false);
  const [finishing, setFinishing] = useState(false);

  const tokenIsFluid = !!assetToken.isFluidOf;

  const tokenPair = tokenIsFluid
    ? tokens.find((t) => t.address === assetToken.isFluidOf)
    : tokens.find((t) => t.isFluidOf === assetToken.address);

  if (!tokenPair) throw new Error("Could not find matching Token!");

  useEffect(() => {
    if (assetToken.userMintLimit && address && fluidTokenAddress && provider) {
      // get a provider with the correct type
      const rpcProvider = provider.getSigner().provider;

      if (network === "ethereum") {
        getUsdAmountMinted(
          rpcProvider,
          fluidTokenAddress,
          tokenAbi,
          address
        ).then((amount) => {
          setAmountMinted(amount || 0);
        });

        balance?.(assetToken.address).then(setUserTokenAmount);
      }
    }
  }, [fluidTokenAddress, address]);

  const [filteredTokens, setFilteredTokens] = useState<Token[]>(
    tokens as Token[]
  );

  const debouncedSearch: DebouncedFunc<() => void> = debounce(() => {
    const filtered = tokens.filter(
      (token) =>
        token.name.toLowerCase().includes(search.toLowerCase()) ||
        token.symbol.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredTokens(filtered);
  }, 500);

  useEffect(() => {
    debouncedSearch();
    return () => {
      debouncedSearch.cancel();
    };
  }, [search]);

  const handleSwap = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!fluidTokenAddress) return;

    if (!connected || !address) return;

    if (!swap) return;

    if (!userTokenAmount) return;

    if (!swapAmount) return;

    if (swapAmount > (userTokenAmount || 0)) return;

    if (!assetToken.userMintLimit) return;

    if (amountMinted === undefined) return;

    if (swapAmount + amountMinted > assetToken.userMintLimit) return;

    swapAndRedirect();
  };

  const swapAndRedirect = async () => {
    if (!swap) return;

    const rawTokenAmount = `${Math.floor(
      swapAmount * 10 ** assetToken.decimals
    )}`;

    setSwapping(true);

    setFinishing(true);

    await swap(rawTokenAmount.toString(), assetToken.address);

    navigate(`./out?token=${tokenPair.symbol}&amount=${swapAmount}`);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <header className={"fluidify-heading"}>
        <section>
          <Display size="xs" style={{ margin: 0 }}>
            Create or revert fluid assets
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
          <LinkButton handleClick={() => null} size="large" type="internal">
            Close
          </LinkButton>
        </Link>
      </header>

      {/* Token List */}
      <div className={"fluidify-container"}>
        <aside className={"fluidify-tokens-container"}>
          <input
            className={"search-bar"}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your assets"
          />

          {isTablet ? (
            <ManualCarousel>
              {filteredTokens
                .filter(() => {
                  return true;
                })
                .map(({ address, name, symbol, logo, isFluidOf }) => {
                  return (
                    <DragCard
                      key={symbol}
                      fluid={isFluidOf !== undefined}
                      symbol={symbol}
                      name={name}
                      logo={logo}
                      address={address}
                      color={colors[symbol]}
                      amount={0}
                    />
                  );
                })}
            </ManualCarousel>
          ) : (
            <div className="fluidify-tokens">
              {filteredTokens
                .filter(() => {
                  return true;
                })
                .map(({ address, name, symbol, logo, isFluidOf }) => {
                  return (
                    <DragCard
                      key={symbol}
                      fluid={isFluidOf !== undefined}
                      symbol={symbol}
                      name={name}
                      logo={logo}
                      address={address}
                      color={colors[symbol]}
                      amount={0}
                    />
                  );
                })}
            </div>
          )}
        </aside>

        {/* Swap Circle */}
        {swapping ? (
          <Video
            src={"/videos/FLUIDITY_01.mp4"}
            loop={!finishing}
            type="none"
            scale={2}
            onEnded={() => {
              setSwapping(false);
            }}
          />
        ) : (
          <FluidityHotSpot activeToken={assetToken} />
        )}

        {/* Swap Token Form */}
        <form className={"fluidify-form"} onSubmit={handleSwap}>
          <Text size="lg" prominent>
            AMOUNT TO {tokenIsFluid ? "REVERT" : "FLUIDIFY"}
          </Text>

          <section className={"fluidify-form-el fluidify-input-container"}>
            <img src={assetToken.logo} />
            {/* Swap Field */}
            <input
              className={"fluidify-input"}
              type={"number"}
              min={"0"}
              value={swapAmount}
              onChange={(e) =>
                setSwapAmount(
                  Math.min(
                    parseFloat(e.target.value) || 0,
                    userTokenAmount || 0
                  )
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
            Creating ${swapAmount} {tokenPair.symbol}
          </Text>
          {/* Tokens User Holds */}
          <Text prominent>
            {userTokenAmount} {assetToken.symbol} (
            {numberToMonetaryString(userTokenAmount || 0)}) remaining in wallet.
          </Text>

          {/* Daily Limit */}
          {!!assetToken.userMintLimit && (
            <Text>
              Daily {assetToken.symbol} limit: {amountMinted}/
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
              : `Creating ${tokenPair.symbol}...`}
          </GeneralButton>
        </form>
      </div>
    </DndProvider>
  );
}

export { ErrorBoundary };
