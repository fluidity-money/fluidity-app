import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

import { Text, GeneralButton, Heading } from "@fluidity-money/surfing";

interface IPropsConnectedWalletModal {
  visible: boolean;
  close: () => void;
  callback: () => void;
  tokenSymbol: string;
  img: string;
  colour: string;
  winAmount: string;
  explorerUri: string;
  balance: string;
  forSending: boolean;
}

export const ViewRewardModal = ({
  visible,
  close,
  callback,
  tokenSymbol,
  img,
  colour,
  winAmount,
  explorerUri,
  balance,
  forSending,
}: IPropsConnectedWalletModal) => {
  const [modal, setModal] = useState<React.ReactPortal | null>(null);

  useEffect(() => {
    setModal(
      createPortal(
        <>
          <div
            className={`view-reward-modal-container ${
              visible === true ? "show-modal" : "hide-modal"
            }`}
          >
            <span className="view-reward-modal-cancel" onClick={close}>
              <Text
                className="view-reward-modal-close-text-desc"
                prominent
                size="md"
              >
                close
              </Text>
              <img
                src="/images/icons/x.svg"
                className="view-reward-modal-cancel-btn modal-cancel-btn"
              />
            </span>
            <div className="view-reward-main-modal">
              <Heading as="h2" className="view-reward-modal-title">
                Get. That. Money.
              </Heading>
              <Text size="xl">${winAmount} USD in unclaimed prizes</Text>
              <span
                className="view-reward-modal-token"
                style={{
                  backgroundColor: `${colour}`,
                  boxShadow: `0 0 100px 60px ${colour}, 0 0 140px 90px ${colour}`,
                }}
              >
                <img src={img} className="view-reward-modal-token-img" />
              </span>
              <Heading as="h2" className="view-reward-modal-token-title-size">
                ${winAmount} {tokenSymbol}
              </Heading>
              <Text size="xl" className="view-reward-modal-usd-info">
                ${winAmount} USD
              </Text>
              <span className="view-reward-modal-price-desc">
                <Text size="xl">
                  Won for{" "}
                  <a
                    className="view-reward-modal-link"
                    onClick={() => {
                      window.open(explorerUri, `_`);
                    }}
                  >
                    {forSending === true ? "sending" : "receiving"}
                  </a>{" "}
                  fluid assets.
                </Text>
                <br />
                <Text size="xl">
                  {balance} {tokenSymbol} total balance
                </Text>
              </span>
              <GeneralButton
                version={"primary"}
                buttontype="text"
                size={"large"}
                handleClick={() => {
                  callback();
                }}
                className="view-reward-modal-breakdown-btn"
              >
                WINNINGS BREAKDOWN
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
