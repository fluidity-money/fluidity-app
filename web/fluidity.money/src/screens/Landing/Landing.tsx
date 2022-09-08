// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import { useEffect, useRef, useState } from "react";
import { ContinuousCarousel, ManualCarousel } from "@fluidity-money/surfing";
import IntroTile from "components/IntroTile";
import styles from "./Landing.module.scss";
import { motion } from "framer-motion";
import useViewport from "hooks/useViewport";
import Video from "components/Video";
import { stat } from "fs";

const Landing = () => {
  
  const [state, setState] =  useState({
    src: '/assets/videos/Fluidity_Home.mp4',
    key: '0',
    loop: false,
    scale: .7,
  });
 
  useEffect(() => {

    setTimeout(function() { 
      setState({
      src: '/assets/videos/Fluidity_Homeloop.mp4',
      key: '1',
      loop: true,
      scale: .5,
    })
    }, 6000);

  }, []);

  const { width } = useViewport();
  const breakpoint = 620;

  return (
    <div className={`${styles.containerLanding}`}>
      
      
      {width > breakpoint ? (
          <div className={`${styles.bgVid}`}>
            <Video src={window.location.origin + state.src} type={'reduce'} loop={state.loop} key={state.key} scale={state.scale} opacity={0.5}/>;
          </div>
        ) : (
          <div className={`${styles.bgVid}`}>
           <Video src={window.location.origin + state.src} type={'reduce'} loop={state.loop} key={state.key} scale={state.scale * 2} opacity={0.5}/>;
          </div>
        )}
      <motion.div className={styles.content}>
        {width < breakpoint ? (
          <motion.h1
            initial={{ opacity: 0, y: "-100vh" }}
            animate={{ opacity: [0, 0, 0, 1], y: 0 }}
            transition={{ duration: 6, type: "tween" }}
          >
            Fluidity is the <br /> blockchain incentive <br /> layer, rewarding{" "}
            <br /> people for using <br /> their crypto.
          </motion.h1>
        ) : (
          <motion.h1
            initial={{ opacity: 0, y: "-100vh" }}
            animate={{ opacity: [0, 0, 0, 1], y: 0 }}
            transition={{ duration: 6, type: "tween" }}
          >
            Fluidity is the blockchain incentive layer, <br />
            rewarding people for using their crypto.
          </motion.h1>
        )}
        <div className={styles.tiles}>
          {width < breakpoint && (
            <motion.div
              className={styles.video}
              initial={{ y: -150, scale: 1 }}
              animate={{
                opacity: 1,
                y: [-150, -150, -150, 0],
                scale: [1, 1, 1, 0.8],
              }}
              transition={{ duration: 6, type: "tween" }}
            >
             
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: "-100vh" }}
            animate={{ opacity: [0, 0, 0, 1], y: 0 }}
            transition={{ duration: 6, type: "tween" }}
            className={styles.left}
          >
            <IntroTile
              img={"/assets/images/landingIcons/1to1.svg"}
              side={"left"}
            >
              1 to 1 exchange rate <br />
              to base wrapped assets
            </IntroTile>
            <IntroTile
              img={"/assets/images/useCaseIcons/sendReceive.svg"}
              side={"left"}
            >
              Senders and receivers <br />
              both qualify
            </IntroTile>
            <IntroTile
              img={"/assets/images/landingIcons/everyTransaction.svg"}
              side={"left"}
            >
              Every transaction <br />
              qualifies as a reward
            </IntroTile>
          </motion.div>
         

          <motion.div
            initial={{ opacity: 0, y: "-100vh" }}
            animate={{ opacity: [0, 0, 0, 1], y: 0 }}
            transition={{ duration: 6, type: "tween" }}
            className={width < breakpoint ? styles.left : styles.right}
          >
            <IntroTile
              img={"/assets/images/landingIcons/expectedOutcome.svg"}
              side={width < breakpoint ? "left" : "right"}
            >
              Fluidity improves your expected <br />
              outcome over time
            </IntroTile>
            <IntroTile
              img={"/assets/images/useCaseIcons/forReceivers.svg"}
              side={width < breakpoint ? "left" : "right"}
            >
              Rewards can range from cents
              <br /> to millions
            </IntroTile>
            <IntroTile
              img={"/assets/images/landingIcons/scalingEcosystem.svg"}
              side={width < breakpoint ? "left" : "right"}
            >
              Scaling ecosystem
            </IntroTile>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className={styles.carousel}
        initial={{ opacity: 0, y: "100vh" }}
        animate={{ opacity: [1, 1, 1, 0], y: [0, 0, 0, 100] }}
        transition={{ duration: 6, type: "tween" }}
      >
        <ContinuousCarousel direction={"right"}>
          <div>
            <div className={styles.text}>MONEY DESIGNED TO MOVE</div>
            <div className={styles.text}>MONEY DESIGNED TO MOVE</div>
            <div className={styles.text}>MONEY DESIGNED TO MOVE</div>
            <div className={styles.text}>MONEY DESIGNED TO MOVE</div>
            <div className={styles.text}>MONEY DESIGNED TO MOVE</div>
            <div className={styles.text}>MONEY DESIGNED TO MOVE</div>
            <div className={styles.text}>MONEY DESIGNED TO MOVE</div>
            <div className={styles.text}>MONEY DESIGNED TO MOVE</div>
            <div className={styles.text}>MONEY DESIGNED TO MOVE</div>
            <div className={styles.text}>MONEY DESIGNED TO MOVE</div>
          </div>
        </ContinuousCarousel>
      </motion.div>
    </div>
  );
};

export default Landing;
