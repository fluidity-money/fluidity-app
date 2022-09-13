// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import { useEffect, useState } from "react";
import {
  ContinuousCarousel,
  Heading,
} from "@fluidity-money/surfing";
import IntroTile from "components/IntroTile";
import { motion } from "framer-motion";
import useViewport from "hooks/useViewport";
import Video from "components/Video";
import styles from "./Landing.module.scss";
import { relative } from "path";

const Landing = () => {
  const vidSources = ["/assets/videos/FluidityHome.mp4", "/assets/videos/FluidityHomeloop.mp4"].map(link =>
    window.location.origin + link
  )

  const [ onHomeVidLoaded, setOnHomeVidLoaded ] = useState(false);
  const [ homeVidEnded, setHomeVidEnded ] = useState(false);

  const [state, setState] = useState({
    src: vidSources[0],
    key: "0",
    loop: false,
    scale: 0.7,
  });

  useEffect(() => {
    homeVidEnded &&
      setState({
        src: vidSources[1],
        key: "1",
        loop: true,
        scale: 0.5,
      });
  }, [homeVidEnded]);

  const { width } = useViewport();
  const breakpoint = 620;

  const callout = (
    <div className={styles.callout}>
      <Heading hollow={true} as="h4" className={styles.text}>
        MONEY DESIGNED TO MOVE MONEY DESIGNED TO MOVE
      </Heading>
      <Heading as="h4" className={styles.text}>
        MONEY DESIGNED TO MOVE
      </Heading>
    </div>
  );

  return (
    <div className={`${styles.containerLanding}`}>
      {/* Video Container */}
      {width > breakpoint ? (
        <div className={`${styles.bgVid}`}>
          <img src="assets/images/load.webp"
           style={{
            position: "absolute",
            display: `${onHomeVidLoaded === true ? 'none' : 'block'}`
          }}
          />
          <Video
            src={state.src}
            type={"reduce"}
            loop={state.loop}
            key={state.key}
            scale={state.scale}
            opacity = {.4}
            margin = {"200px 0 0 0"}
            onLoad={!homeVidEnded 
              ? () => setOnHomeVidLoaded(true)
              : () => {}
            }
            onEnded={!homeVidEnded 
              ? () => setHomeVidEnded(true)
              : () => {}
            }
          />
        </div>
      ) : (
        <div className={`${styles.bgVid}`}>
          <img src="assets/images/loadanimation.gif"
           style={{
            position: "absolute",
            display: `${onHomeVidLoaded === true ? 'none' : 'block'}`
          }}
          />
          <Video
            src={state.src}
            type={"reduce"}
            loop={state.loop}
            key={state.key}
            scale={state.scale * 2}
            margin = {"-400px 0 0 0"}
            opacity = {.6}
            onLoad={!homeVidEnded 
              ? () => setOnHomeVidLoaded(true)
              : () => {}
            }
            onEnded={!homeVidEnded 
              ? () => setHomeVidEnded(true)
              : () => {}
            }
          />
        </div>
      )}
    
      {/* Hero animation */}
      <motion.div className={styles.content}>
        {width < breakpoint ? (
          <motion.div 
            initial={{ opacity: 0, y: "-100vh" }}
            animate={{ opacity: [0, 0, 0, 1], y: 0 }}
            transition={{ duration: 6, type: "tween" }}
          >
            <Heading className={styles.title} as="h3">
              Fluidity is the <br /> blockchain incentive <br /> layer,
              rewarding <br /> people for using <br /> their crypto.
            </Heading>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: "-100vh" }}
            animate={{ opacity: [0, 0, 0, 1], y: 0 }}
            transition={{ duration: 6, type: "tween" }}
          >
            <Heading as="h3">
              Fluidity is the blockchain incentive layer, <br />
              rewarding people for using their crypto.
            </Heading>
          </motion.div>
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
            ></motion.div>
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
        <div className={styles.carousel}>
          <ContinuousCarousel direction={"right"}>
            <div>
              {callout}
              {callout}
              {callout}
              {callout}
              {callout}
              {callout}
              {callout}
              {callout}
              {callout}
              {callout}
              {callout}
            </div>
          </ContinuousCarousel>
        </div>
      </motion.div>
    </div>
  );
};

export default Landing;
