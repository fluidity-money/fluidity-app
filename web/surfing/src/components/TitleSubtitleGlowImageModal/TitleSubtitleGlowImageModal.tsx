import React from "react";

import styles from "./TitleSubtitleGlowImageModal.module.scss";

import TitleSubtitle from "../TitleSubtitle";
import TokenBadge from "../TokenBadge";
import ImageAura from "../ImageAura";
import Text from "../Text";
import GeneralButton from "../Button/GeneralButton";

interface TitleSubtitleGlowImageModalProps {
  unclaimedPrizesUsd : number;
  tokenBadgeSrc : string;
  winningsFluidAsset : number;
  winningsUsd : number;
  totalBalanceFluidAsset : number;
  fluidAssetName : string;
};

export const TitleSubtitleGlowImageModal = ({
  unclaimedPrizesUsd,
  tokenBadgeSrc,
  winningsFluidAsset,
  winningsUsd,
  totalBalanceFluidAsset,
  fluidAssetName
}: Props) =>
  <div class={ styles.container }>
    <TitleSubtitle
      title="Get. That. Money."
      subtitle={`$${unclaimedPrizesUsd} USD in unclaimed prizes.`}
      subtitleSize="s"
      center />

    <ImageAura>
      <TokenBadge imageSrc={ tokenBadgeSrc }/>
     </ImageAura>

     <TitleSubtitle
       title={`${winningsFluidAsset} ${fluidAssetName}`}
       subtitle={`($${winningsUsd} USD)`}
       center />

     <Text center size="s">
       Won for <a href="#">sending</a> Fluid Assets.
     </Text>

     <Text center size="s">
       { winningsFluidAsset} { fluidAssetName } total balance
     </Text>
  </div>;

export default TitleSubtitleGlowImageModal;
