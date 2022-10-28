// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import HowItWorksTemplate from "../../components/HowItWorksTemplate";
import { ReusableGrid } from "@fluidity-money/surfing";
import styles from "./Use.module.scss";
import useViewport from "hooks/useViewport";
import Video from "components/Video";

const Use = () => {
  // to set order correct when in column layout
  const { width } = useViewport();
  const breakpoint = 860;

  const right =
  <HowItWorksTemplate header={header} info={info}>
    Fluid asset use-cases
  </HowItWorksTemplate>

  const left =
  <Video
    src={"/assets/videos/FluidityUse.mp4"}
    type={"fit"}
    loop={true}
  />
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
