import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

import {
  Text,
  GeneralButton,
  Heading,
  LinkButton,
} from "@fluidity-money/surfing";
import BloomEffect from "./BloomEffect";
import useViewport from "~/hooks/useViewport";

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
  const { width } = useViewport();
  const isMobile = width < 500;

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
              <LinkButton
                handleClick={() => close()}
                size={isMobile ? "medium" : "large"}
                type="internal"
                left={true}
                className="close-btn"
              >
                Close
              </LinkButton>
            </span>
            <div className="view-reward-main-modal">
              <Heading
                as={isMobile ? "h6" : "h3"}
                className="view-reward-modal-title"
              >
                Get. That. Money.
              </Heading>
              <Text size="md">${winAmount} USD in unclaimed prizes</Text>
              <div className="view-reward-image-content">
                <img
                  src={img}
                  style={{
                    aspectRatio: "1 / 1",
                    height: "50%",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                />
                <BloomEffect
                  blendMode="lighten"
                  type={"static"}
                  color={colour ?? "#fff"}
                />
              </div>
              <Heading as="h3" className="view-reward-modal-token-title-size">
                ${winAmount} {tokenSymbol}
              </Heading>
              <Text size="md" className="view-reward-modal-usd-info">
                {`(${winAmount} USD)`}
              </Text>
              <span className="view-reward-modal-price-desc">
                <Text size="md">
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
                <Text size="md">
                  {balance} {tokenSymbol} total balance
                </Text>
              </span>
              <GeneralButton
                version={"primary"}
                buttontype="text"
                size={"medium"}
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
