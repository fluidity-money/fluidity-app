import React from "react";
import styles from "./ResourcesNavModal.module.scss";

const ResourcesNavModal = () => {
  // if page is alredy on resources href id only otherwise switch page and then id
  return (
    <div className={styles.container}>
      <h4>
        <a href="/resources#articles">{"Articles >"}</a>
      </h4>
      <h4>
        <a href="/resources#fluniversity">{"Fluniversity >"}</a>
      </h4>
      <h4>
        <a href="/resources#whitepapers">{"Whitepapers >"}</a>
      </h4>
      <h4>
        <a href="/resources#docs">{"Documentation [>]"}</a>
      </h4>
    </div>
  );
};

export default ResourcesNavModal;
