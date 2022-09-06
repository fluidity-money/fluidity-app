// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

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
          .map((category, i) => (
            <h5 key={`cat-${i}`}>{category}</h5>
          ))}
        <h3 style={{ paddingTop: 10 }}>Chain</h3>
        {project.chains
          .filter((x) => x !== "anyChain")
          .map((chain, i) => (
            <h5 key={`chain-${i}`}>{chain}</h5>
          ))}
        <h3 style={{ paddingTop: 10 }}>Year</h3>
        {project.years
          .filter((x) => x !== "anyYear")
          .map((year, i) => (
            <h5 key={`year-${i}`}>{year}</h5>
          ))}
        <h4 style={{ paddingTop: 10 }}>{`Top prize: $${project.topPrize}`}</h4>
      </div>
    </div>
  );
};

export default FluidProject;
