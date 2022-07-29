import React from "react";
import TextButton from "../../components/Button";
import styles from "./Projects.module.scss";

const Projects = () => {
  /*
  image background top 2/3,
  manual carousel at bottom listing projects 
  */
  return (
    <div className={styles.container}>
      <div>Projects</div>
      <TextButton colour="coloured">EXPLORE THE ECOSYSTEM</TextButton>
    </div>
  );
};

export default Projects;
