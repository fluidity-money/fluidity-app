// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import HowItWorksTemplate from "../../components/HowItWorksTemplate";
import { ReusableGrid } from "@fluidity-money/surfing";
import styles from "./Use.module.scss";
import useViewport from "hooks/useViewport";
import Video from "components/Video";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

const Use = () => {
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
  
  const right =
  <motion.div
    animate={control}
    initial="hidden"
    variants= {width <= breakpoint ? leftIn : topDrop}
  >
    <HowItWorksTemplate header={header} info={info}>
      Fluid asset use-cases
    </HowItWorksTemplate>
  </motion.div>
  const left =
  <motion.div
    animate={control}
    initial="hidden"
    variants= {width <= breakpoint ? rightIn : bottomPush}
  >
    <Video
      src={"/assets/videos/FluidityUse.mp4"}
      type={"fit"}
      loop={true}
    />
  </motion.div>

  return (
    <div ref={ref} className={styles.container} id="useassets">
      <ReusableGrid left={left} right={right} />
    </div>
  );
};

export default Use;

const header = " Fluid assets apportion yield when utilized on-chain.  ";

const info = [
  "Fluidity is realigning incentives by rewarding utility and usage. Fluid assets are composable by nature and can successfully promote both user and platform engagement through its novel reward distribution mechanisms. The fluid ecosystem also allows developers to compose how and when these rewards are distributed.  ",
  "Use cases include marketplaces, decentralized exchanges, and any use-case where tokens are transacted on chain.",
];
