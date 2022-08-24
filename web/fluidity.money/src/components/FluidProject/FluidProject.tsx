import React from "react";
import styles from "./FluidProject.module.scss";

interface IProject {
  title: string;
  categories: string[];
  chains: string[];
  years: string[];
  topPrize: number;
}

interface IFluidProjectProps {
  project: IProject;
}

const FluidProject = ({ project }: IFluidProjectProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2>{project.title}</h2>
        <h3 style={{ paddingTop: 15 }}>Categories</h3>
        {project.categories
          .filter((x) => x !== "anyCat")
          .map((category) => (
            <h5>{category}</h5>
          ))}
        <h3 style={{ paddingTop: 10 }}>Chain</h3>
        {project.chains
          .filter((x) => x !== "anyChain")
          .map((chain) => (
            <h5>{chain}</h5>
          ))}
        <h3 style={{ paddingTop: 10 }}>Year</h3>
        {project.years
          .filter((x) => x !== "anyYear")
          .map((year) => (
            <h5>{year}</h5>
          ))}
        <h4 style={{ paddingTop: 10 }}>{`Top prize: $${project.topPrize}`}</h4>
      </div>
    </div>
  );
};

export default FluidProject;
