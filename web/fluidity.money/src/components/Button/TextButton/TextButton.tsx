// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import React from "react";
import styles from "./TextButton.module.scss";

interface ITextButtonProps {
  children: string;
  colour: string;
  onClick?: () => void;
}

const TextButton = ({ children, colour, onClick }: ITextButtonProps) => {
  return (
    <>
      {colour === "white" ? (
        <button onClick={onClick} className={`${styles.TextButton} ${styles.white}`}>
          {children}
        </button>
      ) : colour === "black" ? (
        <button onClick={onClick} className={`${styles.TextButton} ${styles.black}`}>
          {children}
        </button>
      ) : (
        <button onClick={onClick} className={`${styles.TextButton} ${styles.coloured}`}>
          <span className={styles.inner}>{children}</span>
        </button>
      )}
    </>
  );
};

export default TextButton;
