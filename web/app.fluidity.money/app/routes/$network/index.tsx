import type { LinksFunction } from "@remix-run/node";

import { LoaderFunction, redirect } from "@remix-run/node";
import { useEffect, useState, useContext, useMemo } from "react";
import { useNavigate, useLoaderData } from "@remix-run/react";
import FluidityFacadeContext from "contexts/FluidityFacade";
import config from "~/webapp.config.server";
import { useCache } from "~/hooks/useCache";
import useViewport from "~/hooks/useViewport";
import { networkMapper } from "~/util";
import { generateTweet } from "~/util/tweeter";
import {
  Display,
  GeneralButton,
  LinkButton,
  Text,
  ChainSelectorButton,
  BlockchainModal,
  Twitter,
  numberToMonetaryString,
} from "@fluidity-money/surfing";
import ConnectWalletModal from "~/components/ConnectWalletModal";
import Video from "~/components/Video";
import Modal from "~/components/Modal";
import ConnectedWallet from "~/components/ConnectedWallet";
import { ConnectedWalletModal } from "~/components/ConnectedWalletModal";
import opportunityStyles from "~/styles/opportunity.css";
import { HighestRewardsData } from "./query/projectedWinnings";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: opportunityStyles }];
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

  const { data: projectWinningsData } = useCache<HighestRewardsData>(
    `/${network}/query/projectedWinnings`
  );

  const loaded = !!projectWinningsData?.highestRewards;

  const projectedWinnings = useMemo(
    () =>
      loaded
        ? projectWinningsData?.highestRewards.reduce(
            (sum, { winning_amount_scaled }) => sum + winning_amount_scaled,
            0
          ) / projectWinningsData.highestRewards.length
        : 0,
    [loaded]
  );

  const [walletModalVisibility, setWalletModalVisibility] = useState(
    !connected
  );
  const [chainModalVisibility, setChainModalVisibility] = useState(false);
  const [connectedWalletModalVisibility, setConnectedWalletModalVisibility] =
    useState(false);

  const { width } = useViewport();
  const mobileBreakpoint = 500;

  const chainNameMap = {
    ethereum: {
      name: "ETH",
      icon: <img src="/assets/chains/ethIcon.svg" />,
    },
    solana: {
      name: "SOL",
      icon: <img src="/assets/chains/solanaIcon.svg" />,
    },
  };

  useEffect(() => {
    // stop modal pop-up if connected
    connected && setWalletModalVisibility(false);
  }, [connected]);

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
              chain={chainNameMap[network as "ethereum" | "solana"]}
              onClick={() => setChainModalVisibility(true)}
            />

            <div className="connected-wallet">
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
              <Modal visible={connectedWalletModalVisibility}>
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
              <Modal visible={chainModalVisibility}>
                <BlockchainModal
                  handleModal={setChainModalVisibility}
                  option={chainNameMap[network as "ethereum" | "solana"]}
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
                  version={connected ? "transparent" : "primary"}
                  buttontype="text"
                  size={"medium"}
                  handleClick={() => setWalletModalVisibility(true)}
                  className="connect-wallet-btn"
                >
                  Connnect Wallet
                </GeneralButton>
              )}

              {/* Connect Wallet Modal */}
              <Modal visible={walletModalVisibility}>
                <div className="cover">
                  <ConnectWalletModal
                    visible={walletModalVisibility}
                    close={() => setWalletModalVisibility(false)}
                  />
                </div>
              </Modal>
            </div>

            {/* Expected Earnings */}
            {!!projectedWinnings && connected && (
              <>
                <Display
                  className="winnings-figure"
                  size={width < mobileBreakpoint ? "xs" : "md"}
                >
                  {numberToMonetaryString(projectedWinnings)}
                </Display>
                <Text size={width < mobileBreakpoint ? "md" : "xl"}>
                  Would have been your winnings, based on the last 50
                  transactions.
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
                version="primary"
                buttontype="text"
                handleClick={() => navigate("fluidify")}
              >
                FLUIDIFY MONEY
              </GeneralButton>

              <a
                href={generateTweet(projectedWinnings)}
                rel="noopener noreferrer"
                target="_blank"
              >
                <GeneralButton
                  className="share-button"
                  size="large"
                  version="transparent"
                  buttontype="icon before"
                  icon={<Twitter />}
                  handleClick={() => {
                    return;
                  }}
                >
                  SHARE
                </GeneralButton>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NetworkPage;
