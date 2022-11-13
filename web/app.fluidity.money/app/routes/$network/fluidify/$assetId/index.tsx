import type { Token } from "~/util/chainUtils/tokens";

import { Display } from "@fluidity-money/surfing";
import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { debounce, DebouncedFunc } from "lodash";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
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
import {getUsdAmountMinted, getUsdUserMintLimit, userMintLimitedEnabled} from "~/util/chainUtils/ethereum/transaction";
import FluidityFacadeContext from "contexts/FluidityFacade";

export const loader: LoaderFunction = async ({ params }) => {
  const { network, assetId } = params;

  if (!network) throw new Error("Network not found");
  if (!assetId) throw new Error("Asset not found");

  const {
    config: {
      [network as string]: { tokens },
    },
  } = config;

  const assetToken = getTokenFromSymbol(network, assetId);

  if (!assetToken) throw new Error(`Asset ${assetId} not found`);

  // find the fluid asset to get its mint limits
  const fluidAssetAddress = assetToken.isFluidOf ?
    assetToken.address :
    tokens.find(({isFluidOf}) => isFluidOf === assetToken.address)?.address;

  if (!fluidAssetAddress) throw new Error(`No matching fluid token for ${assetId}`);


  const mintLimitEnabled = await userMintLimitedEnabled(fluidAssetAddress, tokenAbi)
  const userMintLimit = mintLimitEnabled ?
    await getUsdUserMintLimit(fluidAssetAddress, tokenAbi) :
    undefined;

  return json({
    tokens,
    assetToken: {
      ...assetToken,
      userMintLimit,
    },
    colors: (await colors)[network as string],
  });
};

type LoaderData = {
  tokens: Token[];
  assetToken: Token & {userMintLimit?: number};
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
  const { tokens, colors, assetToken } = useLoaderData<LoaderData>();
  const { address } = useContext(FluidityFacadeContext);

  const [amountMinted, setAmountMinted] = useState<number | undefined>();
  const [search, setSearch] = useState("");
  const [swapping, setSwapping] = useState(false);
  const [finishing, setFinishing] = useState(false);

  useEffect(() => {
    if (assetToken.userMintLimit && address) {
      getUsdAmountMinted(assetToken.address, tokenAbi, address)
        .then(setAmountMinted);
    }
  }, [assetToken]);

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
      <div className="fluidify-container">
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
        {swapping ? (
          <Video
            src={"/videos/FLUIDITY_01.mp4"}
            loop={!finishing}
            type="none"
            scale={2}
            onEnded={() => {
              console.log("done");
              setSwapping(false);
            }}
          />
        ) : (
          <FluidityHotSpot activeToken={assetToken} />
        )}

        <button
          onClick={() => {
            swapping ? setFinishing(true) : setSwapping(true);
          }}
        >
          Toggle Swap
        </button>
      </div>
    </DndProvider>
  );
}

export { ErrorBoundary };
