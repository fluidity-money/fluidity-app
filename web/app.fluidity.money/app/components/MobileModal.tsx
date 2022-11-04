import {
  useNavigate,
  Link,
} from "@remix-run/react";
import { useState } from "react";
import { trimAddress } from "~/util";
import { useWallet } from "@solana/wallet-adapter-react";
import { motion } from "framer-motion";
import {
  GeneralButton,
  Trophy,
  Text,
  ChainSelectorButton,
  LinkButton,
  Heading,
} from "@fluidity-money/surfing";
import ChainModal from "~/components/ChainModal";
import { SolanaWalletModal } from "~/components/WalletModal/SolanaWalletModal";

type IMobileModal = {
  navigationMap: any;
  activeIndex: number;
  chains: any;
  unclaimedFluid: number;
  network: string;
}

export default function MobileModal({navigationMap, activeIndex, chains, network, unclaimedFluid}: IMobileModal) {
  const navigate = useNavigate();

  const [walletModalVisibility, setWalletModalVisibility] = useState<boolean>(false);

  const [chainModalVisibility, setChainModalVisibility] = useState<boolean>(false);

  const { connected, publicKey } = useWallet();

  if (walletModalVisibility) {
    return (
      network === "solana" ? (
        <SolanaWalletModal
          visible={walletModalVisibility}
          close={() => setWalletModalVisibility(false)}
        />
      ) : null
    )
  };
  
  if (chainModalVisibility) {
    return (
      <ChainModal
        visible={chainModalVisibility}
        setVisible={setChainModalVisibility}
        network={network}
        chains={chains}
      />
    )
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
            ? trimAddress(publicKey?.toString() as unknown as string)
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
          {navigationMap.map((obj: {name: string, icon: JSX.Element}, index: number) => {
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
          })}
        </ul>
      </nav>
    
      { /* Unclaimed Winnings */ }
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

      { /* Fluidify Money */ }
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
          <LinkButton size="small" type="external" handleClick={() => navigate("https://staging.fluidity.money")}>
              Fluidity Money Website
          </LinkButton>
        </footer>
    </div>
  );
}

