import type { HTMLProps } from "react";

import styles from "./Row.module.scss";

interface IRowProps extends HTMLProps<HTMLDivElement> {
  reverse?: boolean;
}

const Row = ({
  children,
  className,
  reverse,
  ...props
}: IRowProps ) => {
  const classProps = className || "";

  return (
    <div className={`${styles.row} ${reverse && styles.reverse} ${classProps}`} {...props} >
      {children}
    </div>
  );
};

export default Row;
