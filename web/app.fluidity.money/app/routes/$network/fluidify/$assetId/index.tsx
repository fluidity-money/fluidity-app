import { fluidAssetOf, Token } from "~/util/chainUtils/tokens";

import { Display } from "@fluidity-money/surfing";
import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
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
import {getUsdAmountMinted, getUsdUserMintLimit, userMintLimitedEnabled} from "~/util/chainUtils/ethereum/transaction";
import FluidityFacadeContext from "contexts/FluidityFacade";
import {JsonRpcProvider} from "@ethersproject/providers";
import {useWeb3React} from "@web3-react/core";

export const loader: LoaderFunction = async ({ params }) => {
  const { network, assetId } = params;

  if (!network) throw new Error("Network not found");
  if (!assetId) throw new Error("Asset not found");

  const networkIndex = 0;

  const {
    config: {
      [network as string]: { tokens },
    },
    drivers: {
      [network as string]: {
        [networkIndex] : {
          rpc: {
            http: rpcUrl
          }
        }
      }
    }
  } = config;

  const assetToken = getTokenFromSymbol(network, assetId);
  if (!assetToken) throw new Error(`Asset ${assetId} not found`);

  // find the fluid asset to get its mint limits
  const fluidAssetAddress = fluidAssetOf(tokens, assetToken);
  if (!fluidAssetAddress) throw new Error(`No matching fluid token for ${assetId}`);

  const provider = new JsonRpcProvider(rpcUrl);

  const mintLimitEnabled = await userMintLimitedEnabled(provider, fluidAssetAddress, tokenAbi)

  const userMintLimit = mintLimitEnabled ?
    await getUsdUserMintLimit(provider, fluidAssetAddress, tokenAbi) :
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
  const { provider } = useWeb3React();

  const fluidTokenAddress = useMemo(() => (
    fluidAssetOf(tokens, assetToken)
  ), [assetToken])

  const [amountMinted, setAmountMinted] = useState<number | undefined>();
  const [search, setSearch] = useState("");
  const [swapping, setSwapping] = useState(false);
  const [finishing, setFinishing] = useState(false);

  useEffect(() => {
    if (
      assetToken.userMintLimit &&
      address && 
      fluidTokenAddress &&
      provider
    ) {
      // get a provider with the correct type
      const rpcProvider = provider.getSigner().provider;
      getUsdAmountMinted(rpcProvider, assetToken.address, tokenAbi, address)
        .then(setAmountMinted);
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
