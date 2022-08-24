import React, { ReactNode } from "react";
import styles from "./IntroTile.module.scss";

interface IIntroTileProps {
  children: ReactNode;
  type: "star" | "ellipse";
  side: "left" | "right";
}

const IntroTile = ({ type, side, children }: IIntroTileProps) => {
  return (
    <div className={styles.container}>
      {side === "left" && (
        <img
          src={
            type === "star"
              ? "/assets/images/ellipse.svg"
              : "/assets/images/ellipse.svg"
          }
          alt=""
        />
      )}

      <div className={`${styles.text} ${styles[side]}`}>{children}</div>
      {side === "right" && (
        <img
          src={
            type === "star"
              ? "/assets/images/ellipse.svg"
              : "/assets/images/ellipse.svg"
          }
          alt=""
        />
      )}
    </div>
  );
};

export default IntroTile;
