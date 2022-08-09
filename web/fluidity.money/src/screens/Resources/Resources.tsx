import React from "react";
import { TextButton } from "../../components/Button";
import Socials from "../../components/Socials";
import styles from "./Resources.module.scss";

const Resources = () => {
  /*
  big article and image top left,
  small top right,
  3 listed below across screen
  */
  return (
    <div
      style={{ display: "flex", flexDirection: "column" }}
      className={styles.container}
    >
      <div>RESOURCES</div>
      <div style={{ display: "flex" }}>
        <Socials />
        <TextButton colour="coloured">MORE RESOURCES</TextButton>
      </div>
      <div>large Image with title and text top left</div>
      <div>
        small same size images, 1 top right, 3 below across whole screen evenly
      </div>
    </div>
  );
};

export default Resources;
