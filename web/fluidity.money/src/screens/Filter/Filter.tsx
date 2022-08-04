import React from "react";
import FIlterCriteria from "../../components/FilterCriteria";
import FluidProject from "../../components/FluidProject";
import styles from "./Filter.module.scss";

const Filter = () => {
  return (
    <div className={styles.container}>
      <h1>Fluid projects</h1>
      <div className={styles.main}>
        <div className={styles.left}>
          <div className={styles.top}>Filter</div>
          <FIlterCriteria options={categories}>CATEGORIES</FIlterCriteria>
          <FIlterCriteria options={chains}>CHAIN</FIlterCriteria>
          <FIlterCriteria options={years}>YEAR</FIlterCriteria>
        </div>
        <div className={styles.right}>
          <div className={styles.top}>
            <div>1 - 21 of 21 Projects</div>
            <div>Sort by Top Prize $$$ v</div>
          </div>
          <div className={styles.grid}>
            {projects.map((project) => (
              <FluidProject title={project.title} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filter;

const categories = [
  "ANY",
  "DEFI",
  "DEX",
  "NFT",
  "GAMING",
  "PAYMENTS",
  "METAVERSE",
  "DAO",
];

const chains = ["ANY", "SOLANA", "POLYGON", "ETHEREUM"];

const years = ["ANY", "2020", "2021", "2022"];

const projects = [
  { title: "🦍" },
  { title: "🦍" },
  { title: "🦍" },
  { title: "🦍" },
  { title: "🦍" },
  { title: "🦍" },
  { title: "🦍" },
  { title: "🦍" },
  { title: "🦍" },
  { title: "🦍" },
  { title: "🦍" },
  { title: "🦍" },
  { title: "🦍" },
  { title: "🦍" },
  { title: "🦍" },
  { title: "🦍" },
  { title: "🦍" },
  { title: "🦍" },
  { title: "🦍" },
  { title: "🦍" },
  { title: "🦍" },
];
