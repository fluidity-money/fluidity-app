import React from "react";
import styles from "./TabButton.module.scss";

interface ITabButtonProps {
  size: "default" | "small";
  children: string;
}

const TabButton = ({ children, size }: ITabButtonProps) => {
  return (
    <button className={`${styles.button} ${styles[size]}`}>{children}</button>
  );
};

export default TabButton;
