// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import useViewport from "hooks/useViewport";
import { ContinuousCarousel, Card, Heading } from "@fluidity-money/surfing";
import Partner from "components/Partner";
import styles from "./SponsorsPartners.module.scss";
import { useEffect, useState } from "react";

const SponsorsPartners = () => {
  /*
  vertical continuously flowing carousel of boxes containing sponsor and partner logo/name,
  on hover, more info is provided
  */
  // to set order correct when in column layout
  const partners = [
    {
      img: "/assets/images/Partners/circle-icon-inset-300.png",
      url: "https://www.circle.com/en/",
      title: "Circle ",
      info: "Circle is a global internet finance company built on blockchain technology and powered by crypto assets.",
    },
    {
      img: "/assets/images/Partners/Multicoin.png",
      url: "https://multicoin.capital",
      title: "Multicoin Capital",
      info: "Multicoin Capital is a thesis-driven cryptofund that invests long term in tokens that reshape entire sectors of the global economy.",
    },
    {
      img: "/assets/images/Partners/Solana.png",
      url: "https://solana.ventures",
      title: "Solana Ventures",
      info: "Solana Ventures' mission is to accelerate the growth of the Solana blockchain and adjacent ecosystems by providing capital to the most promising teams building in the crypto ecosystem.",
    },
    {
      img: "/assets/images/Partners/Lemniscap.png",
      url: "https://lemniscap.com",
      title: "Lemniscap",
      info: "Lemniscap is an investment firm specializing in investments in emerging cryptoassets and blockchain companies",
    },
    {
      img: "/assets/images/Partners/aave-aave-logo.png",
      url: "https://aave.com",
      title: "Aave",
      info: "Aave is a decentralized non-custodial liquidity protocol where users can participate as depositors or borrowers",
    },
  
    {
      img: "/assets/images/Partners/Compound.png",
      url: "https://compound.finance",
      title: "Compound",
      info: "Compound is an algorithmic, autonomous interest rate protocol built for developers, to unlock a universe of open financial applications. ",
    },
    {
      img: "/assets/images/Partners/JupiterAggregator.jpg",
      url: "https://jup.ag",
      title: "Jupiter",
      info: "Jupiter is the key liquidity aggregator for Solana, offering the widest range of tokens and best route discovery between any token pair.",
    },
    {
      img: "/assets/images/Partners/maker-mkr-logo.png",
      url: "https://makerdao.com",
      title: "MakerDAO",
      info: "MakerDAO enables the generation of Dai, the world's first unbiased currency and leading decentralized stablecoin.",
    },
    {
      img: "/assets/images/Partners/ALdrin.svg",
      url: "https://aldrin.com",
      title: "Aldrin",
      info: "Aldrin is a decentralized exchange whose mission is to simplify DeFi and create powerful tools to help all traders succeed, leading to more equality.",
    },
  
    {
      img: "/assets/images/Partners/DODO.png",
      url: "https://dodoex.io",
      title: "DODO",
      info: "DODO is a decentralized exchange that uses the innovative algorithms to provide efficient on-chain liquidity for Web3 assets.",
    },
    {
      img: "/assets/images/Partners/Orca.svg",
      url: "https://www.orca.so",
      title: "Orca",
      info: "Orca is the easiest, fastest, and most user-friendly cryptocurrency exchange on the Solana blockchain.",
    },
    {
      img: "/assets/images/Partners/Saber.png",
      url: "https://app.saber.so/swap",
      title: "Saber",
      info: "Saber is an automated market maker for trading assets on Solana.",
    },
 
  ];

  const { width } = useViewport();
  const breakpoint = 660;
   //Note: every value rep is in pixel
  //Using collision detection to organise posiitons so cards don't overlap.
  // Used for desktop view only since cards appear linearly on mobile.
  /*
                  Top
        ----------------------|
        |                     |
        |                     |
  Left  |                     |  Left + Width
        |                     |
        |                     |
        |----------------------
              Top + Height
  */
  let prevTop = 0;
  let prevLeft = 0;
  let tolerance = 20;
  //when box height and width is changed these needs to be changed too :)
  const boxHeight = 250;
  const boxWidth = 300;

  const partnerCards = partners.map((partner, i) => {
    let top = Math.floor(Math.random() * ((boxHeight - tolerance) - 1) + 1);
    let left = Math.floor(Math.random() * ((width - (width - 1180)) - 1) + 1);

    if(prevTop > 0 && prevLeft > 0) {
     
      while(true) {
        // Check for Collision along X-axis
        if( (left < (prevLeft + boxWidth + tolerance) && (left + boxWidth + tolerance) > prevLeft) == false ) {
          break;
        }

        // Check for Collision along Y-axis
        if ((top < (prevTop + boxHeight + tolerance) && (top + boxHeight + tolerance) > prevTop) == false) {
          break;
        }

        //If it gets here - a collision occured generate another set of randoms. then loop again to check along every axis if this is valid.
        top = Math.floor(Math.random() * ((boxHeight - tolerance) - 1) + 1);
        left = Math.floor(Math.random() * ((width - (width - 1180)) - 1) + 1);
      }
    }
  
    prevTop = top;
    prevLeft = left;
    
    const filter = Math.floor(Math.random() * (21 - 1) + 1) >= 17 ? 'blur(3px)' : 'blur(0px)'
    const opacity = filter === 'blur(3px)' ? '0.6' : '1.0';
    return(
          width > 960 ? (
          <Card
          rounded={true}
          type={"transparent"}
          key={`sponsor-${i}`}
          className={styles.card}
          style={{
            position: "relative",
            display: "block",
            top: `${top}px`,
            left: `${left}px`,
            filter: filter,
            opacity: opacity
          }}
          >
            <Partner
              img={partner.img}
              title={partner.title}
              info={partner.info}
              url={partner.url}
            />
          </Card>) :
          (
            <Card
            rounded={true}
            type={"transparent"}
            key={`sponsor-${i}`}
            className={styles.card}
            style={{
              position: "relative",
              display: "block",
              top: `0px`,
              left: `${(width * 0.5) - boxWidth * 0.5}px`, // places it at the centre;
            }}
          >
            <Partner
              img={partner.img}
              title={partner.title}
              info={partner.info}
              url={partner.url}
            />
          </Card>)
    );})
 
  return (
    <div className={`${styles.container} bg-dark`}>
      <Heading as="h1" className={styles.SPtext}>{"Partners & Investors"}</Heading>
      <div style={{ display: "flex", width: "100%", justifyContent:"center", overflowY: "hidden" }}>
        <ContinuousCarousel direction="up">
          <div
            style={{
              width: "100%",
              // position: "relative",
              // display: "block",
              // top: `${Math.floor((Math.random() - 0.5) * 500)}px`,
              // left: `${Math.floor((Math.random() - 0.6) * 900)}px`,
            }}
          >
            {
              partnerCards
            }
          </div>
        </ContinuousCarousel>
      </div>
    </div>
  );
}

export default SponsorsPartners;