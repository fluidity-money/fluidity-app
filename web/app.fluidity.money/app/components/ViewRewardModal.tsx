import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Text, Card, GeneralButton } from "@fluidity-money/surfing";

interface IPropsConnectedWalletModal {
  visible: boolean;
  close: () => void;
  tokenSymbol: string;
  color: string;
  winAmount: string;
  explorerUri: string;
  balance: string;
  forSending: boolean;
}

export const ViewRewardModal = ({
  visible,
  close,
  tokenSymbol,
  color,
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
              <Text prominent size="xxl" className="view-reward-modal-title">
                Get. That. Money.
              </Text>
              <Text size="md">${winAmount} USD in unclaimed prizes</Text>
              <span
                className="view-reward-modal-token"
                style={{
                  backgroundColor: `${color}`,
                  boxShadow: `0 0 100px 60px blue, 0 0 140px 90px ${color}`,
                }}
              >
                <img
                  src="/assets/tokens/usdc.svg"
                  className="view-reward-modal-token-img"
                />
              </span>
              <Text
                prominent
                size="xl"
                className="view-reward-modal-token-title-size"
              >
                ${winAmount} {tokenSymbol}
              </Text>
              <Text size="xl" className="view-reward-modal-usd-info">
                ${winAmount} USD
              </Text>
              <span className="view-reward-modal-price-desc">
                <Text size="xl">
                  Won for{" "}
                  <a className="view-reward-modal-link">
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
                size={"medium"}
                handleClick={() => {
                  console.log("view breakdown");
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
