import React from "react";
import TextButton from "../../components/Button";
import styles from "./Resources.module.scss";

const Resources = () => {
  /*
  big article and image top left,
  small top right,
  3 listed below across screen
  */
  return (
    <div className={styles.container}>
      <div>Resources</div>
      <TextButton colour="coloured">MORE RESOURCES</TextButton>
    </div>
  );
};

export default Resources;
