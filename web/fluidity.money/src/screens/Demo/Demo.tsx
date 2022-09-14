// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import { useChainContext } from "hooks/ChainContext";
import useViewport from "hooks/useViewport";
import {
  Display,
  GeneralButton,
  Heading,
  Text,
  numberToMonetaryString,
} from "@fluidity-money/surfing";
import Video from "components/Video";
import styles from "./Demo.module.scss";

const Demo = () => {
  const { apiState } = useChainContext();
  const { width } = useViewport();
  const breakpoint = 620;

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
            window.location.origin + "/assets/videos/FluidityOpportunityB.mp4"
          }
          type={"none"}
          loop={true}
        />

        <div>
          <Display
            large={width > breakpoint && true}
            small={width < breakpoint && true}
          >
            {numberToMonetaryString(weekTotalRewards)}
          </Display>
          <Display
            extraSmall={width > breakpoint}
            xxs={width <= breakpoint}
            color={"gray"}
          >
            Fluid prizes claimed in the last week.
          </Display>
          <Text
            size={width > breakpoint ? "xl" : "lg"}
          >
            Connect your wallet to see what you could make.
          </Text>
          <section>
            {/* <GeneralButton version={"primary"} buttonType={"text"} size={"medium"} handleClick={function (): void {       
            } }>
              SHOW ME A DEMO
            </GeneralButton> */}
            <GeneralButton
              version={"secondary"}
              buttonType={"text"}
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
