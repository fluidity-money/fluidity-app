import type { ButtonHTMLAttributes } from "react";

import styles from "./GeneralButton.module.scss";

interface IGeneralButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  children: string;
  version: "primary" | "secondary";
  type: "text" | "icon before" | "icon after" | "icon only";
  size: "small" | "medium" | "large";
  handleClick: () => void;
}

const GeneralButton = ({
  children,
  version,
  type,
  size,
  handleClick,
  disabled,
}: IGeneralButtonProps) => {
  return (
    <>
      {version === "primary" && type === "text" ? (
        <button
          onClick={handleClick}
          className={`${styles.primary} ${styles[size]}`}
          disabled={disabled}
        >
          {children.toLocaleUpperCase()}
        </button>
      ) : version === "primary" && type === "icon before" ? (
        <button onClick={handleClick} className={styles.primary} disabled={disabled} >
          {children.toLocaleUpperCase()}
        </button>
      ) : version === "primary" && type === "icon after" ? (
        <button onClick={handleClick} className={styles.primary} disabled={disabled} >
          {children.toLocaleUpperCase()}
        </button>
      ) : type === "icon only" ? (
        <button onClick={handleClick} className={styles.iconOnly}>
          {children}
        </button>
      ) : (
        <button
          onClick={handleClick}
          className={`${styles.secondary} ${styles[size]}`}
          disabled={disabled}
        >
          {children.toLocaleUpperCase()}
        </button>
      )}
    </>
  );
};

export default GeneralButton;
