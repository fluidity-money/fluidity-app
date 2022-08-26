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
        <button onClick={onClick} className={styles.white}>
          {children}
        </button>
      ) : colour === "black" ? (
        <button onClick={onClick} className={styles.black}>
          {children}
        </button>
      ) : (
        <button onClick={onClick} className={styles.coloured}>
          <span className={styles.inner}>{children}</span>
        </button>
      )}
    </>
  );
};

export default TextButton;
