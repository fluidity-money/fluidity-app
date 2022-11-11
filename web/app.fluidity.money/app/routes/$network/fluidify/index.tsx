import type { Token } from "~/util/chainUtils/tokens";

import { Display, Text } from "@fluidity-money/surfing";
import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { debounce, DebouncedFunc } from "lodash";
import { useEffect, useState } from "react";
import { DndProvider, useDrop } from "react-dnd";
import ItemTypes from "~/types/ItemTypes";
import DragCard from "~/components/DragCard";

import styles from "~/styles/fluidify.css";

// Use touch backend for mobile devices
import { HTML5Backend } from "react-dnd-html5-backend";

import config, { colors } from "~/webapp.config.server";

export const loader: LoaderFunction = async ({ params }) => {
  const { network } = params;

  const {
    config: {
      [network as string]: { tokens },
    },
  } = config;

  return json({
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
      {!canDrop && (
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
      <div className={"fluidify-container"}>
        <aside>
          <Display style={{ margin: 0 }}>Create or revert fluid assets</Display>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your assets"
          />
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
        </aside>

        {/* Swap Circle */}
        <FluidityHotSpot />
      </div>
    </DndProvider>
  );
}

export { ErrorBoundary };
