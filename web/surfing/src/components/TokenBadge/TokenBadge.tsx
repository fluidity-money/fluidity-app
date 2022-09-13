import React from "react";

import styles from "./TokenBadge.module.scss";

import pickCss from "../util/pickCss";

interface TokenBadgeProps {
  children ?: React.ReactNode;
};

const badgeSrc = "/src/assets/images/logoBall.svg";

export const TokenBadge = ({ imageSrc, ...props }: TokenBadgeProps) =>
  <div className={ styles.root_container }>
    <div className={ styles.container }>
      <img className={ styles.badge } src={ badgeSrc } />
      <img className={ styles.image } src={ imageSrc } />
    </div>
  </div >;

export default TokenBadge;
