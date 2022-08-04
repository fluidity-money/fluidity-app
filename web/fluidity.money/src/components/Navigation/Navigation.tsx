import React from "react";
import styles from "./Navigation.module.scss";

const Navigation = () => {
  return (
    <div className={styles.container}>
      <h4>↓ Artlices</h4>
      <h4>↓ Fluinversity</h4>
      <h4>↓ Whitepapers</h4>
      <h4>↓ Docs</h4>
    </div>
  );
};

export default Navigation;
