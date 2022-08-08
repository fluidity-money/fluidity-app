import React from "react";
import { TextButton } from "../../components/Button";
import ContinuousCarousel from "../../components/ContinuousCarousel";
import FooterItem from "../../components/FooterItem";
import Socials from "../../components/Socials";
import styles from "./Footer.module.scss";

const Footer = () => {
  /*
  data,
  continuous carousel at the bottom of large text
   */
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.footerItems}>
          <FooterItem items={howItWorks}>How it works</FooterItem>
          <FooterItem items={ecosystem}>Ecosystem</FooterItem>
          <FooterItem items={fluidStats}>Fluid stats</FooterItem>
          <FooterItem items={resources}>Resources</FooterItem>
        </div>
        <div className={styles.communication}>
          <div className={styles.buttons}>
            <TextButton colour={"white"}>LAUNCH FLUIDITY</TextButton>
            <TextButton colour={"black"}>LET'S CHAT</TextButton>
          </div>
          <div className={styles.legal}>
            <h6>Terms</h6>
            <h6>Provivacy Poilicy</h6>
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

const howItWorks = [
  { title: "Fluidity demo", src: "", type: "arrow" },
  { title: "Roadmap", src: "", type: "box" },
];

const ecosystem = [
  { title: "DeFi", src: "", type: "arrow" },
  { title: "DEX", src: "", type: "arrow" },
  { title: "Transactions", src: "", type: "arrow" },
  { title: "NFTs", src: "", type: "box" },
];

const fluidStats = [
  { title: "Overview", src: "", type: "arrow" },
  { title: "Rewards", src: "", type: "arrow" },
  { title: "Transactions", src: "", type: "arrow" },
];

const resources = [
  { title: "Articles", src: "", type: "arrow" },
  { title: "Fluniversity", src: "", type: "arrow" },
  { title: "Whitepapers", src: "", type: "arrow" },
  { title: "Documentation", src: "", type: "box" },
];
