// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import { GeneralButton, numberToMonetaryString } from "surfing";
import { useChainContext } from "hooks/ChainContext";
import styles from "./Demo.module.scss";

const Demo = () => {
  const { apiState } = useChainContext();
  const weekTotalRewards = apiState.weekWinnings
    .reduce((weekSum, { winning_amount, token_decimals }) => weekSum + (winning_amount / 10 ** token_decimals), 0)
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
          <h1>{numberToMonetaryString(weekTotalRewards)}</h1>
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
