// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import { useState } from "react";
import HowItWorksTemplate from "../../components/HowItWorksTemplate";
import { ReusableGrid } from "@fluidity-money/surfing";
import styles from "./Use.module.scss";
import useViewport from "hooks/useViewport";
import Video from "components/Video";

const Use = () => {
  // to set order correct when in column layout
  const { width } = useViewport();
  const breakpoint = 860;
  //for whatever happens that stops the video from playing like on ios due to powersaver turned on. - play a low res webp
  //also for an awful network - play a low res webp while main vid loads
  const [onHomeVidLoaded, setOnHomeVidLoaded] = useState(false);
  
  const right =
  <HowItWorksTemplate header={header} info={info}>
    Fluid asset use-cases
  </HowItWorksTemplate>
   
  const left =
  <>
    <img
    src="/assets/images/Animations/FluidityUse.webp"
    style={{
      position: "relative",
      width: "100%",
      display: `${onHomeVidLoaded === true ? "none" : "block"}`,
    }}
    alt="Fluidity Use" />
    <Video
      src={"/assets/videos/FluidityUse.mp4"}
      type={"fit"}
      display= {!onHomeVidLoaded ? "none" : "inline"}
      loop={true}
      onLoad={!onHomeVidLoaded ? () => setOnHomeVidLoaded(true) : () => { } }
    />
  </>

  return (
    <div className={styles.container} id="yield&win">
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
