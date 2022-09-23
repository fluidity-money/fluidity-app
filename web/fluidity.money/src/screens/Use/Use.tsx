// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import HowItWorksTemplate from "../../components/HowItWorksTemplate";
import { ReusableGrid } from "@fluidity-money/surfing";
import styles from "./Use.module.scss";
import useViewport from "hooks/useViewport";

const Use = () => {

  // to set order correct when in column layout
  const { width } = useViewport();
  const breakpoint = 860;

  const right = (
    <HowItWorksTemplate header={header} info={info}>
      Fluid asset use-cases
    </HowItWorksTemplate>
  );

  const left = width <= breakpoint ? (
    <img
    src="/assets/images/Animations/FluidityUse.webp"
    style={{
      position: "relative",
      width: "200%",
    }}
    alt="Fluidity-Use"
  />
  ): (
    <img
      src="/assets/images/Animations/FluidityUse.webp"
      style={{
        position: "relative",
      }}
      alt="Fluidity-Use"
    />
  );

  return (
    <div className={styles.container} id="useassets">
      <ReusableGrid left={left} right={right} />
    </div>
  );
};

export default Use;

const header = " Fluid assets apportion yield when utilized on-chain.  ";

const info = [
  "Fluidity is realigning incentives by rewarding utility and usage. Fluid assets are composable by nature and can successfully promote both user and platform engagement through its novel reward distribution mechanisms. The fluid ecosystem also allows developers to compose how and when these rewards are distributed.  ",
  "Use cases include marketplaces, decentralized exchanges, and any use-case where tokens are transacted on chain.",
];
