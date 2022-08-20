import type {ButtonHTMLAttributes} from "react";

import styles from "./AnchorButton.module.scss";

interface IAnchorButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: string;
}

const AnchorButton = ({ children, disabled, className, ...props }: IAnchorButtonProps) => {
  const classProp = className || "";

  return (
    <button className={`${styles.button} ${classProp}`} disabled={disabled} {...props} >
      <img
        className={styles.icon}
        src="/assets/images/buttonIcons/arrowDownWhite.svg"
        alt="anchor button"
      />{" "}
      <div className={styles.text}>{children}</div>
    </button>
  );
};

export default AnchorButton;
