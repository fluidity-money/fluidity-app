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
  trimAddressShort,
} from "@fluidity-money/surfing";
import ConnectWalletModal from "~/components/ConnectWalletModal";
import BurgerButton from "./BurgerButton";
import ConnectedWallet from "./ConnectedWallet";
import { ConnectedWalletModal } from "./ConnectedWalletModal";

type IMobileModal = {
  navigationMap: Array<{ name: string; icon: JSX.Element }>;
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
          option={chains[network as "ethereum" | "solana"]}
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
                  navigate("./home");
                }}
              >
                <img src="/images/outlinedLogo.svg" alt="Fluidity" />
              </a>
            </div>

            {/* Navigation Buttons */}
            <div className="mobile-navbar-right">
              {/* Prize Money */}
              <GeneralButton
                version={"transparent"}
                buttontype="icon after"
                size={"small"}
                className="trophy-button"
                handleClick={() => {
                  setTimeout(() => {
                    setIsOpen(false);
                  }, 800);
                  unclaimedRewards
                    ? navigate("./rewards/unclaimed")
                    : navigate("./rewards");
                }}
                icon={<Trophy />}
              >
                ${unclaimedRewards}
              </GeneralButton>

              <BurgerButton isOpen={isOpen} setIsOpen={setIsOpen} />
            </div>
          </nav>

          <div className="mobile-modal-content">
            <section>
              {/* Wallet / Chain */}
              <section>
                {/* Connect Wallet */}
                {connected && address ? (
                  <ConnectedWallet
                    address={trimAddressShort(address.toString())}
                    callback={() => {
                      !connectedWalletModalVisibility &&
                        setconnectedWalletModalVisibility(true);
                      connectedWalletModalVisibility &&
                        setconnectedWalletModalVisibility(false);
                    }}
                    // className="connect-wallet-btn"
                  />
                ) : (
                  <GeneralButton
                    version={
                      connected || connecting ? "transparent" : "primary"
                    }
                    buttontype="text"
                    size={"medium"}
                    handleClick={() =>
                      connecting ? null : setWalletModalVisibility(true)
                    }
                    // className="connect-wallet-btn"
                  >
                    {connecting ? `Connecting...` : `Connect Wallet`}
                  </GeneralButton>
                )}

                {/* Chain Switcher */}
                <ChainSelectorButton
                  chain={chains[network as "ethereum" | "solana"]}
                  onClick={() => setChainModalVisibility(true)}
                />
              </section>

              {/* Navigation between pages */}
              <nav className={"navbar-v2 "}>
                <ul>
                  {navigationMap.map(
                    (
                      obj: { name: string; icon: JSX.Element },
                      index: number
                    ) => {
                      const key = Object.values(obj)[0];
                      const { name, icon } = obj;
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
                            <motion.div
                              className={"active"}
                              layoutId="active"
                            />
                          ) : (
                            <div />
                          )}
                          <Link
                            to={index === 0 ? "./" : (key as unknown as string)}
                          >
                            <Text prominent={active}>
                              {icon} {name}
                            </Text>
                          </Link>
                        </li>
                      );
                    }
                  )}
                </ul>
              </nav>
            </section>
            <section className="mobile-modal-bottom">
              {/* Unclaimed Winnings */}
              <GeneralButton
                version={"secondary"}
                buttontype="icon after"
                size={"small"}
                handleClick={() => {
                  setTimeout(() => {
                    setIsOpen(false);
                  }, 800);
                  unclaimedRewards
                    ? navigate("./rewards/unclaimed")
                    : navigate("./rewards");
                }}
                icon={<img src="/images/icons/arrowRightWhite.svg" />}
                className="unclaimed-button"
              >
                <Text size="lg" prominent={true}>
                  Unclaimed $FLUID{" "}
                  <Heading as="h5" className="no-margin">
                    {unclaimedFluid}
                  </Heading>
                </Text>
              </GeneralButton>

              {/* Fluidify Money */}
              <GeneralButton
                version={"primary"}
                buttontype="text"
                size={"medium"}
                handleClick={() => {
                  setTimeout(() => {
                    setIsOpen(false);
                  }, 800);
                  unclaimedRewards
                    ? navigate("./rewards/unclaimed")
                    : navigate("./rewards");
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
          </div>
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
