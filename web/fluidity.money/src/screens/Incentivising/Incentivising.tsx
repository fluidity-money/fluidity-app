// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import { Display, Heading } from "@fluidity-money/surfing";
import Video from "components/Video";
import useViewport from "hooks/useViewport";
import styles from "./Incentivising.module.scss";

const Incentivising = () => {
  const { width } = useViewport();
  const breakpoint = 620;

  return (
    <div className={styles.container}>
      <Video
        src={window.location.origin + "/assets/videos/Fluidity_HowItWorks.mp4"}
        type={"reduce"}
        loop={true}
      />
      <div>
        <Heading as={"h6"}>HOW IT WORKS</Heading>
        <Display
          className={styles.backgroundText}
          large={width > breakpoint && true}
          small={width < breakpoint && true}
        >
          Incentivising
        </Display>
        <Display
          className={styles.backgroundText}
          large={width > breakpoint && true}
          small={width < breakpoint && true}
        >
          blockchain utility
        </Display>
      </div>
    </div>
  );
};

export default Incentivising;
