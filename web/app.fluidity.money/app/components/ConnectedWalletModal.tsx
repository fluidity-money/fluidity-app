import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Text, Card, GeneralButton } from "@fluidity-money/surfing";
import ConnectedWallet from "./ConnectedWallet";

interface IPropsConnectedWalletModal {
  visible: boolean;
  address: string;
  close: () => void;
  disconnect: () => void;
}

export const ConnectedWalletModal = ({
  visible,
  address,
  close,
  disconnect,
}: IPropsConnectedWalletModal) => {
  const [modal, setModal] = useState<React.ReactPortal | null>(null);
  const [icon, setIcon] = useState<React.ReactNode>(
    <img src="/images/icons/copyIcon.svg" alt="copy" />
  );

  const copyAddress = (address: string) => {
    // Copies to clipboard
    navigator.clipboard.writeText(address);
    setIcon(
      <img height="26" width="26" src="/images/icons/checked.png" alt="copy" />
    );

    setTimeout(() => {
      setIcon(<img src="/images/icons/copyIcon.svg" alt="copy" />);
    }, 500);
  };

  useEffect(() => {
    setModal(
      createPortal(
        <>
          <div
            className={`connected-wallet-modal-container ${
              visible === true ? "show-modal" : "hide-modal"
            }`}
          >
            <Text size="xxl">
              {" "}
              Fluidity:{" "}
              <Text prominent size="md">
                Connected
              </Text>
            </Text>
            <span onClick={close}>
              <img src="/images/icons/x.svg" className="modal-cancel-btn" />
            </span>
            <div className="connected-wallet-modal-body">
              <Card
                className="card-outer address-copy-box"
                component="div"
                rounded={false}
                type={"box"}
              >
                <span
                  className={"address-copy-box"}
                  onClick={() => copyAddress(address)}
                >
                  <ConnectedWallet
                    className="connected-btn-in-modal"
                    address={address}
                    short={false}
                    callback={() => copyAddress(address)}
                  />
                  <span>{icon}</span>
                </span>
              </Card>
              <GeneralButton
                version="transparent"
                buttontype={"icon before"}
                icon={
                  <img
                    src="/images/icons/disconnectIcon.svg"
                    alt="disconnect"
                  />
                }
                size={"medium"}
                handleClick={() => {
                  disconnect();
                }}
                className="disconnect-wallet-btn"
              >
                Disconnect Wallet
              </GeneralButton>
              <Text size="xs" className="legal">
                By connecting a wallet, you agree to Fluidity Money&aposs{" "}
                <a className="link-text">Terms of Service</a> and acknowledge
                that you have read and understand the{" "}
                <a className="link-text">Disclaimer</a>
              </Text>
            </div>
          </div>
        </>,
        document.body
      )
    );
  }, [visible, address, icon]);

  return modal;
};
