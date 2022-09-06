// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ReusableGrid } from "@fluidity-money/surfing";
import Video from "components/Video";
import styles from "./Roadmap.module.scss";

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
  return (
    <div className={styles.container} id="roadmap">
      <ReusableGrid
        left={<h1>Roadmap</h1>}
        right={<Video src={window.location.origin + '/assets/videos/Fluidity_RoadMap.mp4'} type={'fit'} view={'normal'} loop={true}/>}
      />
    </div>
  );
};

export default Roadmap;

const info = [
  "An incentive layer that bridges Web2 and Web3 is forming, and the way money moves is about to change. ",
];
