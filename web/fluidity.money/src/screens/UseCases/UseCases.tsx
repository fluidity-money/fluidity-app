// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import { Display, ManualCarousel } from "@fluidity-money/surfing";
import UseCase from "components/UseCase";
import useViewport from "hooks/useViewport";
import styles from "./UseCases.module.scss";

const UseCases = () => {
  /*
  manual carousel of boxes containing image and text
  */

  const { width } = useViewport();
  const breakpoint = 665;
  return (
    <div
      style={{ display: "flex", flexDirection: "column" }}
      className={styles.container}
    >
      {/* Missing font WHYTE INK SUPER */}
      {/*<Display */}
      {/*  large={width > breakpoint && true} */}
      {/*  extraSmall={width < breakpoint && true} */}
      {/*  className={styles.backgroundText} */}
      {/*> */}
      {/*  A FLUID ECONOMY */}
      {/*</Display> */}
      {width > breakpoint ? (
        <img
          style={{ height: "auto", maxWidth: "90%" }}
          src={window.location.origin + "/assets/text/AFLUIDECONOMY.svg"}
          alt={"A FLUID ECONOMY"}
        />
      ) : (
        <img
          style={{ height: "auto", maxWidth: "90%" }}
          src={window.location.origin + "/assets/text/AFLUIDECONOMY-Broken.svg"}
          alt={"A FLUID ECONOMY"}
        />
      )}

      <ManualCarousel scrollBar={false} className={styles.map}>
        {items.map((item, i) => (
          <UseCase key={`usecase-${i}`} useCase={item} />
        ))}
      </ManualCarousel>
    </div>
  );
};

export default UseCases;

const items = [
  {
    img: "/assets/images/useCaseIcons/forSenders.svg",
    title: "For senders",
    info: "Every time you use fluid assets in any use case, you earn yield. Make purchases and send money as you normally would, but with the added potential to win rewards.",
  },
  {
    img: "/assets/images/useCaseIcons/forReceivers.svg",
    title: "For receivers",
    info: "Fluid assets incentivise adoption by rewarding counterparts to participate in the fluid economy.",
  },
  {
    img: "/assets/images/useCaseIcons/assetsUtility.svg",
    title: "Assets & utility",
    info: "Fluid assets are composable by nature and can successfully promote both user and platform engagement through its novel reward distribution mechanisms. ",
  },
  {
    img: "/assets/images/useCaseIcons/sendReceive.svg",
    title: "Transactions & payments",
    info: "Cashback programs/incentives have always been single-sided, pro-consumer. Fluidity rectifies that by rewarding the recipient/counterparty with a cut of the yield.",
  },
  {
    img: "/assets/images/useCaseIcons/metaverseGaming.svg",
    title: "Metaverse & gaming",
    info: "Fluidity rewards all forms of use cases. Gaming and metaverses are high-velocity use cases that can massively benefit from the fluid ecosystem.",
  },
  {
    img: "/assets/images/useCaseIcons/decentralizedExchanges.svg",
    title: "Decentralized exchanges",
    info: "Transacting, trading and asset movement are integral activities within decentralised programs and their applications. Value transfers can greatly benefit from adopting the fluid layer. ",
  },
  {
    img: "/assets/images/useCaseIcons/nfts.svg",
    title: "NFTs",
    info: "The Fluid Layer rewards all forms of use cases. Games and metaverses are high velocity use-cases that can highly benefit from adopting the Fluid Layer; allowing supplementary income sources..",
  },
];
