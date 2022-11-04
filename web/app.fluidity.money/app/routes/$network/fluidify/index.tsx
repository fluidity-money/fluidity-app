import { Display } from "@fluidity-money/surfing";
import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { debounce, DebouncedFunc } from "lodash";
import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";

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

type Token = {
  address: string;
  name: string;
  symbol: string;
  logo: string;
  isFluidOf?: string;
};

type LoaderData = {
  tokens: [
    {
      address: string;
      name: string;
      symbol: string;
      logo: string;
      isFluidOf?: string;
    }
  ];
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
      <aside>
        <Display>Create or revert fluid assets</Display>
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
      <main className="fluidify-hot-spot"></main>
    </DndProvider>
  );
}

export { ErrorBoundary };
