// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import { useEffect, useRef } from "react";
// import styles from "./Video.module.scss";

interface IPropsVideo {
  src: string;
  type: "fill" | "fit" | "contain" | "cover" | "reduce" | "none";
  loop: boolean;
  preload?: "none" | "metadata" | "auto";
  display?: "none" | "inline";
  key?: string;
  scale?: number;
  opacity?: number;
  margin?: string;
  onLoad?: VoidFunction;
  onEnded?: VoidFunction;
  className?: string;

  // Width of container
  //   dynamic - Change explicit scale
  //   auto - Automatically scale container width
  //   number - Fixed width
  width?: "dynamic" | "auto" | string | number;

  // Height of container
  //   auto - Automatically scale container height
  //   number - Fixed height
  height?: number;
}

export const Video = ({
  key,
  src,
  type,
  loop,
  display = "inline",
  preload = "auto",
  scale = 1,
  opacity = 1,
  margin = `0px 0px 0px 0px`,
  onEnded = () => {
    return;
  },
  className,
  width = "dynamic",
  height,
  ...props
}: IPropsVideo) => {
  const classProps = className || "";

  const dynamicWidth = `${scale * 100}%`;

  let widthProp = width;

  if (widthProp === "dynamic") {
    widthProp = dynamicWidth;
  } else if (typeof widthProp === "number") {
    widthProp = `${widthProp}px`;
  }

  const heightProp = typeof height === "number" ? `${height}px` : "";

  const vidRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    vidRef.current?.play();
  });

  return (
    <>
      <video
        ref={vidRef}
        key={key}
        loop={loop}
        preload={preload}
        muted
        playsInline
        src={src}
        className={`videoContainer video-${type} ${classProps}`}
        style={{
          display: display,
          opacity: `${opacity}`,
          margin: margin,
          width: widthProp,
          height: heightProp,
        }}
        onEnded={onEnded}
        {...props}
      />
    </>
  );
};

export default Video;
