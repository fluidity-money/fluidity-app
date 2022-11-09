import { useNavigate, Link } from "@remix-run/react";
import { useEffect, useState } from "react";
import { trimAddress, networkMapper } from "~/util";
import { useWallet } from "@solana/wallet-adapter-react";
import { motion } from "framer-motion";
import {
  GeneralButton,
  Text,
  ChainSelectorButton,
  LinkButton,
  Heading,
  BlockchainModal,
  Trophy,
} from "@fluidity-money/surfing";
import { SolanaWalletModal } from "~/components/WalletModal/SolanaWalletModal";
import { createPortal } from "react-dom";
import BurgerButton from "./BurgerButton";

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

  const [modal, setModal] = useState<any>();

  const { connected, publicKey } = useWallet();

  if (walletModalVisibility) {
    return network === "solana" ? (
      <SolanaWalletModal
        visible={walletModalVisibility}
        close={() => setWalletModalVisibility(false)}
      />
    ) : (
      <></>
    );
  }

  if (chainModalVisibility) {
    const handleSetChain = (network: string) => {
      const { pathname } = location;

      // Get path components after $network
      const pathComponents = pathname.split("/").slice(2);

      navigate(`/${networkMapper(network)}/${pathComponents.join("/")}`);
    };

    return (
      <div className="cover">
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

  useEffect(() => {
    setModal(
      createPortal(
        <div
          className={`mobile-modal-container  ${
            isOpen === true ? "show-modal" : "hide-modal"
          }`}
        >
          {/* Navigation at top of modal */}
          <nav id="mobile-top-navbar" className={"pad-main"}>
            {/* Logo */}
            <div className="top-navbar-left">
              <img src="/images/outlinedLogo.svg" alt="Fluidity" />
            </div>

            {/* Navigation Buttons */}
            <div className="mobile-navbar-right">
              {/* Prize Money */}
              <GeneralButton
                version={"transparent"}
                buttontype="icon after"
                size={"small"}
                handleClick={() =>
                  unclaimedRewards
                    ? navigate("./rewards/unclaimed")
                    : navigate("./rewards")
                }
                icon={<Trophy />}
              >
                ${unclaimedRewards}
              </GeneralButton>

              <BurgerButton isOpen={isOpen} setIsOpen={setIsOpen} />
            </div>
          </nav>

          <div className="mobile-modal-content">
            {/* Wallet / Chain */}
            <section>
              {/* Connect Wallet */}
              <GeneralButton
                version={connected ? "transparent" : "primary"}
                buttontype="text"
                size={"medium"}
                handleClick={() => !connected && setWalletModalVisibility(true)}
                // className="connect-wallet-btn"
              >
                {connected
                  ? trimAddress(publicKey?.toString() as unknown as string)
                  : `Connnect Wallet`}
              </GeneralButton>

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
                  (obj: { name: string; icon: JSX.Element }, index: number) => {
                    const key = Object.keys(obj)[0];
                    const { name, icon } = Object.values(obj)[0];
                    const active = index === activeIndex;

                    return (
                      <li
                        key={key}
                        onClick={() => {
                          setIsOpen(false);
                        }}
                      >
                        {index === activeIndex ? (
                          <motion.div className={"active"} layoutId="active" />
                        ) : (
                          <div />
                        )}
                        <Link to={key}>
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

            <section className="mobile-modal-bottom">
              {/* Unclaimed Winnings */}
              <GeneralButton
                version={"secondary"}
                buttontype="icon after"
                size={"small"}
                handleClick={() =>
                  unclaimedFluid
                    ? navigate("./rewards/unclaimed")
                    : navigate("./rewards")
                }
                icon={<img src="/images/icons/arrowRightWhite.svg" />}
                className="unclaimed-button"
              >
                <Text size="lg" prominent={true}>
                  Unclaimed $FLUID{" "}
                  <Heading as="h4" className="no-margin">
                    $6,475.00
                    {/* {unclaimedFluid} dummy data above for styling */}
                  </Heading>
                </Text>
              </GeneralButton>

              {/* Fluidify Money */}
              <GeneralButton
                version={"primary"}
                buttontype="text"
                size={"medium"}
                handleClick={() => navigate("../fluidify")}
                className="fluidify-money-button"
              >
                Fluidify Money
              </GeneralButton>
              <footer>
                {/* Fluidity Website */}
                <LinkButton
                  size="medium"
                  type="external"
                  handleClick={() => navigate("https://staging.fluidity.money")}
                >
                  Fluidity Money Website
                </LinkButton>
              </footer>
            </section>
          </div>
        </div>,
        document.body
      )
    ),
      [isOpen];
  });

  return modal;
}
