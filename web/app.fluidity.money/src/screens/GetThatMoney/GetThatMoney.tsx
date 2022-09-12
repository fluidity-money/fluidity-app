import styles from "./GetThatMoney.module.scss";

import CenterContainer from "../../components/CenterContainer";
import VerticalContainer from "../../components/VerticalContainer";

import { Text } from "@fluidity-money/surfing";

interface GetThatMoneyProps {
  unclaimedPrizes : number;
  fluidAssetName : string;
  amountWonFluid : number;
  amountWonUsd : number;
  totalBalanceUsd : number;
  totalBalanceFluid : number;
};

export default ({
  unclaimedPrizes,
  fluidAssetName,
  amountWonFluid,
  amountWonUsd,
  totalBalanceFluid,
  totalBalanceUsd
} : GetThatMoneyProps) =>
  <CenterContainer fullscreen>
    <VerticalContainer>
      <div>
        <VerticalContainer>
          <Text size="xl">Get. That. Money.</Text>
          <Text>${ unclaimedPrizes } in unclaimed prizes.</Text>
        </VerticalContainer >
      </div >

      <div>
        <VerticalContainer>
          <Text>${amountWonFluid} {fluidAssetName}</Text>
          <h3>(${amountWonUsd})</h3>
        </VerticalContainer >
      </div >

      <Text>Won for sending Fluid Assets.</Text>
      <Text>{ totalBalanceFluid } { fluidAssetName } total balance</Text>
    </VerticalContainer>
  </CenterContainer>
