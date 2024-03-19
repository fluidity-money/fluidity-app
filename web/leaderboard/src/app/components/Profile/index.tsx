import { useState, useEffect } from "react";
import Image from "next/image";
import { useAccount, useDisconnect } from "wagmi";

import { GeneralButton } from "@fluidity-money/surfing";

import { Card } from "../Card";
import { ConnectedWallet } from "../ConnectWallet";
import ModalWindow from "../Modal/index";

import { Wallets } from "./Wallets/wallets";
import styles from "./Profile.module.scss";

enum IconState {
  Circle = "circle",
  Checked = "checked",
}

export const Profile = () => {
  const { address, isConnected, isConnecting } = useAccount();
  const userAddress = String(address);
  const { disconnect } = useDisconnect();

  const [connectedWalletModalVisibility, setConnectedWalletModalVisibility] =
    useState(false);
  const [walletModalVisibility, setWalletModalVisibility] = useState(false);

  const [icon, setIcon] = useState<IconState>(IconState.Circle);

  const renderIcon = () => {
    switch (icon) {
      case IconState.Circle:
        return (
          <Image height="32" width="32" src="/copyIconCircle.svg" alt="copy" />
        );
      case IconState.Checked:
        return <Image height="32" width="32" src="/checked.svg" alt="copy" />;
        break;
      default:
        return null;
    }
  };

  const copyAddress = (address: string) => {
    // Copies to clipboard
    navigator.clipboard.writeText(address);
    setIcon(IconState.Checked);

    setTimeout(() => {
      setIcon(IconState.Circle);
    }, 1000);
  };

  useEffect(() => {
    isConnected && setWalletModalVisibility(false);
  }, [isConnected]);

  return (
    <div>
      {isConnected ? (
        <ConnectedWallet
          address={String(address)}
          callback={() =>
            setConnectedWalletModalVisibility(!connectedWalletModalVisibility)
          }
        />
      ) : (
        <GeneralButton
          data-cy="connect-wallet-btn"
          type={isConnected || isConnecting ? "transparent" : "primary"}
          size={"medium"}
          onClick={() => setWalletModalVisibility(true)}
          className={styles.connected_wallet}
        >
          Connect Wallet
        </GeneralButton>
      )}

      <ModalWindow
        title="Fluidity: Connected"
        isOpen={connectedWalletModalVisibility}
        close={() => setConnectedWalletModalVisibility(false)}
      >
        <Card
          className={styles["address-copy-box"]}
          type={"transparent"}
          border="solid"
          color="holo"
          rounded
        >
          <span
            className={styles["address-copy-box"]}
            title={"Copy Wallet Address"}
            onClick={() => copyAddress(userAddress)}
          >
            <ConnectedWallet
              className={styles["connected-btn-in-modal"]}
              address={userAddress}
              callback={() => copyAddress(userAddress)}
              short={false}
            />
            <span>{renderIcon()}</span>
          </span>
        </Card>

        <GeneralButton
          title={"Disconnect Wallet"}
          type="transparent"
          layout={"before"}
          icon={
            <Image
              src="/disconnectIcon.svg"
              alt="disconnect"
              width={16}
              height={16}
            />
          }
          size={"medium"}
          handleClick={() => {
            disconnect();
            setConnectedWalletModalVisibility(false);
          }}
          className={styles["disconnect-wallet-btn-in-modal"]}
        >
          Disconnect Wallet
        </GeneralButton>
      </ModalWindow>

      <ModalWindow
        title="Connect your wallet"
        isOpen={walletModalVisibility}
        close={() => setWalletModalVisibility(false)}
      >
        <Wallets />
      </ModalWindow>
    </div>
  );
};
