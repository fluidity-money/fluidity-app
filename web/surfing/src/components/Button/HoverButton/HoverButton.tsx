// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import { ButtonHTMLAttributes, useEffect } from "react";

import { useState } from "react";
import { InfoCircle, Tooltip, Text } from "components";
import styles from "./HoverButton.module.scss";
import { AnimatePresence, motion } from "framer-motion";

interface IHoverButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  children: string;
  size: "small" | "medium" | "large" | "xlarge";
  color?: "white" | "gray";
  hoverComp: React.ReactNode;
}

const HoverButton = ({
  children,
  size,
  color = "white",
  className,
  hoverComp,
  ...props
}: IHoverButtonProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const classProps = className || "";

  const buttonColorProps = styles[color];
  const buttonClassProps = `${styles.button} ${buttonColorProps} ${classProps}`;

  const textSizeProps = styles[size];
  const textClassProps = `${styles.text} ${textSizeProps}`;

  useEffect(() => {
    if (isHovered || isFocused) {
      setShowTooltip(true);
      return;
    }

    if (!isHovered) {
      const timer = setTimeout(() => {
        setShowTooltip(false);
      }, 500);
      return () => clearTimeout(timer);
    }

    if (!isFocused) {
      setShowTooltip(false);
      return;
    }
  }, [isHovered, isFocused]);

  return (
    <div style={{ display: "block" }}>
      <button
        className={buttonClassProps}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      >
        <div className={textClassProps}>{children}</div>
        <InfoCircle className={`${styles.icon} ${classProps}`} />
      </button>
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={styles.pseudoBridge}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Tooltip>{hoverComp}</Tooltip>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HoverButton;
