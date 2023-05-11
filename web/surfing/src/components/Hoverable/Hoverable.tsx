// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import { ButtonHTMLAttributes, useEffect } from "react";

import { useState } from "react";
import { Tooltip } from "components";
import styles from "./Hoverable.module.scss";
import { AnimatePresence, motion } from "framer-motion";

interface IHoverable extends React.HTMLAttributes<HTMLElement> {
  tooltipContent: React.ReactNode;
}

const Hoverable = ({
  children,
  className='',
  tooltipContent,
  ...props
}: IHoverable) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const classProps = `
    ${styles.Hoverable}
    ${className}
  `;

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
    <div
      className={classProps}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      {...props}
    >
      {children}
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
            <Tooltip>{tooltipContent}</Tooltip>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Hoverable;
