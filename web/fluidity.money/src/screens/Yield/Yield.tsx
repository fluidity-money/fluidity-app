// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import { ReusableGrid } from "@fluidity-money/surfing";
import useViewport from "hooks/useViewport";
import HowItWorksTemplate from "../../components/HowItWorksTemplate";
import styles from "./Yield.module.scss";
import Video from "components/Video";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

const Yield = () => {

  // to set order correct when in column layout
  const { width } = useViewport();
  const breakpoint = 860;

  const topDrop = {
    visible: { opacity: 1, transform: "translateY(0px)", transition: { duration: 2.8 } },
    hidden: { opacity: 0, transform: width <= 620 ? "translateY(-180px)" : "translateY(-500px)" }
  };

  const bottomPush = {
    visible: { opacity: 1, transform: "translateY(0px)", transition: { duration: 2.8 } },
    hidden: { opacity: 0, transform: width <= 620 ? "translateY(180px)" : "translateY(500px)" }
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
  width <= breakpoint ? (
    <>
      <motion.div
        animate={control}
        initial="hidden"
        variants={rightIn}
      >
        <Video
          src={"/assets/videos/FluidityYield.mp4"}
          type={"fit"}
          loop={true}
        />
      </motion.div>
    </>
  ) : (
    <motion.div
      animate={control}
      initial="hidden"
      variants={leftIn}
    >
      <HowItWorksTemplate header={header} info={info}>
        Yield through utility
      </HowItWorksTemplate>
    </motion.div>
  );

  const right =
  width > breakpoint ? (
    <>
      <motion.div
        animate={control}
        initial="hidden"
        variants={bottomPush}
      >
        <Video
          src={"/assets/videos/FluidityYield.mp4"}
          type={"fit"}
          loop={true}
        />
      </motion.div>
    </>
  ) : (
    <motion.div
      animate={control}
      initial="hidden"
      variants={leftIn}
    >   
      <HowItWorksTemplate header={header} info={info}>
        Yield through utility
      </HowItWorksTemplate>
    </motion.div>
  );

  return (
    <div ref={ref} className={styles.container} id="yield&win">
      <ReusableGrid left={left} right={right} />
    </div>
  );
};

export default Yield;

const header = "Yield is gained through utility.";

const info = [
  "A novel property of fluid Assets is that they expose users to randomly paid rewards or yield when they are used, sent or received.",
  "All forms of value transfer can now be incentivized. ",
  "We are creating a general all-purpose incentive mechanism that basically anyone can utilize in any on-chain use case that can incentivize actions. It is a system that is able to be embedded into different systems, platforms and protocols very easily.",
];
