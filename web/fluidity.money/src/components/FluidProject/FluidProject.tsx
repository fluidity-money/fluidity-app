import React from "react";
import styles from "./FluidProject.module.scss";

interface IFluidProjectProps {
  title: string;
}

const FluidProject = ({ title }: IFluidProjectProps) => {
  return <div className={styles.container}>{title}</div>;
};

export default FluidProject;
