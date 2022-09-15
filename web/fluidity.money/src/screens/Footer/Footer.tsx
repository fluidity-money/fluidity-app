// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import useViewport from "hooks/useViewport";
import Socials from "../../components/Socials";
import {
  ContinuousCarousel,
  GeneralButton,
  FooterItem,
  Text,
  Heading,
} from "@fluidity-money/surfing";
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

  const callout = (
    <div className={styles.callout}>
      <Heading hollow={true} as="h4" className={styles.text}>
        USE YIELD WIN
      </Heading>
      <Heading as="h4" className={styles.text}>
        FLUIDITY
      </Heading>
    </div>
  );

  return (
    <div className={styles.container}>
      <Socials />
      <div className={styles.content}>
        {width < secondBreakpoint && (
          <div className={styles.imgContainer}>
            <img src="/assets/images/logoOutline.png" alt="home page" />
          </div>
        )}
        <div className={styles.footerItems}>
          <FooterItem items={howItWorks}>How it works</FooterItem>
          {/* <FooterItem items={ecosystem}>Ecosystem</FooterItem>
          <FooterItem items={fluidStats}>Fluid stats</FooterItem> */}
          <FooterItem items={resources}>Resources</FooterItem>
        </div>
        <div className={styles.communication}>
          <div className={styles.buttons}>
            <GeneralButton
              handleClick={() => {}}
              version={"primary"}
              buttonType={"text"}
              size={
                width > firstBreakpoint
                  ? "medium"
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
              buttonType={"text"}
              size={
                width > firstBreakpoint
                  ? "medium"
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
              <a href={"#"}>
                <Text as="p" size="xs">
                  <u>
                    Terms
                  </u>
                </Text>
              </a>
              <a href={"#"}>
                <Text as="p" size="xs">
                  <u>
                    Privacy Policy
                  </u>
                </Text>
              </a>
            </div>

            <Text as="p" size="xs">
              © 2022 Fluidity Money. All Rights Reserved.
            </Text>
          </div>
        </div>
      </div>

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
    </div>
  );
};

export default Footer;

const howItWorks: IItem[] = [{ title: "Roadmap", src: "", type: "external" }];

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
  { title: "Documentation", src: "https://docs.fluidity.money/", type: "external" },
];
