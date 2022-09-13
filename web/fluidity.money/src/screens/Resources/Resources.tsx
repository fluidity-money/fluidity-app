// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import { LinkButton } from "@fluidity-money/surfing";
import Socials from "../../components/Socials";
import styles from "./Resources.module.scss";

const Resources = () => {
  /*
  big article and image top left,
  small top right,
  3 listed below across screen
  */
  return (
    <div
      style={{ display: "flex", flexDirection: "column" }}
      className={styles.container}
    >
      <div>RESOURCES</div>
      <div style={{ display: "flex" }}>
        <Socials />
        <LinkButton size={"large"} type={"internal"} handleClick={() => {}}>
          EXPLORE ALL RESOURCES
        </LinkButton>
      </div>
      <div>large Image with title and text top left</div>
      <div>
        small same size images, 1 top right, 3 below across whole screen evenly
      </div>
    </div>
  );
};

export default Resources;
