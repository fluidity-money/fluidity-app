// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import { GeneralButton } from "surfing";
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
            <GeneralButton version={"primary"} type={"text"} size={"medium"} handleClick={function (): void {       
            } }>
              SHOW ME A DEMO
            </GeneralButton>
            <GeneralButton version={"secondary"} type={"text"} size={"medium"} handleClick={function (): void {
            } }>
              LAUNCH FLUIDITY
            </GeneralButton>  
          </section>   
        </div>
      </div>
    </>
  );
};

export default Demo;
