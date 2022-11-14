import {
  Display,
  Text,
  ManualCarousel,
  GeneralButton,
  LinkButton,
} from "@fluidity-money/surfing";
import useViewport from "~/hooks/useViewport";
import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData, useNavigate, Link } from "@remix-run/react";
import { debounce, DebouncedFunc } from "lodash";
import { DndProvider, useDrop } from "react-dnd";
import ItemTypes from "~/types/ItemTypes";
import { useContext, useEffect, useState } from "react";
import DragCard from "~/components/DragCard";
import ConnectedWallet from "~/components/ConnectedWallet";
import ConnectWalletModal from "~/components/ConnectWalletModal";
import { ConnectedWalletModal } from "~/components/ConnectedWalletModal";
import FluidityFacadeContext from "contexts/FluidityFacade";

import styles from "~/styles/fluidify.css";

// Use touch backend for mobile devices
import { HTML5Backend } from "react-dnd-html5-backend";

import config, { colors } from "~/webapp.config.server";
import { Token } from "~/util/chainUtils/tokens";

export const loader: LoaderFunction = async ({ params }) => {
  const { network } = params;

  const ethereumWallets = config.config["ethereum"].wallets;

  const {
    config: {
      [network as string]: { tokens },
    },
  } = config;

  return json({
    network,
    ethereumWallets,
    tokens,
    colors: (await colors)[network as string],
  });
};

type LoaderData = {
  tokens: Token[];
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

const FluidityHotSpot = () => {
  const navigate = useNavigate();

  const { width } = useViewport();

  const isTablet = width < 1200;

  const [{ canDrop }, drop] = useDrop(() => ({
    accept: [ItemTypes.ASSET, ItemTypes.FLUID_ASSET],
    drop: ({ symbol }: Token) => navigate(`${symbol}`),
    collect: (monitor) => ({
      canDrop: monitor.canDrop(),
    }),
  }));

  return (
    <main>
      <div ref={drop} className="fluidify-hot-spot">
        <img
          className="fluidify-circle"
          src="/images/fluidify/fluidify-hotspot.png"
        />
        <span className={"dashed-circle"}>
          {!canDrop && (
            <>
              <Text size={"xs"}>Drag and drop the asset</Text>
              <br />
              <Text size={"xs"}>you want to transform here.</Text>
            </>
          )}
        </span>
      </div>
      {!canDrop && !isTablet && (
        <span className={"center-text"}>
          <Text size={"xs"}>
            Fluidity employ daily limits on fluidifying assets for
          </Text>
          <br />
          <Text size="xs">
            maintained system stability. Limits reset at midnight EST.
          </Text>
          <br />
          <Text size="xs">
            Unlimited reversion of fluid to non-fluid assets per day.
          </Text>
        </span>
      )}
    </main>
  );
};

export default function FluidityMaster() {
  const { tokens, colors } = useLoaderData<LoaderData>();

  const { address, connected, connecting, disconnect } = useContext(
    FluidityFacadeContext
  );

  const { width } = useViewport();

  const isTablet = width < 1200;

  const [connectedWalletModalVisibility, setConnectedWalletModalVisibility] =
    useState(false);
  const [walletModalVisibility, setWalletModalVisibility] = useState(false);

  useEffect(() => {
    connected && setWalletModalVisibility(false);
  }, [connected]);

  const [search, setSearch] = useState("");

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
        <FluidityHotSpot />
      </div>
    </DndProvider>
  );
}

export { ErrorBoundary };
