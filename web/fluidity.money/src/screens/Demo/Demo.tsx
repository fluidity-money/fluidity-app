// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import {
  Display,
  GeneralButton,
  Heading,
  numberToMonetaryString,
} from "@fluidity-money/surfing";
import { useChainContext } from "hooks/ChainContext";
import Video from "components/Video";
import styles from "./Demo.module.scss";

const Demo = () => {
  const { apiState } = useChainContext();

  const weekTotalRewards = apiState.weekWinnings.reduce(
    (weekSum, { winning_amount, token_decimals }) =>
      weekSum + winning_amount / 10 ** token_decimals,
    0
  );
  /*
  full screen demo
  */
  return (
    <>
      <div className={`${styles.container} bg-light`}>
        <Video
          src={
            window.location.origin + "/assets/videos/Fluidity_OpportunityB.mp4"
          }
          type={"none"}
          loop={true}
        />

        <div>
          <Display large={true}>
            {numberToMonetaryString(weekTotalRewards)}
          </Display>
          <Heading as="h2" className={styles.gray}>
            Fluid prizes claimed in the last week.
          </Heading>
          <Heading as="h4" className={styles.gray}>
            Connect your wallet to see what you could make
          </Heading>
          <section>
            {/* <GeneralButton version={"primary"} type={"text"} size={"medium"} handleClick={function (): void {       
            } }>
              SHOW ME A DEMO
            </GeneralButton> */}
            <GeneralButton
              version={"secondary"}
              type={"text"}
              size={"medium"}
              handleClick={function (): void {}}
            >
              LAUNCH FLUIDITY
            </GeneralButton>
          </section>
        </div>
      </div>
    </>
  );
};

export default Demo;
