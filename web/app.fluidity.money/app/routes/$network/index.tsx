import type { LinksFunction } from "@remix-run/node";

import { LoaderFunction, redirect } from "@remix-run/node";
import { useEffect, useState, useContext } from "react";
import { useNavigate, useLoaderData } from "@remix-run/react";
import FluidityFacadeContext from "contexts/FluidityFacade";
import config from "~/webapp.config.server";
import useViewport from "~/hooks/useViewport";
import { networkMapper } from "~/util";
import { useHighestRewardStatisticsByNetwork } from "~/queries/useHighestRewardStatistics";
import { captureException } from "@sentry/react";
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
import { SolanaWalletModal } from "~/components/WalletModal/SolanaWalletModal";
import Video from "~/components/Video";
import Modal from "~/components/Modal";
import ConnectedWallet from "~/components/ConnectedWallet";
import opportunityStyles from "~/styles/opportunity.css";

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

  const { connected, address } = useContext(FluidityFacadeContext);
  const navigate = useNavigate();

  const [walletModalVisibility, setWalletModalVisibility] = useState(
    !connected
  );
  const [chainModalVisibility, setChainModalVisibility] = useState(false);
  const [loading, setLoading] = useState(false);
  const [projectedWinnings, setProjectedWinnings] = useState(0);

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
    if (address) {
      (async () => {
        const { data, errors } = await useHighestRewardStatisticsByNetwork(
          network
        );

        console.log(data, errors);

        if (errors || !data) {
          captureException(new Error("Could not fetch historical Rewards"), {
            tags: {
              section: "opportunity",
            },
          });
        }

        const highestRewards =
          data.highest_rewards_monthly.reduce(
            (sum, { winning_amount_scaled }) => sum + winning_amount_scaled,
            0
          ) / data.highest_rewards_monthly.length;
        return setProjectedWinnings(highestRewards);
      })();
    }
  }, [address]);

  useEffect(() => {
    connected && setWalletModalVisibility(false);
  }, [connected]);

  return (
    <>
      {connected && !loading && (
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
                  address={address.toString()}
                  callback={() => {
                    console.log("click");
                  }}
                />
              )}

              {/* Switch Chain Modal */}
              <Modal visible={chainModalVisibility}>
                <BlockchainModal
                  handleModal={setChainModalVisibility}
                  option={chainNameMap[network as "ethereum" | "solana"]}
                  options={Object.values(chainNameMap)}
                  setOption={(chain: string) =>
                    navigate(`/${networkMapper(chain)}`)
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
              {network === `solana` ? (
                <Modal visible={walletModalVisibility}>
                  <div className="cover">
                    <SolanaWalletModal
                      visible={walletModalVisibility}
                      close={() => setWalletModalVisibility(false)}
                    />
                  </div>
                </Modal>
              ) : (
                <Modal visible={walletModalVisibility}>
                  <div className="cover">
                    <SolanaWalletModal
                      visible={walletModalVisibility}
                      close={() => setWalletModalVisibility(false)}
                    />
                  </div>
                </Modal>
              )}
            </div>

            {/* Expected Earnings */}
            {!!projectedWinnings && (
              <>
                <Display
                  className="winnings-figure"
                  size={width < mobileBreakpoint ? "xs" : "md"}
                >
                  {numberToMonetaryString(projectedWinnings)}
                </Display>
                <Text size={width < mobileBreakpoint ? "md" : "xl"}>
                  Would have been your winnings, based on your last 50
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NetworkPage;
