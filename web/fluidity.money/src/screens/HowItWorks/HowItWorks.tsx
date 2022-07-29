import React from "react";
import TextButton from "../../components/Button";
import styles from "./HowItWorks.module.scss";

const HowItWorks = () => {
  /* 3 paragraphs on the left, 
  image on the right,
  paragraph highlighted has different specific image,
  scrolls thought automatically and constantly
   */
  return (
    <div className={styles.container}>
      <TextButton colour="white">MORE ON HOW IT WORKS</TextButton>
    </div>
  );
};

export default HowItWorks;
