import type { LinksFunction } from "@remix-run/node";

import { LoaderFunction, redirect } from "@remix-run/node";
import { useEffect, useState } from "react";
import { useNavigate, useLoaderData, Link } from "@remix-run/react";
import { useWallet } from "@solana/wallet-adapter-react";
import config from "~/webapp.config.server";
import useViewport from "~/hooks/useViewport";
import {
  Display,
  GeneralButton,
  LinkButton,
  Text,
  ChainSelectorButton,
  BlockchainModal,
  normaliseAddress,
  trimAddress,
} from "@fluidity-money/surfing";
import Video from "~/components/Video";
import opportunityStyles from "~/styles/opportunity.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: opportunityStyles }];
};

export const loader: LoaderFunction = async ({ params }) => {
  const { network } = params;

  const redirectTarget = redirect("/");

  if (!network || !Object.keys(config.drivers).includes(network)) {
    return redirectTarget;
  }

  return {
    network,
  };
};

type LoaderData = {
  network: string;
};

const NetworkPage = () => {
  const { network } = useLoaderData<LoaderData>();

  const { connected, publicKey, disconnect, connect } = useWallet();
  const navigate = useNavigate();

  const [walletModalVisibility, setWalletModalVisibility] = useState(true);
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

  const networkMapper = (network: string) => {
    switch (network) {
      case "ETH":
        return "ethereum";
      case "SOL":
        return "solana";
      case "ethereum":
        return "ETH";
      default:
        return "SOL";
    }
  };

  useEffect(() => {
    if (publicKey) {
      setProjectedWinnings(100);
    }
  }, [publicKey]);

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
        <div className="header-buttons">
          <a href="https://fluidity.money" rel="noopener noreferrer">
            <LinkButton
              size={"small"}
              type={"internal"}
              handleClick={() => {
                return;
              }}
            >
              {width < mobileBreakpoint ? "WEBSITE " : "FLUIDITY WEBSITE"}
            </LinkButton>
          </a>
          <LinkButton
            size={"small"}
            type={"internal"}
            handleClick={() => {
              navigate("dashboard");
            }}
          >
            {width < mobileBreakpoint ? "APP" : "FLUIDITY APP"}
          </LinkButton>
        </div>
        <div className="connected">
          <div className="connected-content">
            <div className="connected-wallet">
              {/* Switch Chain Button */}
              <ChainSelectorButton
                chain={chainNameMap[network as "ethereum" | "solana"]}
                onClick={() => setChainModalVisibility(true)}
              />
              {/* Connected Wallet */}
              {publicKey && (
                <>
                  <div>{"(icon)"}</div>
                  <Text>
                    {trimAddress(normaliseAddress(publicKey.toString()))}
                  </Text>
                </>
              )}

              {/* Switch Chain Modal */}
              {chainModalVisibility && (
                <BlockchainModal
                  handleModal={setChainModalVisibility}
                  option={{ name: "", icon: <div /> }}
                  options={Object.values(chainNameMap)}
                  setOption={(chain: string) =>
                    navigate(`/${networkMapper(chain)}`)
                  }
                  mobile={width <= mobileBreakpoint}
                />
              )}

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
            </div>

            {/* Expected Earnings */}
            {!!projectedWinnings && (
              <>
                <Display
                  className="winnings-figure"
                  size={width < mobileBreakpoint ? "xs" : "md"}
                >
                  {"{$29,645.00}"}
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
                icon={<img src="/images/socials/twitter.svg" />}
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
