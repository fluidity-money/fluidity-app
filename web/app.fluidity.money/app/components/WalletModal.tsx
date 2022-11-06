import { Heading } from "@fluidity-money/surfing";
import { useLoaderData, useParams } from "@remix-run/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Web3Context } from "~/util/chainUtils/web3";

import config from "~/webapp.config.server";

type WalletModalProps = {
  open: boolean;
};

type LoaderData = {
  wallets: typeof config.config[string]["wallets"];
};

const WalletModal = ({ open }: WalletModalProps) => {

  const { network } = useParams();
  
  const {
    dispatch,
    state: { web3, account, provider, qr },
  } = useContext(Web3Context());

  const { select } = useWallet()

  let wallets :any = null;
  switch(network) {
    case `ethereum`:
      wallets = useLoaderData<LoaderData>();
      break;
    case `solana`:
      wallets = useWallet()
      break;
    default:
      throw 'invalid chain network selected';
  }
  
  const [modalElement, setModalElement] = useState<HTMLElement>();

  const [selected, setSelected] = useState<string | undefined>();

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
                    {wallets?.map((wallet: any, index: number) => {
                      
                      let typeKey :number = index;
                      let walletName :string = ``;
                      let walletIcon: string = ``;

                      if(network === `ethereum`) {
                        typeKey = wallet.id;
                        walletName = wallet.name;
                        walletIcon = wallet.logo;
                      }else if( network === `solana`) {
                        typeKey = index;
                        walletName = wallet?.adapter.name;
                        walletIcon = wallet?.adapter.icon;    
                      }else {
                        throw 'invalid chain network selected';
                      }
                      
                      return (
                        <div
                          className="wallet-modal--body--wallets"
                          key={typeKey}
                          onClick={() => {
                            switch(network) {
                             case `ethereum`:
                              dispatch({
                                type: "CONNECT",
                                payload: {
                                  driver: wallet.id as never,
                                },
                              })
                              break;
                             case `solana`:
                              select(wallet?.adapter.name)
                              break;
                             default:
                              throw 'invalid chain network selected';
                            }
                          }}
                        >
                          <img src={walletIcon} alt={walletName} />
                          <span>{walletName}</span>
                        </div>
                      )  
                    })}
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
