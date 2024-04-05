import { useNavigate, Link } from "@remix-run/react";
import FluidityFacadeContext from "contexts/FluidityFacade";
import { useState, useContext, useEffect } from "react";
import { networkMapper } from "~/util";
import { AnimatePresence, motion } from "framer-motion";
import {
  GeneralButton,
  Text,
  ChainSelectorButton,
  LinkButton,
  Heading,
  BlockchainModal,
  Trophy,
  numberToMonetaryString,
  ConnectedWalletModal,
  ConnectedWallet,
  BurgerMenu,
} from "@fluidity-money/surfing";
import ConnectWalletModal from "~/components/ConnectWalletModal";

type IMobileModal = {
  navigationMap: Array<{
    name: string;
    path: (network: string) => string;
    icon: JSX.Element;
  }>;
  nonNavigationEntries?: Array<React.DetailedHTMLProps<React.LiHTMLAttributes<HTMLElement>, HTMLElement>>;
  activeIndex: number;
  chains: Record<string, { name: string; icon: JSX.Element }>;
  unclaimedFluid: number;
  network: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  unclaimedRewards: number;
};

export default function MobileModal({
  navigationMap,
  nonNavigationEntries,
  activeIndex,
  chains,
  network,
  unclaimedFluid,
  isOpen,
  setIsOpen,
  unclaimedRewards,
}: IMobileModal) {
  const navigate = useNavigate();

  const [walletModalVisibility, setWalletModalVisibility] =
    useState<boolean>(false);

  const [chainModalVisibility, setChainModalVisibility] =
    useState<boolean>(false);

  const [connectedWalletModalVisibility, setconnectedWalletModalVisibility] =
    useState<boolean>(false);

  const { connected, address, rawAddress, connecting, disconnect } = useContext(
    FluidityFacadeContext
  );

  const [animation, setAnimation] = useState(true);

  useEffect(() => {
    // turns off animation when chain select modal is used and activates it when it isn't
    if (isOpen) setAnimation(false);
    if (!isOpen) setAnimation(true);
  }, [isOpen]);

  useEffect(() => {
    walletModalVisibility
      ? (document.body.style.position = "static")
      : setTimeout(() => (document.body.style.position = "fixed"), 1000);
  }, [walletModalVisibility]);

  useEffect(() => {
    // stop modal pop-up if connected
    connected && setWalletModalVisibility(false);
  }, [connected]);

  if (walletModalVisibility) {
    return (
      <ConnectWalletModal
        visible={walletModalVisibility}
        close={() => setWalletModalVisibility(false)}
      />
    );
  }

  if (chainModalVisibility) {
    const handleSetChain = (network: string) => {
      const { pathname } = location;

      // Get path components after $network
      const pathComponents = pathname.split("/").slice(2);

      navigate(`/${networkMapper(network)}/${pathComponents.join("/")}`);
    };

    // select blockchain modal
    return (
      <div className="select-blockchain-mobile">
        <BlockchainModal
          handleModal={setChainModalVisibility}
          option={chains[network]}
          options={Object.values(chains)}
          setOption={handleSetChain}
          mobile={true}
        />
      </div>
    );
  }

  return (
    <AnimatePresence initial={animation ? true : false}>
      {isOpen && (
        <motion.div
          key="modal"
          initial={{ opacity: 0, x: "75%" }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, type: "tween" }}
          exit={{ opacity: 0, x: "75%" }}
          className={`mobile-modal-container  ${
            isOpen === true ? "show-modal" : "hide-modal"
          }`}
        >
          {/* Navigation at top of modal */}
          <nav id="mobile-top-navbar" className={"pad-main"}>
            {/* Logo */}
            <div className="top-navbar-left">
              <a
                onClick={() => {
                  setTimeout(() => {
                    setIsOpen(false);
                  }, 800);
                  navigate(`/${network}/dashboard/home`);
                }}
              >
                <img
                  style={{ width: "5.5em", height: "2.5em" }}
                  src="https://app-cdn.fluidity.money/images/outlinedLogo.svg"
                  alt="Fluidity"
                />
              </a>
            </div>

            {/* Navigation Buttons */}
            <div className="mobile-navbar-right">
              {/* Chain Switcher */}
              <ChainSelectorButton
                chain={chains[network]}
                onClick={() => setChainModalVisibility(true)}
              />
              {/* Prize Money */}
              <GeneralButton
                type={"transparent"}
                layout="after"
                size={"small"}
                handleClick={() => {
                  setTimeout(() => {
                    setIsOpen(false);
                  }, 800);
                  unclaimedRewards
                    ? navigate(`/${network}/dashboard/rewards/unclaimed`)
                    : navigate(`/${network}/dashboard/rewards`);
                }}
                icon={<Trophy />}
              >
                {numberToMonetaryString(unclaimedRewards)}
              </GeneralButton>

              <BurgerMenu isOpen={isOpen} setIsOpen={setIsOpen} />
            </div>
          </nav>

          {/* Wallet / Chain */}
          <section className="mobile-modal-chain pad-main">
            {/* Connect Wallet */}
            {connected && address ? (
              <ConnectedWallet
                address={rawAddress ?? ""}
                callback={() => {
                  !connectedWalletModalVisibility &&
                    setconnectedWalletModalVisibility(true);
                  connectedWalletModalVisibility &&
                    setconnectedWalletModalVisibility(false);
                }}
              />
            ) : (
              <GeneralButton
                type={connected || connecting ? "transparent" : "primary"}
                size={"medium"}
                handleClick={() =>
                  connecting ? null : setWalletModalVisibility(true)
                }
              >
                {connecting ? `Connecting...` : `Connect Wallet`}
              </GeneralButton>
            )}

            {/* Chain Switcher */}
            <ChainSelectorButton
              chain={chains[network]}
              onClick={() => setChainModalVisibility(true)}
            />
          </section>

          {/* Navigation between pages */}
          <ul className="sidebar-nav">
            <>
            {navigationMap
              .map((obj, index) => {
                const key = Object.values(obj)[0];
                const { name, icon, path } = obj;
                const active = index === activeIndex;

                return (
                  <li
                    key={key as unknown as string}
                    onClick={() => {
                      //delay to show page change and allow loading
                      setTimeout(() => {
                        setIsOpen(false);
                      }, 800);
                    }}
                  >
                    {index === activeIndex ? (
                      <motion.div className={"active"} layoutId="active" />
                    ) : (
                      <div />
                    )}
                    <Link to={path(network)}>
                      <Text
                        prominent={active}
                        className="mobile-modal-text-link"
                      >
                        {icon} {name}
                      </Text>
                    </Link>
                  </li>
                );
              })}
              {...(nonNavigationEntries || [])}
              </>
          </ul>

          {/* Navigation at bottom of modal */}
          <section className="mobile-modal-bottom">
            {/* Unclaimed Winnings */}
            <GeneralButton
              type={"secondary"}
              layout="after"
              size={"small"}
              handleClick={() => {
                setTimeout(() => {
                  setIsOpen(false);
                }, 800);
                unclaimedRewards
                  ? navigate(`/${network}/dashboard/rewards/unclaimed`)
                  : navigate(`/${network}/dashboard/rewards`);
              }}
              icon={<img src="https://app-cdn.fluidity.money/images/icons/arrowRightWhite.svg" />}
              className="unclaimed-button"
            >
              <Text size="lg" prominent={true}>
                Unclaimed $FLUID{" "}
                <Heading as="h5" className="no-margin">
                  {numberToMonetaryString(unclaimedFluid)}
                </Heading>
              </Text>
            </GeneralButton>

            {/* Fluidify Money */}
            <GeneralButton
              type={"primary"}
              size={"medium"}
              handleClick={() => {
                setTimeout(() => {
                  setIsOpen(false);
                }, 800);
                navigate(`/${network}/fluidify`);
              }}
              className="fluidify-money-button"
            >
              Fluidify Money
            </GeneralButton>
            <footer>
              {/* Fluidity Website */}
              <a href="https://fluidity.money" rel="noopener noreferrer">
                <LinkButton
                  size="medium"
                  type="external"
                  handleClick={() => {
                    return;
                  }}
                >
                  Fluidity Money Website
                </LinkButton>
              </a>
            </footer>
          </section>
          {connectedWalletModalVisibility && (
            <ConnectedWalletModal
              visible={connectedWalletModalVisibility}
              address={rawAddress ?? ""}
              close={() => {
                setconnectedWalletModalVisibility(false);
              }}
              disconnect={() => {
                disconnect?.();
                setconnectedWalletModalVisibility(false);
              }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
