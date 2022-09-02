// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import useViewport from "hooks/useViewport";
import React from "react";
import { GeneralButton } from "../../components/Button";
import ContinuousCarousel from "../../components/ContinuousCarousel";
import FooterItem from "../../components/FooterItem";
import Socials from "../../components/Socials";
import styles from "./Footer.module.scss";

interface IItem {
  title: string;
  src: string;
  type: "internal" | "external";
}

const Footer = () => {
  const { width } = useViewport();
  const firstBreakpoint = 620;
  const secondBreakpoint = 560;
  return (
    <div className={styles.container}>
      <Socials />
      <div className={styles.content}>
        {width < secondBreakpoint && (
          <div>
            <img src="/assets/images/logoOutline.svg" alt="fluidityLogo" />
          </div>
        )}
        <div className={styles.footerItems}>
          <FooterItem items={howItWorks}>How it works</FooterItem>
          <FooterItem items={ecosystem}>Ecosystem</FooterItem>
          <FooterItem items={fluidStats}>Fluid stats</FooterItem>
          <FooterItem items={resources}>Resources</FooterItem>
        </div>
        <div className={styles.communication}>
          <div className={styles.buttons}>
            <GeneralButton
              handleClick={() => {}}
              version={"primary"}
              type={"text"}
              size={
                width > firstBreakpoint
                  ? "large"
                  : width > secondBreakpoint && width < firstBreakpoint
                  ? "medium"
                  : "small"
              }
            >
              LAUNCH FLUIDITY
            </GeneralButton>
            <GeneralButton
              handleClick={() => {}}
              version={"secondary"}
              type={"text"}
              size={
                width > firstBreakpoint
                  ? "large"
                  : width > secondBreakpoint && width < firstBreakpoint
                  ? "medium"
                  : "small"
              }
            >
              LET'S CHAT
            </GeneralButton>
          </div>
          <div className={styles.legal}>
            <div>
              <h6>Terms</h6>
              <h6>Provivacy Poilicy</h6>
            </div>

            <h6>© 2022 Fluidity Money. All Rights Reserved.</h6>
          </div>
        </div>
      </div>

      <div className={styles.carousel}>
        <ContinuousCarousel direction={"right"}>
          <div>
            <div className={styles.text}>USE YIELD WIN FLUIDITY</div>
            <div className={styles.text}>USE YIELD WIN FLUIDITY</div>
            <div className={styles.text}>USE YIELD WIN FLUIDITY</div>
            <div className={styles.text}>USE YIELD WIN FLUIDITY</div>
            <div className={styles.text}>USE YIELD WIN FLUIDITY</div>
            <div className={styles.text}>USE YIELD WIN FLUIDITY</div>
            <div className={styles.text}>USE YIELD WIN FLUIDITY</div>
            <div className={styles.text}>USE YIELD WIN FLUIDITY</div>
            <div className={styles.text}>USE YIELD WIN FLUIDITY</div>
            <div className={styles.text}>USE YIELD WIN FLUIDITY</div>
          </div>
        </ContinuousCarousel>
      </div>
    </div>
  );
};

export default Footer;

const howItWorks: IItem[] = [
  { title: "Fluidity demo", src: "", type: "internal" },
  { title: "Roadmap", src: "", type: "external" },
];

const ecosystem: IItem[] = [
  { title: "DeFi", src: "", type: "internal" },
  { title: "DEX", src: "", type: "internal" },
  { title: "Transactions", src: "", type: "internal" },
  { title: "NFTs", src: "", type: "external" },
];

const fluidStats: IItem[] = [
  { title: "Overview", src: "", type: "internal" },
  { title: "Rewards", src: "", type: "internal" },
  { title: "Transactions", src: "", type: "internal" },
];

const resources: IItem[] = [
  { title: "Articles", src: "", type: "internal" },
  { title: "Fluniversity", src: "", type: "internal" },
  { title: "Whitepapers", src: "", type: "internal" },
  { title: "Documentation", src: "", type: "external" },
];
