import React from "react";
import styles from "./LinkButton.module.scss";

interface ILinkButtonProps {
  children: string;
  size: "small" | "medium" | "large";
  type: "internal" | "external";
  handleClick: () => void;
}

const LinkButton = ({
  children,
  size,
  type,
  handleClick,
}: ILinkButtonProps) => {
  return (
    <button className={styles.button} onClick={handleClick}>
      <div className={`${styles.text} ${styles[size]}`}>
        {children.toUpperCase()}
      </div>
      <img
        className={styles.icon}
        src={
          type === "external"
            ? "/assets/images/buttonIcons/arrowTopRightWhite.svg"
            : "/assets/images/buttonIcons/arrowRightWhite.svg"
        }
        alt="link icon"
      />
    </button>
  );
};

export default LinkButton;
