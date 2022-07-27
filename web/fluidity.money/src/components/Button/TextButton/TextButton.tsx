import React from "react";
import styles from "./TextButton.module.scss";

interface ITextButtonProps {
  children: string;
  colour: string;
}

const TextButton = ({ children, colour }: ITextButtonProps) => {
  return (
    <>
      {colour === "white" ? (
        <button className={styles.white}>{children}</button>
      ) : colour === "black" ? (
        <button className={styles.black}>{children}</button>
      ) : (
        <button className={styles.coloured}>{children}</button>
      )}
    </>
  );
};

export default TextButton;
