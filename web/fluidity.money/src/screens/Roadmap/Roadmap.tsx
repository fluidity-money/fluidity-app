// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import { ArrowTopRight, ReusableGrid, GeneralButton } from "@fluidity-money/surfing";
import Video from "components/Video";
import styles from "./Roadmap.module.scss";
import HowItWorksTemplate from "components/HowItWorksTemplate";
import useViewport from "hooks/useViewport";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

const Roadmap = () => {

  const { width } = useViewport();
  const breakpoint = 860;

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
  
  const button = <GeneralButton
    buttonType={"icon after"}
    version={"secondary"}
    size={"large"}
    handleClick={() => {window.location.href = "https://docs.fluidity.money/docs/fundamentals/roadmap"}}
    icon={<ArrowTopRight/>}
  >
    EXPLORE OUR FUTURE
  </GeneralButton>;

  const left =
  width < breakpoint ? (
    <motion.div
      animate={control}
      initial="hidden"
      variants={rightIn}
    >
      <div className={styles.smallVid}>
        <Video
          src={"/assets/videos/FluidityRoadMap.mp4"}
          type={"fit"}
          loop={true}
          className={styles.video}
        />
        <div className={styles.smallClip} />
      </div>
    </motion.div>
  ) : (
    <motion.div
      animate={control}
      initial="hidden"
      variants={bottomPush}
    >
      <HowItWorksTemplate button={button} info={info}>
        Roadmap
      </HowItWorksTemplate>
    </motion.div>
  );

  const right =
  width > breakpoint ? (
    <>
    <Video
      src={"/assets/videos/FluidityRoadMap.mp4"}
      type={"fit"}
      loop={true}
      scale={2.0}
      margin={"0px 400px 0px 0px"}
      className={styles.video}
    />
    <div className={styles.clip} />
    </>
  ) : (
    <motion.div
      animate={control}
      initial="hidden"
      variants={leftIn}
    >
      <HowItWorksTemplate info={info} button={button}>
        Roadmap
      </HowItWorksTemplate>
    </motion.div>
  );

  return (
    <div ref={ref} className={styles.container} id="roadmap">
      <ReusableGrid left={left} right={right} />
    </div>
  );
};

export default Roadmap;

const info = [
  "An incentive layer that bridges Web2 and Web3 is forming, and the way money moves is about to change. ",
];
