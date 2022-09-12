import React from "react";

import styles from "./CenterContainer.module.sass";

import pickCss from "../../util/PickCss";

interface CenterContainerProps {
  children ?: React.ReactNode;
  fullscreen ?: boolean;
};

export default ({ fullscreen, children, ...props } : CenterContainerProps) => {
  const className = pickCss([
    [true, styles.container],
    [fullscreen, styles.fullscreen]
  ]);

  return (
    <div className={className} {...props}>{children}</div>
  )
};
