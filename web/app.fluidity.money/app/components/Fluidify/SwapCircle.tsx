import { motion, AnimatePresence } from "framer-motion";
import { Video, BloomEffect } from "@fluidity-money/surfing";
import FluidityHotSpot from "~/components/Fluidify/FluidifyHotSpot";
import AugmentedToken from "~/types/AugmentedToken";
import { ColorMap } from "~/webapp.config.server";

interface ISwapCircleProps {
  swapping: boolean;
  setSwapping: React.Dispatch<React.SetStateAction<boolean>>;
  assetToken?: AugmentedToken;
  setAssetToken: React.Dispatch<
    React.SetStateAction<AugmentedToken | undefined>
  >;
  colorMap: ColorMap[string];
}

const SwapCircle = ({
  swapping,
  setSwapping,
  assetToken,
  setAssetToken,
  colorMap,
}: ISwapCircleProps) => {
  return (
    <div
      style={{ position: "relative", aspectRatio: "1 / 1", width: "inherit" }}
    >
      {assetToken !== undefined && (
        <>
          <BloomEffect
            type={swapping ? "pulsing" : "static"}
            color={colorMap[assetToken.symbol] ?? "#fff"}
          />
          <img
            src={assetToken?.logo}
            style={{
              aspectRatio: "1 / 1",
              height: "10%",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        </>
      )}
      {swapping && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            exit={{ opacity: 0 }}
            className="video-container"
          >
            <Video
              className="swapping-video"
              src={"/videos/LoadingOther.webm"}
              loop={false}
              type="none"
              onEnded={() => {
                setSwapping(false);
              }}
              playbackRate={1.5}
            />
          </motion.div>
        </AnimatePresence>
      )}
      {!swapping && (
        <FluidityHotSpot activeToken={assetToken} callBack={setAssetToken} />
      )}
    </div>
  );
};

export default SwapCircle;
