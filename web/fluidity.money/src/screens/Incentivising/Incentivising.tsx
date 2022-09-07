// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import { Display } from "@fluidity-money/surfing";
import Video from "components/Video";
import styles from "./Incentivising.module.scss";

const Incentivising = () => {
  return (
    <div className={styles.container}>
      <Video
        src={window.location.origin + "/assets/videos/Fluidity_HowItWorks.mp4"}
        type={"reduce"}
        loop={true}
      />
      <div>
        <Display className={styles.backgroundText} large={true}>
          INCENTIVISING BLOCKCHAIN
        </Display>
        <Display className={styles.backgroundText} large={true}>
          UTILITY
        </Display>
      </div>
    </div>
  );
};

export default Incentivising;
