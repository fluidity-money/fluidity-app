// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import { useEffect } from "react";
import styles from "./Video.module.scss";

interface IPropsVideo {
  src: string;
  type: "fill" | "fit" | "contain" | "cover" | "reduce" | "none";
  loop: boolean;
  display?: "none" | "inline";
  key?: string;
  scale?: number;
  opacity?: number;
  margin? : string;
  onLoad?: VoidFunction;
  onEnded?: VoidFunction;
}

export const Video = ({
  key,
  src,
  type,
  loop,
  display="inline",
  scale=1,
  opacity=1,
  margin = `0px 0px 0px 0px`,
  onEnded=() => {},
  onLoad=() => {},
  ...props
}: IPropsVideo) => {
  let ext = src.split(".").pop();

  useEffect(() => {
     
  });

  return (
    <video
      key={key}
      loop={loop}
      autoPlay
      muted
      playsInline
      className={`${styles.videoContainer} ${styles[type]}`}
      style={{
        display: display,
        width: `${scale * 100}%`,
        opacity: `${opacity}`,
        margin: margin
      }}
      onEnded={onEnded}
      onPlaying={onLoad}
    >
      <source src={src} type={"video/" + ext} />
    </video>
  );
};

export default Video;
