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

  const copyAddress = (address: string) => {
    // Copies to clipboard
    navigator.clipboard.writeText(address);
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
            <Text prominent size="xxl">
              Connected
            </Text>
            <span onClick={close}>
              <img
                src="/images/icons/x.svg"
                className="solana-modal-cancel-btn"
              />
            </span>
            <div className="connected-wallet-modal-body">
              <Card
                className="card-outer address-copy-box"
                component="div"
                rounded={false}
                type={"box"}
              >
                <button
                  className={"address-copy-box"}
                  onClick={() => copyAddress(address)}
                >
                  <ConnectedWallet
                    address={address}
                    short={false}
                    callback={() => copyAddress(address)}
                  />
                  <span>📋</span>
                </button>
              </Card>
              <GeneralButton
                version="transparent"
                buttontype="text"
                size={"medium"}
                handleClick={() => {
                  disconnect();
                }}
                className="disconnect-wallet-btn"
              >
                Disconnect Wallet
              </GeneralButton>
              <h5>
                By connecting a wallet, you agree to Fluidity Money&aposs{" "}
                <a>Terms of Service</a> and acknowledge that you have read and
                understand the <a>Disclaimer</a>
              </h5>
            </div>
          </div>
        </>,
        document.body
      )
    );
  }, [visible, address]);

  return modal;
};
