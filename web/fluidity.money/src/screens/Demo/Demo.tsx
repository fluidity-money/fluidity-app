// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
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

  /* scrolls to location on pageload if it contains same ID or scrolls to the top
   for ResourcesNavModal to work*/
  const location = useLocation();
  useEffect(() => {
    if (location.hash) {
      let elem = document.getElementById(location.hash.slice(1));
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  }, [location]);

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

        <div id="demo">
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
             <img
              src="assets/images/Animations/ComingSoon.webp"
              className={styles.comingSoonButton}
              alt="Coming-Soon"
            />
          </section>
        </div>
      </div>
    </>
  );
};

export default Demo;
