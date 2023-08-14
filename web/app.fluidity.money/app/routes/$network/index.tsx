import type { LinksFunction } from "@remix-run/node";

import { LoaderFunction, redirect } from "@remix-run/node";
import { useEffect, useState, useContext } from "react";
import { useNavigate, useLoaderData, useFetcher } from "@remix-run/react";
import FluidityFacadeContext from "contexts/FluidityFacade";
import config from "~/webapp.config.server";
import { networkMapper } from "~/util";
import { generateRewardTweet } from "~/util/tweeter";
import {
  Display,
  GeneralButton,
  LinkButton,
  Text,
  ChainSelectorButton,
  BlockchainModal,
  Twitter,
  numberToMonetaryString,
  LoadingDots,
  useViewport,
  Video,
  ConnectedWalletModal,
  ConnectedWallet,
  Modal,
} from "@fluidity-money/surfing";
import ConnectWalletModal from "~/components/ConnectWalletModal";
import opportunityStyles from "~/styles/opportunity.css";
import { ProjectedWinData } from "./query/projectedWinnings";
import { Chain } from "~/util/chainUtils/chains";
import { SplitContext } from "contexts/SplitProvider";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: opportunityStyles }];
};

const CHAIN_NAME_MAP: Record<
  string,
  { name: string; icon: JSX.Element; disabled?: boolean }
> = {
  ethereum: {
    name: "ETH",
    icon: <img src="/assets/chains/ethIcon.svg" />,
  },
  arbitrum: {
    name: "ARB",
    icon: <img src="/assets/chains/arbIcon.svg" />,
  },
  polygon_zk: {
    name: "POLY_ZK",
    icon: <img src="/assets/chains/polygonZkIcon.svg" />,
  },
  zk_sync: {
    name: "ZK_SYNC",
    icon: <img src="/assets/chains/zkSyncIcon.svg" />,
  },
  solana: {
    name: "SOL",
    icon: <img src="/assets/chains/solanaIcon.svg" />,
    disabled: true,
  },
};

export const loader: LoaderFunction = async ({ params }) => {
  const { network } = params;

  const redirectTarget = redirect("/");

  const ethereumWallets = config.config["ethereum"].wallets;

  if (!network || !Object.keys(config.drivers).includes(network)) {
    return redirectTarget;
  }

  return {
    network,
    ethereumWallets,
  };
};

type LoaderData = {
  network: string;
};

