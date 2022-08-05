import React from "react";
import styles from "./Navigation.module.scss";

const Navigation = () => {
  return (
    <div className={styles.container}>
      <h4>
        <a href="#articles">↓ Artlices</a>
      </h4>
      <h4>
        <a href="#fluniversity">↓ Fluinversity</a>
      </h4>
      <h4>
        <a href="#whitepapers">↓ Whitepapers</a>
      </h4>
      <h4>
        <a href="#docs">↓ Docs</a>
      </h4>
    </div>
  );
};

export default Navigation;
