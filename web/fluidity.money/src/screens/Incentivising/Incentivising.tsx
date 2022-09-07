// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import Video from "components/Video";
import styles from "./Incentivising.module.scss";

const Incentivising = () => {
  return (
    <div className={styles.container}>
      <Video src={window.location.origin + '/assets/videos/Fluidity_HowItWorks.mp4'} type={'reduce'} loop={true}/>
      <div>
        <h2>INCENTIVISING BLOCKCHAIN</h2>
        <h2>UTILITY</h2>
      </div>
      
    </div>
  );
};

export default Incentivising;
