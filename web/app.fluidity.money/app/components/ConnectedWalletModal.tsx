import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Text, Card, Heading, GeneralButton } from "@fluidity-money/surfing";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";

interface IPropsConnectedWalletModal {
  visible: boolean;
  close: () => void;
}

export const ConnectedWalletModal = ({
  visible,
  close,
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
									   <Jazzicon diameter={36} seed={jsNumberForAddress("0x737B7865f84bDc86B5c8ca718a5B7a6d905776F6")} />
									  </div>
										 <Text prominent size="xl" className="address-text">0x737B79999...865f86</Text>
									</div>
									<span className="address-copy-btn">📋</span>
								</div>
							</Card>
								<GeneralButton
									version= "transparent"
									buttontype="text"
									size={"medium"}
									handleClick={() => {}}
									className="disconnect-wallet-btn"
								>
									<Text prominent size="xxl">
										Disconnect Wallet
									</Text>
								</GeneralButton>
						</div>
          </div>
        </>,
        document.body
      )
    );
  }, [visible]);

  return modal;
};
