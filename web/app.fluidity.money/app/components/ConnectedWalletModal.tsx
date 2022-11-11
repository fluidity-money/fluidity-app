import { useState, useEffect, useContext } from "react";
import { createPortal } from "react-dom";
import { Text, Card, Heading, GeneralButton } from "@fluidity-money/surfing";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import { trimAddress } from "~/util";

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
  const [modal, setModal] = useState<any>();

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
                <div className="address-copy-box">
                  <div>
                    <div className="holo">
                      <Jazzicon
                        diameter={36}
                        seed={jsNumberForAddress(address)}
                      />
                    </div>
                    <Text prominent size="xl" className="address-text">
                      {trimAddress(address)}
                    </Text>
                  </div>
                  <span className="address-copy-btn">📋</span>
                </div>
              </Card>
              <GeneralButton
                version="transparent"
                buttontype="text"
                size={"medium"}
                handleClick={() => {
                  disconnect?.();
                }}
                className="disconnect-wallet-btn"
              >
                <Text prominent size="xxl">
                  Disconnect Wallet
                </Text>
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
