import { motion, AnimatePresence } from "framer-motion";
import Video from "~/components/Video";
import FluidityHotSpot from "~/components/Fluidify/FluidifyHotSpot";
import AugmentedToken from "~/types/AugmentedToken";

interface ISwapCircleProps {
  swapping: boolean;
  setSwapping: React.Dispatch<React.SetStateAction<boolean>>;
  assetToken?: AugmentedToken;
  setAssetToken: React.Dispatch<
    React.SetStateAction<AugmentedToken | undefined>
  >;
}

const SwapCircle = ({
  swapping,
  setSwapping,
  assetToken,
  setAssetToken,
}: ISwapCircleProps) => {
  return (
    <>
      {swapping ? (
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
              src={"/videos/FLUIDITY_01.mp4"}
              loop={false}
              type="none"
              scale={2}
              onEnded={() => {
                setSwapping(false);
              }}
            />
            <img src={assetToken?.logo} />
          </motion.div>
        </AnimatePresence>
      ) : (
        <FluidityHotSpot activeToken={assetToken} callBack={setAssetToken} />
      )}
    </>
  );
};

export default SwapCircle;
