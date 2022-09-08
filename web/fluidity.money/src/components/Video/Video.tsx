// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import styles from "./Video.module.scss";

interface IPropsVideo {
  src: string;
  type: "fill" | "fit" | "contain" | "cover" | "reduce" | "none";
  loop: boolean;
  display?: "none" | "inline";
  key?: string;
  preload?: "none" | "metadata" | "auto";
  scale?: number;
  opacity?: number;
  onLoad?: VoidFunction;
  onEnded?: VoidFunction;
}

export const Video = ({
  key,
  src,
  type,
  loop,
  display="inline",
  preload="none",
  scale=1,
  opacity=1,
  onEnded=() => {},
  onLoad=() => {},
}: IPropsVideo) => {
  let ext = src.split(".").pop();
  return (
    <video
      key={key}
      loop={loop}
      preload={preload}
      autoPlay
      muted
      className={`${styles.videoContainer} ${styles[type]}`}
      style={{
        display: display,
        width: `${scale * 100}%`,
        opacity: `${opacity}`
      }}
      onEnded={onEnded}
      onLoad={onLoad}
    >
      <source src={src} type={"video/" + ext} />
    </video>
  );
};

export default Video;
