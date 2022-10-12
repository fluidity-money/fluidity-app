// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import useViewport from 'hooks/useViewport';
import styles from './LoadingScreen.module.scss';

const LoadingScreen = () => {
    const { width } = useViewport();
    const breakPoint = 820;
    return (
        <div className={styles.container}>
          <img
          src="assets/images/LoopAnim.webp"
          style={{
            position: "fixed",
            top: '50%',
            left: '50%',
            width: `${width > breakPoint ? "30%" : "60%"}`,
            marginTop: `${width > breakPoint ? "-15%" : "-30%"}`,
            marginLeft: `${width > breakPoint ? "-15%" : "-30%"}`
          }}
          alt="circle loop animation"
          />
          <img
          src="assets/images/TextLoop.webp"
          style={{
            top: '50%',
            left: '50%',
            position: "fixed",
            width: `${width > breakPoint ? "15%" : "30%"}`,
            marginTop: `${width > breakPoint ? "-5%" : "-10%"}`,
            marginLeft: `${width > breakPoint ? "-7.5%" : "-15%"}`
          }}
          alt="text bounce animation"
          />
        </div>
    );
}

export default LoadingScreen;
