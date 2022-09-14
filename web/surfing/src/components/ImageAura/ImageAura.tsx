import React from "react";

import styles from "./ImageAura.module.scss";
import Center from "../Center";

interface ImageAuraProps {
  children ?: React.ReactNode;
  backgroundStyle ?: string;
};

export const ImageAura = ({ children, backgroundColour="#2775CA", ...props }: ImageAuraProps) =>
  <Center>
    <div className={ styles.container } { ...props }>
       { children }
    </div>
  </Center>;

export default ImageAura;
