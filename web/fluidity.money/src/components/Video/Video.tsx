// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import styles from "./Video.module.scss";

interface IPropsVideo {
  src: string | string[];
  type: "fill" | "fit" | "contain" | "cover" | "reduce" | "none";
  loop: boolean;
  display?: "none" | "inline";
  key?: string;
  scale?: number;
  opacity?: number;
  margin? : string;
  onLoad?: VoidFunction;
  onEnded?: VoidFunction;
  className?: string;
  mimeType?: string | string[];
  
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
  key,
  src,
  type,
  mimeType = "video/mp4",
  loop,
  display="inline",
  scale=1,
  opacity=1,
  margin = `0px 0px 0px 0px`,
  onEnded=() => {},
  onLoad=() => {},
  className,
  width="dynamic",
  height=900,
  ...props
}: IPropsVideo) => {
  
  const classProps = className || "";

  let dynamicWidth = `${scale * 100}%`;
  
  //the best i can do for mozilla-firefox, lol
  if(navigator.userAgent.indexOf("Firefox") != -1) {
    dynamicWidth = `${scale * 1000}px`;
  }
  
  let widthProp = width;
  
  if (widthProp === "dynamic") {
    widthProp = dynamicWidth;
  } else if (typeof widthProp === "number") {
    widthProp = `${widthProp}px`;
  }
  
  const heightProp = typeof height === "number"
    ? `${height}px`
    : height;
  
  return (
    <video
      key={key}
      loop={loop}
      autoPlay
      muted
      playsInline
      className={`${styles.videoContainer} ${styles[type]} ${classProps}`}
      style={{
        display: display,
        opacity: `${opacity}`,
        margin: margin,
        width: widthProp,
        height: heightProp,
      }}
      onEnded={onEnded}
      onPlaying={onLoad}
      {...props}
    >
      {Array.isArray(src) ?
        src.map((v, i) => {return <source src={v} type={mimeType[i]} />}) :  <source src={src} type={mimeType as string} /> }
    </video>
  );
};

export default Video;
