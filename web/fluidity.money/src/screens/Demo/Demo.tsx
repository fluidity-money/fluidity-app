import React from "react";
import { TextButton } from "../../components/Button";
import styles from "./Demo.module.scss";

const Demo = () => {
  /*
  full screen demo
  */
  return (
    <>
      <div className={`${styles.container} bg-light`}>
        <video  autoPlay muted loop className={styles.demoVideo}>
          <source src={window.location.origin + '/assets/videos/sample.mp4'} type="video/mp4"/>   
        </video>
        <div>
          <h1>$48, 907.50</h1>
          <h3>Fluid prizes claimed in the last week.</h3>
          <p>Connect your wallet to see what you could make</p>
          <section>
            <TextButton colour="white">SHOW ME A DEMO</TextButton>
            <TextButton colour="black">LAUNCH FLUIDITY</TextButton>  
          </section>   
        </div>
      </div>
    </>
  );
};

export default Demo;
