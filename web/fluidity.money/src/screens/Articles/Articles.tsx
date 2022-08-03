import React from "react";
import { TextButton } from "../../components/Button";
import styles from "./Articles.module.scss";

const Articles = () => {
  return (
    <div className={styles.container}>
      <TextButton colour="coloured">ALL ARTICLES</TextButton>
    </div>
  );
};

export default Articles;
