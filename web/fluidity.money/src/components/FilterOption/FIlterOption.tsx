import React from "react";
import styles from "./FilterOption.module.scss";

interface IFilterOptionProps {
  name: string;
}

const FIlterOption = ({ name }: IFilterOptionProps) => {
  return <div className={styles.option}>{name}</div>;
};

export default FIlterOption;
