import { useNavigate, Link } from "@remix-run/react";
import FluidityFacadeContext from "contexts/FluidityFacade";
import { useState, useContext } from "react";
import { trimAddress, networkMapper } from "~/util";
import { motion } from "framer-motion";
import {
  GeneralButton,
  Text,
  ChainSelectorButton,
  LinkButton,
  Heading,
  BlockchainModal,
} from "@fluidity-money/surfing";
import { SolanaWalletModal } from "~/components/WalletModal/SolanaWalletModal";

type IMobileModal = {
  navigationMap: Array<{ name: string; icon: JSX.Element }>;
  activeIndex: number;
  chains: Record<string, { name: string; icon: JSX.Element }>;
  unclaimedFluid: number;
  network: string;
};

export default function MobileModal({
  navigationMap,
  activeIndex,
  chains,
  network,
  unclaimedFluid,
}: IMobileModal) {
  const navigate = useNavigate();

  const [walletModalVisibility, setWalletModalVisibility] =
    useState<boolean>(false);

  const [chainModalVisibility, setChainModalVisibility] =
    useState<boolean>(false);

  const { connected, address } = useContext(FluidityFacadeContext);

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

  return (
    <div>
      {/* Wallet / Chain */}
      <section>
        {/* Connect Wallet */}
        <GeneralButton
          version={connected ? "transparent" : "primary"}
          buttontype="text"
          size={"medium"}
          handleClick={() => !connected && setWalletModalVisibility(true)}
          className="connect-wallet-btn"
        >
          {connected
            ? trimAddress(address?.toString() as unknown as string)
            : `Connnect Wallet`}
        </GeneralButton>

        {/* Chain Switcher */}
        <ChainSelectorButton
          chain={chains[network as "ethereum" | "solana"]}
          onClick={() => setChainModalVisibility(true)}
        />
      </section>

      {/* Mobile Navbar */}
      <nav id="dashboard-navbar" className={"navbar-v2"}>
        <ul>
          {navigationMap.map(
            (obj: { name: string; icon: JSX.Element }, index: number) => {
              const key = Object.keys(obj)[0];
              const { name, icon } = Object.values(obj)[0];
              const active = index === activeIndex;

              return (
                <li key={key}>
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
      >
        Unclaimed $FLUID <Heading>${unclaimedFluid}</Heading>
      </GeneralButton>

      {/* Fluidify Money */}
      <GeneralButton
        version={"primary"}
        buttontype="text"
        size={"small"}
        handleClick={() => navigate("../fluidify")}
      >
        Fluidify Money
      </GeneralButton>

      <footer>
        {/* Fluidity Website */}
        <LinkButton
          size="small"
          type="external"
          handleClick={() => navigate("https://staging.fluidity.money")}
        >
          Fluidity Money Website
        </LinkButton>
      </footer>
    </div>
  );
}
