// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import HowItWorksTemplate from "../../components/HowItWorksTemplate";
import { ReusableGrid } from "@fluidity-money/surfing";
import Video from "components/Video";
import styles from "./FluidWars.module.scss";
import useViewport from "hooks/useViewport";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

const FluidWars = () => {
  const { width } = useViewport();
  const breakpoint = 860;

  const topDrop = {
    visible: { opacity: 1, transform: "translateY(0px)", transition: { duration: 2.8 } },
    hidden: { opacity: 0, transform: width <= 620 ? "translateY(-180px)" : "translateY(-500px)" }
  };

  const leftIn = {
    visible: { opacity: 1, transform: "translateX(0px)", transition: { duration: 2.8 } },
    hidden: { opacity: 0, transform: width <= 620 ? "translateX(-180px)" : "translateX(-500px)" }
  };

  const rightIn = {
    visible: { opacity: 1, transform: "translateX(0px)", transition: { duration: 2.8 } },
    hidden: { opacity: 0, transform: width <= 620 ? "translateX(180px)" : "translateX(500px)" }
  };

  const control = useAnimation();
  const [ref, inView] = useInView();

  useEffect(() => {
    control.stop();
    inView ? (control.start("visible") ) : (control.set("hidden"));

  }, [control, inView]);
  
  const left =
  width > breakpoint ? (
    <>
      <Video
        src={'/assets/videos/FluidityFluidWars.mp4'}
        type={"fit"}
        loop={true}
        scale={2.0}
        margin={"0 0 0 270px"}
      />
    </>

  ) : (
    <>
      <motion.div
        animate={control}
        initial="hidden"
        variants= {rightIn}
      >
        <Video
          src={'/assets/videos/FluidityFluidWars.mp4'}
          type={"fit"}
          loop={true}
        />
      </motion.div>
    </>
  );

  const right =
  <motion.div
    animate={control}
    initial="hidden"
    variants= {width <= breakpoint ? leftIn : topDrop}
  >
    <HowItWorksTemplate header={header} info={info}>
      Fluidity wars
    </HowItWorksTemplate>
  </motion.div> 

  return (
    <div ref={ref} className={styles.container} id="fluiditywars">
      <ReusableGrid left={left} right={right} />
    </div>
  );
};

export default FluidWars;

const header = "User activity is incentivised through governance.";

const info = [
  "Fluidity will act as an incentive layer that operates at the blockchain level, orchestrating the primary user sentiments that drive the secondary liquidity effects. ",
  "Through Utility Mining, Fluidity and other protocols can drive in users whose primary yield incentives are to explore the protocol and exhibit intended behaviours that are beneficial for all parties involved.",
  "Enter Fluidity Wars—a perpetual war to control the flow of users in a world where genuine user engagement is apex currency.",
];
