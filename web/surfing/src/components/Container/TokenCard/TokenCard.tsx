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
}

const TokenCard = ({
  token,
  fluidAmt,
  regAmt,
  value,
}: ITokenCard) => (
  <div className={`${styles["token-card-container"]}`}>
    <div className={styles.token}>
      <TokenSymbol token={token.symbol as Tokens} alt={token.name} className={styles.tokenImg}/>
      <Heading as="h3">
        {token.symbol}
      </Heading>
    </div>
    <Text size="lg" prominent>{numberToCommaSeparated(fluidAmt)}</Text>
    <Text size="lg">{numberToCommaSeparated(regAmt)}</Text>
    <Text size="lg">{numberToMonetaryString(value)}</Text>
    <Display size="sm">{numberToMonetaryString(fluidAmt + regAmt)}</Display>
  </div>
);

export default TokenCard;
