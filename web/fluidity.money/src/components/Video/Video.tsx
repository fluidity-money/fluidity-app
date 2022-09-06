// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import styles from "./Video.module.scss";

interface IPropsVideo {
  src: string;
  type: "fill" | "fit" | "contain" | "cover" | "reduce" | "none";
  view: "scale-up" | "normal";
  loop: boolean;
  key?: string;
}

export const Video = ({ src, type, view, loop, key }: IPropsVideo) => {
  let ext = src.split(".").pop();
  return (
    <video
      key={key}
      loop={loop}
      autoPlay
      muted
      className={`${styles.videoContainer} ${styles[type]} ${styles[view]}`}
    >
      <source src={src} type={"video/" + ext} />
    </video>
  );
};

export default Video;
