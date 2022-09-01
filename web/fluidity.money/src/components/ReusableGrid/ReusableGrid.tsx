import React from "react";
import styles from "./ReusableGrid.module.scss";

interface IReusableGridProps {
  left: JSX.Element;
  right: JSX.Element;
}

const ReusableGrid = ({ left, right }: IReusableGridProps) => {
  return (
    <div className={styles.grid}>
      <div className={styles.left}>{left}</div>
      <div className={styles.right}>{right}</div>
    </div>
  );
};

export default ReusableGrid;
