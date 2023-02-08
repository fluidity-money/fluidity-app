// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import type { Tokens } from "~/components/Images/Token/Token";

import { Heading, Display, Text, Token as TokenSymbol, GeneralButton } from "~/components";
import { numberToMonetaryString, numberToCommaSeparated } from "~/util";
import styles from "./TokenCard.module.scss";
import { Token } from "~/components/CollapsibleCard/CollapsibleCard";

export type ITokenCard = {
  token: Token
  fluidAmt?: number
  regAmt: number
  value: number
  showLabels?: boolean
  isFluid?: boolean
  onButtonPress?: () => void
}

const TokenCard = ({
  token,
  fluidAmt = 0,
  regAmt,
  value,
  showLabels = false,
  isFluid = false,
  onButtonPress = () => {}
}: ITokenCard) => (
  <div className={`${styles.TokenCard} ${isFluid ? styles.isFluid : ''} ${showLabels ? styles.hasLabels : ''}`}>

    {showLabels && (
      <>
        <Text size="sm">ASSET</Text>
        {isFluid && <Text size="sm">FLUID</Text>}
        <Text size="sm">{isFluid ? 'REGULAR' : 'AMOUNT'}</Text>
        <Text size="sm">VALUE</Text>
        <Text size="sm">TOTAL</Text>
        {!isFluid && <>{/* This is a hack to make the button align with the other columns */}
          <div></div>
        </>}
      </>
    )}
    <TokenSymbol token={token.symbol as Tokens} alt={token.name} className={styles.tokenImg}/>

    <Heading as="h4">
      {token.symbol}
    </Heading>
    {isFluid && <Text className={styles.stat} size="md" prominent>{numberToCommaSeparated(fluidAmt)}</Text>}
    <Text className={styles.stat} size="md">{numberToCommaSeparated(regAmt)}</Text>
    <Text className={styles.stat} size="md">{numberToMonetaryString(value)}</Text>
    <Display size="xs">{numberToMonetaryString(isFluid ? fluidAmt*value : regAmt*value)}</Display>
    {!isFluid && <GeneralButton version='transparent' size="small" buttontype="text" handleClick={onButtonPress}>FLUIDIFY</GeneralButton>}
  </div>
);

export default TokenCard;
