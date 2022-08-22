import type {ButtonHTMLAttributes} from "react";

import styles from "./TabButton.module.scss";

interface ITabButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size: "default" | "small";
  children: string;
}

const TabButton = ({ children, size, className, ...props }: ITabButtonProps) => {
  const classProps = className || "";

  return (
    <button 
      className={`${styles.button} ${styles[size]} ${classProps}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default TabButton;
