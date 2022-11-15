// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import React from "react";
import styles from "./GeneralButton.module.scss";

interface IGeneralButtonProps {
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
}: IGeneralButtonProps) => {
  return (
    <>
      {version === "primary" && type === "text" ? (
        <button
          onClick={handleClick}
          className={`${styles.primary} ${styles[size]}`}
        >
          {children.toLocaleUpperCase()}
        </button>
      ) : version === "primary" && type === "icon before" ? (
        <button onClick={handleClick} className={styles.primary}>
          {children.toLocaleUpperCase()}
        </button>
      ) : version === "primary" && type === "icon after" ? (
        <button onClick={handleClick} className={styles.primary}>
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
        >
          {children.toLocaleUpperCase()}
        </button>
      )}
    </>
  );
};

export default GeneralButton;
