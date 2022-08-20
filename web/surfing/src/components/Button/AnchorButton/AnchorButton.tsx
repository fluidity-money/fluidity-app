import type {ButtonHTMLAttributes} from "react";

import {ReactComponent as ArrowDown} from "/assets/images/buttonIcons/arrowDownWhite.svg";
import styles from "./AnchorButton.module.scss";

interface IAnchorButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const AnchorButton = ({ children, disabled, className, ...props }: IAnchorButtonProps) => {
  const classProp = className || "";

  return (
    <button className={`${styles.button} ${classProp}`} disabled={disabled} {...props} >
      <ArrowDown className={styles.icon} />{" "}
      <div className={styles.text}>{children}</div>
    </button>
  );
};

export default AnchorButton;
