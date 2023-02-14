import type { Chain } from "~/util/chainUtils/chains";

import Modal from "./Modal";
import BN from "bn.js";
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
  stringifiedNumberToMonetaryString,
  Video,
} from "@fluidity-money/surfing";
import BloomEffect from "~/components/BloomEffect";
import {
  addDecimalToBn,
  getUsdFromTokenAmount,
} from "~/util/chainUtils/tokens";

interface ISwapCompleteModalProps {
  visible: boolean;
  confirmed: boolean;
  close: () => void;
  colorMap: ColorMap[string];
  assetToken: AugmentedToken;
  tokenPair: AugmentedToken;
  amount: string;
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
  const { balance, addToken } = useContext(FluidityFacadeContext);

  const [walletBalance, setWalletBalance] = useState<BN | undefined>();

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

  // Set Timeout in case Video does not load
  useEffect(() => {
    setTimeout(() => setPlayVideo(false), 15 * 1000);
  }, []);

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
                  {amount} {tokenPair.symbol} (
                  {stringifiedNumberToMonetaryString(amount, 2)}) created and
                  added to your wallet.
                </Heading>
                <Text>
                  {addDecimalToBn(
                    walletBalance || new BN(0),
                    assetToken.decimals
                  )}{" "}
                  {assetToken.symbol} (
                  {numberToMonetaryString(
                    getUsdFromTokenAmount(
                      walletBalance || new BN(0),
                      assetToken
                    )
                  )}
                  ) remaining in wallet..
                </Text>
              </>
            )}

            {/* Transaction errored */}
            {confirmed && error && (
              <Heading as="h5">Something went wrong during the swap..</Heading>
            )}

            {/* Unconfirmed transaction */}
            {!confirmed && (
              <>
                <Heading as="h5">
                  {amount} {tokenPair.symbol} ($
                  {stringifiedNumberToMonetaryString(amount, 2)}) swapping and
                  awaiting confirmation...
                </Heading>
                <Text>We&apos;ll notify you when it&apos;s done!</Text>
              </>
            )}

            {/* Add Token */}
            <LinkButton
              type="internal"
              size="medium"
              handleClick={() => addToken?.(tokenPair.symbol)}
            >
              Add Token To Wallet
            </LinkButton>

            {/* Dashboard Button */}
            <Link to={`/${network}/dashboard/home`}>
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

            {/* Fluidify Button */}
            <LinkButton
              type="internal"
              size="medium"
              handleClick={() => close()}
            >
              FLUIDIFY MORE ASSETS
            </LinkButton>

            {/* View Transaction Button */}
            <a
              href={getTxExplorerLink(network as Chain, txHash)}
              rel="noopener noreferrer"
              target="_blank"
            >
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
