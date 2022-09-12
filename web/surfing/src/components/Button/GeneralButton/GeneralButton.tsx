// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import type { ButtonHTMLAttributes } from "react";

import styles from "./GeneralButton.module.scss";

type GeneralButtonText = {
  buttonType: "text",
}

type GeneralButtonLogo = {
  icon: React.ReactNode,
  buttonType: "icon before" | "icon after" | "icon only",
}

export type IGeneralButtonProps = 
ButtonHTMLAttributes<HTMLButtonElement> &
(GeneralButtonText | GeneralButtonLogo) & 
{
  version: "primary" | "secondary";
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
  
  const { buttonType } = props as GeneralButtonText | GeneralButtonLogo
  
  if (buttonType == "text") {
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
      {buttonType === "icon before" ? (
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
      ) : buttonType === "icon after" ? (
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
          className={`${styles.iconOnly} ${classProps}`}
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
