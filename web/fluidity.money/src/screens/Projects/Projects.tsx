import React from "react";
import { TextButton } from "../../components/Button";
import styles from "./Projects.module.scss";

const Projects = () => {
  /*
  image background top 2/3,
  manual carousel at bottom listing projects 
  */
  return (
    <div
      style={{ display: "flex", flexDirection: "column" }}
      className={styles.container}
    >
      <div>Image Background</div>
      <div>Fluidity Projects</div>
      <div>Manual carousel second half</div>
      <TextButton colour="coloured">EXPLORE THE ECOSYSTEM</TextButton>
    </div>
  );
};

export default Projects;
