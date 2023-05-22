// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import { motion } from "framer-motion";
import type { ButtonHTMLAttributes } from "react";

import styles from "./TabButton.module.scss";

interface ITabButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size: "default" | "small";
  children: React.ReactNode;
  isSelected?: boolean;
  groupId?: string;
}

const TabButton = ({
  children,
  size,
  className,
  isSelected = false,
  groupId,
  ...props
}: ITabButtonProps) => {
  const classProps = className || "";

  return (
    <button
      className={`${styles.button} ${styles[size]} ${classProps} ${isSelected ? styles.selected : ""}`}
      {...props}
    >
      {children}
      {groupId && isSelected && (
        <motion.div
          className={styles.underline}
          layoutId={groupId}
        />
      )}
    </button>
  );
};

export default TabButton;
