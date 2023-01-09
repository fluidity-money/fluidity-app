// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import type { ButtonHTMLAttributes } from "react";

import styles from "./GeneralButton.module.scss";

type GeneralButtonText = {
  buttontype: "text",
}

type GeneralButtonLogo = {
  icon: React.ReactNode,
  buttontype: "icon before" | "icon after" | "icon only",
}

export type IGeneralButtonProps = 
ButtonHTMLAttributes<HTMLButtonElement> &
(GeneralButtonText | GeneralButtonLogo) & 
{
  version: "primary" | "secondary" | "transparent";
  size: "small" | "medium" | "large";
  handleClick: () => void;
}

const GeneralButton = ({
  children,
  version,
  size,
  handleClick,
  disabled,
  className,
  ...props
}: IGeneralButtonProps) => {
  const classProps = className || "";
  
  const { buttontype } = props as GeneralButtonText | GeneralButtonLogo
  
  if (buttontype == "text") {
    return (
      <button
        onClick={handleClick}
        className={`${styles[version]} ${styles[size]} ${classProps}`}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  };

  return (
    <>
      {buttontype === "icon before" ? (
        <button
          onClick={handleClick}
          className={`${styles[version]} ${styles[size]} ${classProps}`}
          disabled={disabled}
          {...props}
        >
          <div className={styles.icon}>
            {(props as GeneralButtonLogo).icon}
          </div>
          {" "}{children}
        </button>
      ) : buttontype === "icon after" ? (
        <button
          onClick={handleClick}
          className={`${styles[version]} ${styles[size]} ${classProps}`}
          disabled={disabled}
          {...props}
        >
          {children}{" "}
          <div className={styles.icon}>
            {(props as GeneralButtonLogo).icon}
          </div>
        </button>
      ) : (
        <button
          onClick={handleClick}
          className={`${styles[version]} ${styles[size]} ${styles.iconOnly} ${classProps}`}
          {...props}
        >
          <div className={styles.icon}>
            {(props as GeneralButtonLogo).icon}
          </div>
        </button>
      )}
    </>
  );
};

export default GeneralButton;
