// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { LinkButton, ReusableGrid } from "surfing";
import Video from "components/Video";
import styles from "./Roadmap.module.scss";
import HowItWorksTemplate from "components/HowItWorksTemplate";
import useViewport from "hooks/useViewport";

const Roadmap = () => {
  const location = useLocation();
  useEffect(() => {
    if (location.hash) {
      let elem = document.getElementById(location.hash.slice(1));
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  }, [location]);

  const { width } = useViewport();
  const breakpoint = 860;

  const button = (
    <LinkButton size={"medium"} type={"external"} handleClick={() => {}}>
      EXPLORE OUR FUTURE
    </LinkButton>
  );

  const left =
    width < breakpoint ? (
      <Video
        src={window.location.origin + "/assets/videos/Fluidity_RoadMap.mp4"}
        type={"fit"}
        view={"normal"}
        loop={true}
      />
    ) : (
      <HowItWorksTemplate button={button} info={info}>
        Roadmap
      </HowItWorksTemplate>
    );

  const right =
    width > breakpoint ? (
      <Video
        src={window.location.origin + "/assets/videos/Fluidity_RoadMap.mp4"}
        type={"fit"}
        view={"normal"}
        loop={true}
      />
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
