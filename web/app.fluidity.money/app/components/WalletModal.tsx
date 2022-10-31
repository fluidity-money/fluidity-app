import { Heading } from "@fluidity-money/surfing";
import { useParams } from "@remix-run/react";
import { Web3Context } from "contexts/EthereumProvider";
import { useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";

import config from "~/webapp.config.server";

type WalletModalProps = {
  open: boolean;
};

const WalletModal = ({ open }: WalletModalProps) => {
  const {
    dispatch,
    state: { web3, account, provider, qr },
  } = useContext(Web3Context);

  const [modalElement, setModalElement] = useState<HTMLElement>();

  const [selected, setSelected] = useState<string | undefined>();

  const { network } = useParams();

  useEffect(() => {
    const modalRoot = document.body;
    const el = document.createElement("div");

    el.id = "wallet-modal";

    modalRoot.appendChild(el);
    setModalElement(el);

    return () => {
      modalRoot.removeChild(el);
    };
  }, []);

  return (
    <>
      {modalElement &&
        open &&
        createPortal(
          <>
            {account === "" && (
              <div className={"shade center"}>
                <div className="wallet-modal">
                  <div className="wallet-modal--header">
                    <Heading>Connect your wallet</Heading>
                    <span className="chain-selector">
                      <img
                        className="chain-selector--icon"
                        src={`/icons/${network}.svg`}
                        alt={`Blockchain Icon (${network})`}
                      />
                      <span className="chain-selector--name">{network}</span>
                    </span>
                  </div>
                  <div className="wallet-modal--body">
                    {config.config[network ?? ""].wallets?.map((wallet) => (
                      <div
                        className="wallet-modal--body--wallets"
                        key={wallet.id}
                        onClick={() => {
                          dispatch({
                            type: "CONNECT",
                            payload: {
                              driver: wallet.id as never,
                            },
                          });
                        }}
                      >
                        <img src={wallet.logo} alt={wallet.name} />
                        <span>{wallet.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {qr && (
              <div className={"shade center"}>
                <div className="wallet-modal">
                  <div className="wallet-modal--header">
                    <Heading>Scan QR code</Heading>
                    <span className="chain-selector">
                      <img
                        className="chain-selector--icon"
                        src={`/icons/${network}.svg`}
                        alt={`Blockchain Icon (${network})`}
                      />
                      <span className="chain-selector--name">{network}</span>
                    </span>
                  </div>
                  <div className="wallet-modal--body">
                    <img src={qr} alt="QR Code" />
                  </div>
                </div>
              </div>
            )}
          </>,
          modalElement
        )}
    </>
  );
};

export default WalletModal;
