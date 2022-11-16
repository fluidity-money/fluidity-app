import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Text, Card, GeneralButton } from "@fluidity-money/surfing";

interface IPropsConnectedWalletModal {
  visible: boolean;
  close: () => void;
}

export const ViewRewardModal = ({
  visible,
  close,
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
              <Text size="md">$23.536 USD in unclaimed prizes</Text>
              <span
                className="view-reward-modal-token"
                style={{
                  backgroundColor: `blue`,
                  boxShadow: `0 0 100px 60px blue, 0 0 140px 90px blue`,
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
                $23.30343 fUSDC
              </Text>
              <Text
                size="xl"
                className="view-reward-modal-usd-info"
              >{`($23.3 USD)`}</Text>
              <span className="view-reward-modal-price-desc">
                <Text size="xl">
                  Won for <a className="view-reward-modal-link">sending</a>{" "}
                  fluid assets.
                </Text>
                <br />
                <Text size="xl">{`153.54`} fUSDC total balance</Text>
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
