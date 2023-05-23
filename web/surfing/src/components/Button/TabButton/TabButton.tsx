// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import { motion } from "framer-motion";
import { ButtonHTMLAttributes, forwardRef } from "react";

import styles from "./TabButton.module.scss";

interface ITabButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size: "default" | "small";
  children: React.ReactNode;
  isSelected?: boolean;
  groupId?: string;
}

type IRef = HTMLButtonElement;

const TabButton = forwardRef<IRef, ITabButtonProps>(({
  children,
  size,
  className,
  isSelected = false,
  groupId,
  ...props
}, ref) => {
  const classProps = className || "";

  return (
    <button
      ref={ref}
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
});

export default TabButton;
