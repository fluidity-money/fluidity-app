// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ContinuousCarousel, Heading, Text } from "@fluidity-money/surfing";
import styles from "./Whitepapers.module.scss";

const Whitepapers = () => {

  const callout = (
    <div className={styles.callout}>
      <Heading hollow={true} as="h4" className={styles.text}>
        WHITEPAPERS WHITEPAPERS
      </Heading>
      <Heading as="h4" className={styles.text}>
        WHITEPAPERS
      </Heading>
    </div>
  );

  return (
    <div id="whitepapers">
      <div className={styles.carousel}>
        <ContinuousCarousel direction={"right"}>
          <div>
            {callout}
            {callout}
            {callout}
            {callout}
            {callout}
            {callout}
            {callout}
            {callout}
            {callout}
            {callout}
            {callout}
          </div>
        </ContinuousCarousel>
      </div>
      <div className={styles.container}>
        <a href="https://whitepapers.fluidity.money/fluidity-economics-wp-v0.8.pdf">
          <div>
            <img src="/assets/images/resources/flu-whitepaper.webp" />
            <Heading as="h3">
              Fluidity Money: Economics and Monetary Policy
            </Heading>
            <Text prominent={true}>
              24th June 2022 <b>WHITEPAPER</b>
            </Text>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Whitepapers;
