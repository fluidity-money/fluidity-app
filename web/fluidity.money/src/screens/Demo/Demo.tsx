import React from "react";
import { TextButton } from "../../components/Button";
import styles from "./Demo.module.scss";

const Demo = () => {
  /*
  full screen demo
  */
  return (
    <div className={`${styles.container} bg-light`}>
      <TextButton colour="white">SHOW ME A DEMO</TextButton>
      <TextButton colour="black">LAUNCH FLUIDITY</TextButton>
    </div>
  );
};

export default Demo;
