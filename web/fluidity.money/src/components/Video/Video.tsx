// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import styles from "./Video.module.scss";

interface IPropsVideo {
  key?: string;
  src: string;
  type: "fill" | "fit" | "contain" | "cover" | "reduce" | "none";
  loop: boolean;
  scale?: number;
}

export const Video = ({key, src, type, loop, scale=1}: IPropsVideo) => {
  let ext = src.split(".").pop();
  return (
    <video
      key={key}
      loop={loop}
      autoPlay
      muted
      className={`${styles.videoContainer} ${styles[type]}`}
      style={{
        width: `${scale * 100}%`,
      }}
    >
      <source src={src} type={"video/" + ext} />
    </video>
  );
};

export default Video;
