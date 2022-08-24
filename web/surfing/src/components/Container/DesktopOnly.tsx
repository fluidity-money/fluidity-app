import type { HTMLProps } from "react";

import styles from "./DesktopOnly.module.scss";

const Row = ({
  children,
  className,
  ...props
}: HTMLProps<HTMLDivElement> ) => {
  const classProps = className || "";

  return (
    <div className={`${styles.desktop} ${classProps}`} {...props} >
      {children}
    </div>
  );
};

export default Row;
