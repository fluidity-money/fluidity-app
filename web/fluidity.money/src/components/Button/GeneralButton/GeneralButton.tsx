import React from "react";
import styles from "./GeneralButton.module.scss";

interface IGeneralButtonProps {
  children: string;
  version: "primary" | "secondary";
  type: "text" | "icon before" | "icon after" | "icon only";
  size: "small" | "medium" | "large";
  onClick?: () => void;
}

const GeneralButton = ({
  children,
  version,
  type,
  size,
  onClick,
}: IGeneralButtonProps) => {
  return (
    <>
      {version === "primary" && type === "text" ? (
        <button
          onClick={onClick}
          className={`${styles.primary} ${styles[size]}`}
        >
          {children.toLocaleUpperCase()}
        </button>
      ) : version === "primary" && type === "icon before" ? (
        <button onClick={onClick} className={styles.primary}>
          {children.toLocaleUpperCase()}
        </button>
      ) : version === "primary" && type === "icon after" ? (
        <button onClick={onClick} className={styles.primary}>
          {children.toLocaleUpperCase()}
        </button>
      ) : type === "icon only" ? (
        <button onClick={onClick} className={styles.iconOnly}>
          {children}
        </button>
      ) : (
        <button
          onClick={onClick}
          className={`${styles.secondary} ${styles[size]}`}
        >
          {children.toLocaleUpperCase()}
        </button>
      )}
    </>
  );
};

export default GeneralButton;
