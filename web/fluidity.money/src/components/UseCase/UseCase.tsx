import React from "react";
import styles from "./UseCase.module.scss";

interface UseCaseProps {
  useCase: {
    img: string;
    title: string;
    info: string;
  };
}

const UseCase = ({ useCase }: UseCaseProps) => {
  return (
    <div className={styles.container}>
      <img src={useCase.img} alt="text representation" />
      <div className={styles.text}>
        <h2>{useCase.title}</h2>
        <p>{useCase.info}</p>
      </div>
    </div>
  );
};

export default UseCase;
