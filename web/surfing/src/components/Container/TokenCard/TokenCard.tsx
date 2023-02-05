// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import type { Tokens } from "~/components/Images/Token/Token";

import { Heading, Display, Text, Token as TokenSymbol } from "~/components";
import { numberToMonetaryString, numberToCommaSeparated } from "~/util";
import styles from "./TokenCard.module.scss";
import { Token } from "~/components/CollapsibleCard/CollapsibleCard";

export type ITokenCard = {
  token: Token
  fluidAmt: number
  regAmt: number
  value: number
  showLabels?: boolean
}

const TokenCard = ({
  token,
  fluidAmt,
  regAmt,
  value,
  showLabels = false
}: ITokenCard) => (
  <div className={`${styles.TokenCard}`}>

    {showLabels && (
      <>
        <Text size="sm">ASSET</Text>
        <Text size="sm">FLUID</Text>
        <Text size="sm">REGULAR</Text>
        <Text size="sm">VALUE</Text>
        <Text size="sm">TOTAL</Text>
      </>
    )}
      <TokenSymbol token={token.symbol as Tokens} alt={token.name} className={styles.tokenImg}/>

      <Heading as="h4">
        {token.symbol}
      </Heading>
    <Text className={styles.stat} size="md" prominent>{numberToCommaSeparated(fluidAmt)}</Text>
    <Text className={styles.stat} size="md">{numberToCommaSeparated(regAmt)}</Text>
    <Text className={styles.stat} size="md">{numberToMonetaryString(value)}</Text>
    <Display size="xs">{numberToMonetaryString(fluidAmt + regAmt)}</Display>
  </div>
);

export default TokenCard;
