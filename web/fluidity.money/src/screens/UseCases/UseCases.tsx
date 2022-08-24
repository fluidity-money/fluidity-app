import UseCase from "components/UseCase";
import React from "react";
import ManualCarousel from "../../components/ManualCarousel";
import styles from "./UseCases.module.scss";

const UseCases = () => {
  /*
  manual carousel of boxes containing image and text
  */
  return (
    <div
      style={{ display: "flex", flexDirection: "column" }}
      className={styles.container}
    >
      <h1>A FLUID ECONOMY</h1>
      <ManualCarousel>
        {items.map((item) => (
          <UseCase useCase={item} />
        ))}
      </ManualCarousel>
    </div>
  );
};

export default UseCases;

const items = [
  {
    img: "/assets/images/useCaseIcons/globePaperAirplane.svg",
    title: "For senders",
    info: "Every time you use a fluid asset in any use case, you are earning yield. Make purchases and send money as you normally would but with the potential to win rewards. ",
  },
  {
    img: "/assets/images/useCaseIcons/sendReceive.svg",
    title: "For receivers",
    info: "Fluid assets incentivise adoption by rewarding counterparts to participate in the Fluid economy.",
  },
  {
    img: "/assets/images/useCaseIcons/globePaperAirplane.svg",
    title: "Assets & utility",
    info: "Fluid assets are quite composable in nature and as a result, are able to promote both user and platform engagement through their reward distribution mechanisms... ",
  },
  {
    img: "/assets/images/useCaseIcons/globePaperAirplane.svg",
    title: "Transactions & payments",
    info: "Cashback programs and incentives have always been a consumer-facing affair. It is unusual to have counter-parties being rewarded and gaining yield through...",
  },
  {
    img: "/assets/images/useCaseIcons/globePaperAirplane.svg",
    title: "Metaverse & gaming",
    info: "The fluid layer rewards all forms of use cases. Games and meteverses are high velocity use cases that can benefit from adopting the Fluid Layer...",
  },
  {
    img: "/assets/images/useCaseIcons/globePaperAirplane.svg",
    title: "Decentralized exchanges",
    info: "Transacting, trading and asset movement are integral activities within decentralised programs and their applications. Value transfers can greatly benefit from adopting the fluid layer. ",
  },
];
