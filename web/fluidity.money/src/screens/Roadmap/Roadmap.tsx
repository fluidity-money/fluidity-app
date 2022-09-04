// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import { ReusableGrid } from "surfing";
import Video from "components/Video";
import styles from "./Roadmap.module.scss";

const Roadmap = () => {
  return (
    <div className={styles.container}>
      <ReusableGrid
        left={<h1>Roadmap</h1>}
        right={<Video src={window.location.origin + '/assets/videos/Fluidity_RoadMap.mp4'} type={'fit'} view={'desktop'} loop={true}/>}
      />
    </div>
  );
};

export default Roadmap;
