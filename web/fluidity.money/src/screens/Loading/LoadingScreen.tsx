// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import { useViewport } from "@fluidity-money/surfing";
import styles from "./LoadingScreen.module.scss";

const LoadingScreen = () => {
  const { width } = useViewport();
  const breakPoint = 820;
  return (
    <div className={styles.container}>
      <img
        src="assets/images/LoopAnim.webp"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          width: `${width < breakPoint && width > 0 ? "60%" : "30%"}`,
          marginTop: `${width < breakPoint && width > 0 ? "-30%" : "-15%"}`,
          marginLeft: `${width < breakPoint && width > 0 ? "-30%" : "-15%"}`,
        }}
        alt="circle loop animation"
      />
      <img
        src="assets/images/TextLoop.webp"
        style={{
          top: "50%",
          left: "50%",
          position: "fixed",
          width: `${width < breakPoint && width > 0 ? "30%" : "15%"}`,
          marginTop: `${width < breakPoint && width > 0 ? "-10%" : "-5%"}`,
          marginLeft: `${width < breakPoint && width > 0 ? "-15%" : "-7.5%"}`,
        }}
        alt="text bounce animation"
      />
    </div>
  );
};

export default LoadingScreen;
