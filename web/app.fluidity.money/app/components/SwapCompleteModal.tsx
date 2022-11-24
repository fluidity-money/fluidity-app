import type { Chain } from "~/util/chainUtils/chains";

import Modal from "./Modal";
import { ColorMap } from "~/webapp.config.server";
import AugmentedToken from "~/types/AugmentedToken";
import { motion, AnimatePresence } from "framer-motion";
import { useContext, useState, useEffect } from "react";
import { Link } from "@remix-run/react";
import FluidityFacadeContext from "contexts/FluidityFacade";
import { getTxExplorerLink } from "~/util";
import {
  GeneralButton,
  LinkButton,
  Heading,
  Text,
  numberToMonetaryString,
} from "@fluidity-money/surfing";
import BloomEffect from "~/components/BloomEffect";
import Video from "~/components/Video";

interface ISwapCompleteModalProps {
  visible: boolean;
  confirmed: boolean;
  close: () => void;
  colorMap: ColorMap[string];
  assetToken: AugmentedToken;
  tokenPair: AugmentedToken;
  amount: number;
  network: string;
  txHash: string;
  error: boolean;
}

const SwapCompleteModal = ({
  visible,
  confirmed,
  close,
  amount,
  colorMap,
  assetToken,
  tokenPair,
  network,
  txHash,
  error,
}: ISwapCompleteModalProps) => {
  const { balance } = useContext(FluidityFacadeContext);

  const [walletBalance, setWalletBalance] = useState<number | undefined>();

  const [playVideo, setPlayVideo] = useState(true);

  useEffect(() => {
    if (network === "ethereum") {
      balance?.(assetToken.address).then(setWalletBalance);
    }
  }, [confirmed]);

  const variants = {
    visible: { opacity: 1, transition: { duration: 1.5 } },
    hidden: { opacity: 0 },
  };

  return (
    <Modal visible={visible}>
      <div className="swap-complete-container">
        <div>
          <LinkButton
            handleClick={() => close()}
            size="large"
            type="internal"
            left={true}
            className="cancel-btn"
          >
            Close
          </LinkButton>
        </div>
        <motion.div
          variants={variants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="swap-complete-modal-top"
        >
          <BloomEffect
            type={"static"}
            color={colorMap[tokenPair.symbol] ?? "#fff"}
          />
          <motion.img
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            src={tokenPair?.logo}
            style={{
              aspectRatio: "1 / 1",
              height: "20%",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />

          {
            <AnimatePresence>
              <motion.div
                variants={variants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="video-container"
              >
                <Video
                  className="swapping-video"
                  src={"/videos/LoadingOther.webm"}
                  loop={false}
                  type="none"
                  onEnded={() => {
                    setPlayVideo(false);
                  }}
                  playbackRate={1.5}
                />
              </motion.div>
            </AnimatePresence>
          }
        </motion.div>

        {!playVideo && (
          <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="swap-complete-modal-content"
          >
            {/* Transaction confirmed */}
            {confirmed && !error && (
              <>
                <Heading as="h5">
                  {amount} {tokenPair.symbol} ({numberToMonetaryString(amount)})
                  created and added to your wallet.
                </Heading>
                <Text>
                  {walletBalance} {assetToken.symbol} (
                  {numberToMonetaryString(walletBalance || 0)}) remaining in
                  wallet..
                </Text>
                <Link to="../../dashboard/home">
                  <GeneralButton
                    buttontype="text"
                    size="medium"
                    version="primary"
                    handleClick={() => {
                      return;
                    }}
                  >
                    GO TO DASHBOARD
                  </GeneralButton>
                </Link>
                <LinkButton
                  type="internal"
                  size="medium"
                  handleClick={() => close()}
                >
                  FLUIDIFY MORE ASSETS
                </LinkButton>
              </>
            )}

            {/* Transaction errored */}
            {confirmed && error && (
              <>
                <Heading as="h5">
                  Something went wrong during the swap..
                </Heading>
                <Link to="../../dashboard/home">
                  <GeneralButton
                    buttontype="text"
                    size="medium"
                    version="primary"
                    handleClick={() => {
                      return;
                    }}
                  >
                    GO TO DASHBOARD
                  </GeneralButton>
                </Link>
                <Link to="..">
                  <LinkButton
                    type="internal"
                    size="medium"
                    handleClick={() => close()}
                  >
                    FLUIDIFY MORE ASSETS
                  </LinkButton>
                </Link>
              </>
            )}

            {/* Unconfirmed transaction */}
            {!confirmed && (
              <>
                <Heading as="h5">
                  {amount} {tokenPair.symbol} ({numberToMonetaryString(amount)})
                  swapping and awaiting confirmation...
                </Heading>
                <Text>We&apos;ll notify you when it&apos;s done!</Text>
                <Link to="../../dashboard/home">
                  <GeneralButton
                    buttontype="text"
                    size="medium"
                    version="primary"
                    handleClick={() => {
                      return;
                    }}
                  >
                    GO TO DASHBOARD
                  </GeneralButton>
                </Link>
                <Link to="..">
                  <LinkButton
                    type="internal"
                    size="medium"
                    handleClick={() => {
                      return;
                    }}
                  >
                    FLUIDIFY MORE ASSETS
                  </LinkButton>
                </Link>
              </>
            )}
            <a href={getTxExplorerLink(network as Chain, txHash)}>
              <LinkButton
                type="internal"
                size="medium"
                handleClick={() => {
                  return;
                }}
              >
                VIEW TRANSACTION
              </LinkButton>
            </a>
          </motion.div>
        )}
      </div>
    </Modal>
  );
};

export default SwapCompleteModal;
