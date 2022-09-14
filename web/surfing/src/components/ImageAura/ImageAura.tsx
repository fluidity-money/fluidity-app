import React from "react";

import styles from "./ImageAura.module.scss";
import Center from "../Center";

interface ImageAuraProps {
  children ?: React.ReactNode;
};

export const ImageAura = ({ children, ...props }: ImageAuraProps) =>
  <Center>
    <div className={ styles.container } { ...props }>
       { children }
    </div>
  </Center>;

export default ImageAura;
