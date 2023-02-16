// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import type { Tokens } from "~/components/Images/Token/Token";

import { Display, Text, Token as TokenSymbol, GeneralButton, LinkButton } from "~/components";
import { numberToMonetaryString, numberToCommaSeparated, useViewport } from "~/util";
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
}: ITokenCard) => {
  const mobileBreakpoint = 768
  const { width } = useViewport()
  const isMobile = width < mobileBreakpoint

  return (
    <div className={`${styles.TokenCard}  ${isMobile ? styles.isMobile : ''}`}>
      <div
      className={styles.tokenImg}
      >
      <TokenSymbol 
        token={token.symbol as Tokens} 
        alt={token.name} 
        
      />
      </div>
      
      <div className={`${styles.content} ${isFluid ? styles.isFluid : ''} ${showLabels ? styles.hasLabels : ''}`}>
        {(!isMobile && showLabels) && (
          <>
            <Text size="sm">ASSET</Text>
            {isFluid && <Text size="sm">FLUID</Text>}
            <Text size="sm">{isFluid ? 'REGULAR' : 'AMOUNT'}</Text>
            <Text size="sm">VALUE</Text>
            <Text size="sm">TOTAL</Text>
          </>
        )}
        

        <Display size="xxs" className={styles.top}>
          {token.symbol}
        </Display>
        { !isMobile && (
          <>
            {isFluid && <Text className={styles.stat} size="md" prominent>{numberToCommaSeparated(fluidAmt)}</Text>}
            <Text className={styles.stat} size="md">{numberToCommaSeparated(regAmt)}</Text>
            <Text className={styles.stat} size="md">{numberToMonetaryString(value)}</Text>
          </>
        )}
        <Display size="xxs" className={styles.top}>{numberToMonetaryString(isFluid ? fluidAmt*value : regAmt*value)}</Display>
        {
          isMobile && (
            <>
              {
                isFluid ? <Text size="sm" className={styles.bottom}>{token.name}</Text> : <LinkButton className={styles.bottom} type="internal" size="small" handleClick={onButtonPress}>FLUIDIFY</LinkButton>
              }
              <Text className={styles.bottom} size="sm">{numberToCommaSeparated(isFluid ? fluidAmt : regAmt)} at {numberToMonetaryString(value)}</Text>
            </>
          )
        }
      </div>
      {(!isFluid && !isMobile) && <GeneralButton className={styles.fluidifyButton} version='transparent' size="small" buttontype="text" handleClick={onButtonPress}>FLUIDIFY</GeneralButton>}
    </div>
  );
};

export default TokenCard;
