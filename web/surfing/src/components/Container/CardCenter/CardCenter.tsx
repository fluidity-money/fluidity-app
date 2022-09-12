import React from "react";

import styles from "./CardCenter.module.scss";

interface CardCenterProps {
  children ?: React.ReactNode;
};

export const CardCenter = ({ children, ...props }: CardCenterProps) =>
  <div className={ styles.center } { ...props }>
    { children }
  </div>;

export default CardCenter;
