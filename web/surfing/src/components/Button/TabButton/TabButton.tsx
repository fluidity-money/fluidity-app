// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import type { ButtonHTMLAttributes } from "react";

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
