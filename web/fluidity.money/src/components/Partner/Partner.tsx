import React from "react";
import styles from "./Partner.module.scss";

interface IPropsPartner {
  img: string;
  title: string;
  info: string;
}

const Partner = ({ img, title, info }: IPropsPartner) => {
  return (
    <div className={styles.container}>
      <div>{img}</div>
      <h3>{title}</h3>
      <p>{info}</p>
    </div>
  );
};

export default Partner;
