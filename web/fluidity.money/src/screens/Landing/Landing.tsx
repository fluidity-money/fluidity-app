import React from "react";
import styles from "./Landing.module.scss";

const Landing = () => {
  /* onClick and onScroll background overlayer has to increase until not visible,
    original text has to fade out,
    new text has to fade in,
    slide up,
    manual carousel then slides in from the right
    */
  return (
    <div className={styles.container}>
      <h2>MONEY DESIGNED TO BE MOVED</h2>
    </div>
  );
};

export default Landing;
