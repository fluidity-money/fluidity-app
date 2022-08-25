import ReusableGrid from "components/ReusableGrid";
import React from "react";
import styles from "./Roadmap.module.scss";

const Roadmap = () => {
  return (
    <div className={styles.container}>
      <ReusableGrid
        left={<h1>Roadmap</h1>}
        right={<div style={{ fontSize: 160 }}>🦍</div>}
      />
    </div>
  );
};

export default Roadmap;
