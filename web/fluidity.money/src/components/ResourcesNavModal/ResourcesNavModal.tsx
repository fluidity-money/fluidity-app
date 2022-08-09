import React from "react";
import { Link } from "react-router-dom";
import styles from "./ResourcesNavModal.module.scss";

const ResourcesNavModal = () => {
  // if page is alredy on resources href id only otherwise switch page and then id
  return (
    <div className={styles.container}>
      <h4>
        <Link to="/resources#articles">{"Articles >"}</Link>
      </h4>
      <h4>
        <Link to="/resources#fluniversity">{"Fluniversity >"}</Link>
      </h4>
      <h4>
        <Link to="/resources#whitepapers">{"Whitepapers >"}</Link>
      </h4>
      <h4>
        <Link to="/resources#docs">{"Documentation [>]"}</Link>
      </h4>
    </div>
  );
};

export default ResourcesNavModal;
