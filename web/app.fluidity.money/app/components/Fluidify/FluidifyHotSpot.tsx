import { AnimatePresence, motion } from "framer-motion";
import { Text } from "@fluidity-money/surfing";
import { useDrop } from "react-dnd";
import ItemTypes from "~/types/ItemTypes";
import AugmentedToken from "~/types/AugmentedToken";

const FluidityHotSpot = ({
  activeToken,
  callBack,
}: {
  activeToken?: AugmentedToken;
  callBack: React.Dispatch<React.SetStateAction<AugmentedToken | undefined>>;
}) => {
  const drop = useDrop(() => ({
    accept: [ItemTypes.ASSET, ItemTypes.FLUID_ASSET],
    drop: callBack,
    collect: (monitor) => ({
      canDrop: monitor.canDrop(),
    }),
  }))[1];

  return (
    <AnimatePresence>
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        exit={{ opacity: 0 }}
        className="main-hotspot"
        style={{
          mixBlendMode: activeToken !== undefined ? "color-dodge" : "normal",
        }}
      >
        <div ref={drop} className="fluidify-hot-spot">
          <img
            className="fluidify-circle"
            src="https://app-cdn.fluidity.money/images/fluidify/fluidify-hotspot.png"
          />
          <span className={"dashed-circle"}>
            {!activeToken && (
              <Text size="sm" className="circle-text">
                Drag and drop the asset <br /> you want to fluidify here.{" "}
              </Text>
            )}
          </span>
        </div>
      </motion.main>
    </AnimatePresence>
  );
};

export default FluidityHotSpot;
