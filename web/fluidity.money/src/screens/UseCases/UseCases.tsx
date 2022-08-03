import React from "react";
import styles from "./UseCases.module.scss";

const UseCases = () => {
  /*
  manual carousel of boxes containing image and text
  */
  return (
    <div
      style={{ display: "flex", flexDirection: "column" }}
      className={styles.container}
    >
      <div>UseCases</div>
      <div>Manual Carousel size of page</div>
    </div>
  );
};

export default UseCases;
