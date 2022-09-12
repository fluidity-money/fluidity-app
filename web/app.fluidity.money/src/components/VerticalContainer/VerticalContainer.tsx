import React from "react";

import styles from "./VerticalContainer.module.sass";

import pickCss from "../../util/PickCss";

interface VerticalContainerProps {
  children ?: React.ReactNode;
  center ?: boolean;
};

export default ({ children, center, ...props } : VerticalContainerProps) => {
  const className = pickCss([
    [true, styles.container],
    [center, styles.center]
  ]);

  return (
    <div className={className} {...props}>{children}</div>
  );
};
