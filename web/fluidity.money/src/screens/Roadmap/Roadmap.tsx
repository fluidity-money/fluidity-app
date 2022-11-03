// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import useViewport from "hooks/useViewport";
import { ArrowTopRight, ReusableGrid, GeneralButton } from "@fluidity-money/surfing";
import Video from "components/Video";
import HowItWorksTemplate from "components/HowItWorksTemplate";
import styles from "./Roadmap.module.scss";

const Roadmap = () => {

  const { width } = useViewport();
  const breakpoint = 860;
  
  const button = <GeneralButton
    buttontype={"icon after"}
    version={"secondary"}
    size={"large"}
    handleClick={() => {window.location.href = "https://docs.fluidity.money/docs/fundamentals/roadmap"}}
    icon={<ArrowTopRight/>}
  >
    EXPLORE OUR FUTURE
  </GeneralButton>;

const left =
width < breakpoint ? (
  <div className={styles.smallVid}>
  <Video
    src={"/assets/videos/FluidityRoadMap.mp4"}
    type={"fit"}
    loop={true}
    margin={"-120px 0px 0px 0px"}
    className={styles.video}
  />
  <div className={styles.smallClip} />
  </div>
) : (
  <HowItWorksTemplate button={button} info={info}>
    Roadmap
  </HowItWorksTemplate>
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
  <HowItWorksTemplate info={info} button={button}>
    Roadmap
  </HowItWorksTemplate>
);

  return (
    <div className={styles.container} id="roadmap">
      <ReusableGrid left={left} right={right} />
    </div>
  );
};

export default Roadmap;

const info = [
  "An incentive layer that bridges Web2 and Web3 is forming, and the way money moves is about to change. ",
];
