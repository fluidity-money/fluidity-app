// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

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
