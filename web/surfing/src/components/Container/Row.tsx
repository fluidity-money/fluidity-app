import type { HTMLProps } from "react";

import styles from "./Row.module.scss";

const Row = ({
  children,
  className,
  ...props
}: HTMLProps<HTMLDivElement> ) => {
  const classProps = className || "";

  return (
    <div className={`${styles.row} ${classProps}`} {...props} >
      {children}
    </div>
  );
};

export default Row;
