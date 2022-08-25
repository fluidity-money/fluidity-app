import React from "react";
import styles from "./HowItWorksTemplate.module.scss";

interface ITemplateProps {
  children: string;
  header: string;
  info: string[];
}

const HowItWorksTemplate = ({ children, header, info }: ITemplateProps) => {
  return (
    <div className={styles.content}>
      <h1>{children}</h1>
      <h2>{header}</h2>
      {info.map((paragraph) => (
        <p>{paragraph}</p>
      ))}
    </div>
  );
};

export default HowItWorksTemplate;
