// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import HowItWorksTemplate from "components/HowItWorksTemplate";
import { ReusableGrid } from "@fluidity-money/surfing";
import { useInView } from "react-intersection-observer";
import { motion, useAnimation} from "framer-motion";
import useViewport from "hooks/useViewport";
import styles from "./Wrap.module.scss";
import Video from "components/Video";
import { useEffect } from "react";

const Wrap = () => {
  // to set order correct when in column layout
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
  width <= breakpoint ? (
    <>
      <motion.div
        animate={control}
        initial="hidden"
        variants={rightIn}
      >
        <Video
          src={"/assets/videos/FluidityWrap.mp4"}
          type={"fit"}
          loop={true}
          scale={0.7}
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
          Wrapped tokens
        </HowItWorksTemplate>
      </motion.div>
    );

  const right =
  width > breakpoint ? (
    <>
      <motion.div
        animate={control}
        initial="hidden"
        variants={topDrop}
      >
        <Video
          src={"/assets/videos/FluidityWrap.mp4"}
          type={"fit"}
          loop={true}
          scale={0.7}
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
        Wrapped tokens
      </HowItWorksTemplate>
    </motion.div>
  );

  return (
    <div ref={ref} className={styles.container} id="wraptokens">
      <ReusableGrid left={left} right={right} />
    </div>
  );
};

export default Wrap;

const header =
  "Fluid Assets are a 1:1 wrapped asset with perpetual payout properties. ";

const info = [
  "A 'fluid' asset is a wrapped standard token that is pegged to the underlying principal.  ",
  "Users are free from market volatility risks, and can redeem the base asset at any point of time through our web application or the method call on the corresponding swap contract.",
];
