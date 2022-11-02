// Doesn't have much in the way of props, a lot is just passed in

import { useState } from "react";
import { useDrop } from "react-dnd";
import ItemTypes from "~/types/ItemTypes";

type FluidityDropProps = {
  color: string;
};

const FluidityDropTarget = () => {
  const imageMap = {
    idle: "/assets/fluidify/idle.png",
    fluidify: "/assets/fluidify/fluidify.webp",
  };

  const [active, setActive] = useState<FluidityDropProps>();

  const [{ isOver, canDrop, color }, drop] = useDrop(() => {
    return {
      accept: [ItemTypes.FLUID_ASSET, ItemTypes.ASSET],
      drop: (item: any) => item,
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
        color: monitor.getItem<FluidityDropProps>()?.color,
      }),
    };
  });

  return (
    <>
      <div className="fluidify-drop-target">
        <image
          className="fluidify-drop-target--animation"
          src={imageMap[idle ? "idle" : "fluidify"]}
        />
        <div className="fluidify-drop-target--droppable" />
      </div>
    </>
  );
};

export default FluidityDropTarget;
