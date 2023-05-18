// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import { useEffect, useRef } from "react";
import { isFirefox } from "react-device-detect";
import styles from "./Video.module.scss";

interface IPropsVideo extends React.HTMLAttributes<HTMLVideoElement> {
  src: string;
  type: "fill" | "fit" | "contain" | "cover" | "reduce" | "none";
  loop: boolean;
  preload?: "none" | "metadata" | "auto";
  display?: "none" | "inline";
  videoKey?: string;
  scale?: number;
  opacity?: number;
  margin?: string;
  onLoad?: VoidFunction;
  onEnded?: VoidFunction;
  className?: string;
  mimeType?: string;
  playbackRate?: number;

  // Width of container
  //   dynamic - Change explicit scale
  //   auto - Automatically scale container width
  //   number - Fixed width
  width?: "dynamic" | "auto" | string | number;

  // Height of container
  //   auto - Automatically scale container height
  //   number - Fixed height
  height?: "auto" | number;
}

export const Video = ({
  videoKey,
  src,
  type,
  mimeType = "video/mp4",
  loop,
  display = "inline",
  preload = "auto",
  scale = 1,
  opacity = 1,
  margin = `0px 0px 0px 0px`,
  onEnded = () => { },
  onLoad = () => { },
  className,
  width = "dynamic",
  height = 900,
  playbackRate = 1,
  ...props
}: IPropsVideo) => {
  const classProps = className || "";

  const dynamicWidth = isFirefox ? `${scale * 400}px` : `${scale * 100}%`;

  let widthProp = width;

  if (widthProp === "dynamic") {
    widthProp = dynamicWidth;
  } else if (typeof widthProp === "number") {
    widthProp = `${widthProp}px`;
  }

  const heightProp = typeof height === "number" ? `${height}px` : height;

  const vidRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    vidRef.current?.play();
  });

  useEffect(() => {
    if (vidRef.current) {
      vidRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  return (
    <>
      <video
        ref={vidRef}
        key={videoKey}
        loop={loop}
        preload={preload}
        muted
        playsInline
        src={src}
        className={`${styles.videoContainer} ${styles[type]} ${classProps}`}
        style={{
          display: display,
          opacity: `${opacity}`,
          margin: margin,
          width: widthProp,
          height: heightProp,
        }}
        onEnded={onEnded}
        onLoad={onLoad}
        {...props}
      />
    </>
  );
};

export default Video;