const NetworkPage = () => {
  const { network } = useLoaderData<LoaderData>();

  const { connected, address, rawAddress, disconnect } = useContext(
    FluidityFacadeContext
  );
  const navigate = useNavigate();

  const { showExperiment } = useContext(SplitContext);

  const projectedWinningsData = useFetcher<ProjectedWinData>();

  useEffect(() => {
    if (!address) return;

    projectedWinningsData.load(
      `/${network}/query/projectedWinnings?address=${address}`
    );
  }, [connected]);

  const projectedWin = projectedWinningsData.data?.projectedWin || 0;

  const loaded = !!projectedWinningsData?.data;

  const [walletModalVisibility, setWalletModalVisibility] = useState(
    !connected
  );
  const [chainModalVisibility, setChainModalVisibility] = useState(false);
  const [connectedWalletModalVisibility, setConnectedWalletModalVisibility] =
    useState(false);

  const { width } = useViewport();
  const mobileBreakpoint = 500;

  const showPolygon = showExperiment("enable-polygonzk");

  const chainNameMap = (() => {
    if (showPolygon) return CHAIN_NAME_MAP;

    const {
      polygon_zk, // eslint-disable-line @typescript-eslint/no-unused-vars
      ...rest
    } = CHAIN_NAME_MAP;
    return rest;
  })();

  useEffect(() => {
    // stop modal pop-up if connected
    connected && setWalletModalVisibility(false);
  }, [connected]);

  if (!showExperiment("enable-polygonzk")) {
    return <></>;
  }

  return (
    <>
      {connected && connected && loaded && (
        <Video
          className="video"
          src={"/videos/FluidityOpportunityA.mp4"}
          type={"none"}
          loop={false}
        />
      )}
      <div className="index-page">
        {/* Navigation Buttons */}
        <div className="header-buttons">
          {/* Fluidity Website Button */}
          <a href="https://fluidity.money" rel="noopener noreferrer">
            <LinkButton
              size={"small"}
              type={"internal"}
              left={true}
              handleClick={() => {
                return;
              }}
            >
              {width < mobileBreakpoint ? "WEBSITE " : "FLUIDITY WEBSITE"}
            </LinkButton>
          </a>

          {/* Dashboard */}
          <LinkButton
            size={"small"}
            type={"internal"}
            handleClick={() => {
              navigate("dashboard/home");
            }}
          >
            {width < mobileBreakpoint ? "APP" : "FLUIDITY APP"}
          </LinkButton>
        </div>
        <div className="connected">
          <div className="connected-content">
            {/* Switch Chain Button */}
            <ChainSelectorButton
              chain={chainNameMap[network as Chain]}
              onClick={() => setChainModalVisibility(true)}
            />

            <div>
              {/* Connected Wallet */}
              {address && (
                <ConnectedWallet
                  address={rawAddress ?? ""}
                  callback={() => {
                    setConnectedWalletModalVisibility(true);
                  }}
                />
              )}

              {/* Switch Chain Modal */}
              <Modal id="switch-chain" visible={connectedWalletModalVisibility}>
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
              </Modal>

              {/* Switch Chain Modal */}
              <Modal id="switch-chain" visible={chainModalVisibility}>
                <BlockchainModal
                  handleModal={setChainModalVisibility}
                  option={chainNameMap[network as Chain]}
                  options={Object.values(chainNameMap)}
                  setOption={(chain: string) =>
                    navigate(`/${networkMapper(chain)}/dashboard/home`)
                  }
                  mobile={width <= mobileBreakpoint}
                />
              </Modal>

              {/* Connect Wallet Button */}
              {!connected && (
                <GeneralButton
                  type={connected ? "transparent" : "primary"}
                  size={"medium"}
                  handleClick={() => setWalletModalVisibility(true)}
                  className="connect-wallet-btn"
                >
                  Connnect Wallet
                </GeneralButton>
              )}

              {/* Connect Wallet Modal */}
              <Modal id="connect-wallet" visible={walletModalVisibility}>
                <div className="cover">
                  <ConnectWalletModal
                    visible={walletModalVisibility}
                    close={() => setWalletModalVisibility(false)}
                  />
                </div>
              </Modal>
            </div>

            {/* Expected Earnings */}
            {projectedWinningsData.state === "loading" && connected && (
              <>
                <div className="loader-dots">
                  <LoadingDots />
                </div>
                <Text size={width < mobileBreakpoint ? "md" : "xl"}>
                  Loading your transactions from last week...
                </Text>
                <br />
              </>
            )}

            {/* Expected Earnings */}
            {!!projectedWinningsData.data && connected && (
              <>
                <Display
                  className="winnings-figure"
                  size={width < mobileBreakpoint ? "xs" : "md"}
                >
                  {numberToMonetaryString(projectedWin)}
                </Display>
                <Text size={width < mobileBreakpoint ? "md" : "xl"}>
                  Would have been your winnings, based on your transactions last
                  week.
                </Text>
                <br />
              </>
            )}

            <Text size={width < mobileBreakpoint ? "md" : "xl"}>
              Fluidify your assets to start earning.
            </Text>

            {/* Navigation Buttons */}
            <div className="connected-buttons">
              <GeneralButton
                size="large"
                type="primary"
                handleClick={() => navigate("fluidify")}
              >
                FLUIDIFY MONEY
              </GeneralButton>

              {!!projectedWinningsData.data && (
                <a
                  href={generateRewardTweet(projectedWin)}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <GeneralButton
                    className="share-button"
                    size="large"
                    type="transparent"
                    layout="before"
                    icon={<Twitter />}
                    handleClick={() => {
                      return;
                    }}
                  >
                    SHARE
                  </GeneralButton>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NetworkPage;
