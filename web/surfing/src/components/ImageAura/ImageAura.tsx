import React from "react";

import styles from "./ImageAura.module.scss";

interface ImageAuraProps {
  children ?: React.ReactNode;
  backgroundStyle ?: string;
};

export const ImageAura = ({ children, backgroundColour="#2775CA", ...props }: ImageAuraProps) =>
  <div
    class={ styles.container }
    styles={{
      backgroundColor: backgroundColour
    }}
    { ...props }
    >
     { children }
  </div>;

export default ImageAura;
