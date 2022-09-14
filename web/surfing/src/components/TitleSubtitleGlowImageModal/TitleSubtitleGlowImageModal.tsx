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
}: TitleSubtitleGlowImageModalProps) =>
  <div className={ styles.container }>
    <TitleSubtitle
      title="Get. That. Money."
      subtitle={`$${unclaimedPrizesUsd} USD in unclaimed prizes.`}
      subtitleSize="xs"
      center />

    <ImageAura>
      <TokenBadge imageSrc={ tokenBadgeSrc }/>
     </ImageAura>

     <TitleSubtitle
       title={`${winningsFluidAsset} ${fluidAssetName}`}
       subtitle={`($${winningsUsd} USD)`}
       center />

     <Text center size="md">
       Won for <a href="#">sending</a> Fluid Assets.
     </Text>

     <Text center size="md">
       { winningsFluidAsset} { fluidAssetName } total balance
     </Text>
  </div>;

export default TitleSubtitleGlowImageModal;
