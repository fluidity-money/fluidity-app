// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

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
  className,
  ...props
}: IGeneralButtonProps) => {
  const classProps = className || "";

  return (
    <>
      {version === "primary" && type === "text" ? (
        <button
          onClick={handleClick}
          className={`${styles.primary} ${styles[size]} ${classProps}`}
          disabled={disabled}
          {...props}
        >
          {children}
        </button>
      ) : version === "primary" && type === "icon before" ? (
        <button
          onClick={handleClick}
          className={`${styles.primary} ${classProps}`}
          disabled={disabled}
          {...props}
        >
          {children}
        </button>
      ) : version === "primary" && type === "icon after" ? (
        <button
          onClick={handleClick}
          className={`${styles.primary} ${classProps}`}
          disabled={disabled}
          {...props}
        >
          {children}
        </button>
      ) : type === "icon only" ? (
        <button
          onClick={handleClick}
          className={`${styles.iconOnly} ${classProps}`}
          {...props}
        >
          {children}
        </button>
      ) : (
        // Secondary Buttons are text only
        <button
          onClick={handleClick}
          className={`${styles.secondary} ${styles[size]} ${classProps}`}
          disabled={disabled}
          {...props}
        >
          {children}
        </button>
      )}
    </>
  );
};

export default GeneralButton;
