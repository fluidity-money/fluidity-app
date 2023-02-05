// Copyright 2023 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import { ReactElement, useState } from "react";

import { Card, TokenCard, ArrowUp, TokenDetails } from "~/components";

import styles from "./CollapsibleCard.module.scss";

export type Token = {
  symbol: string;
  name: string;
  logo: string;
  address: string;
  isFluidOf?: string;
  obligationAccount?: string;
  dataAccount?: string;
  decimals: number;
  colour: string;
};

type asset = {
  token: Token
  fluidAmt: string
  regAmt: string
  value: number
  topPrize: { 
    winning_amount: number
    transaction_hash: string
  }
  avgPrize: number
  topAssetPrize: { 
    winning_amount: number
    transaction_hash: string
  }
  activity: {
    desc: string
    value: number
    reward: number
    transaction: string
  }[]
}

interface ISummary {
  children: React.ReactNode
  onClick?: () => void
  canExpand?: boolean
  isActive?: boolean
}

interface IDetails {
  children: React.ReactNode
}

interface ICollapsibleCard {
  children: (ReactElement<ISummary> | ReactElement<IDetails>)[]
  expanded: boolean
  type?: 'gray' | 'box' | 'holobox' | 'transparent'
}

const Summary: React.FC<ISummary> = ({ children, onClick, canExpand, isActive }) => {
  return (
    <div className={styles.Summary} onClick={onClick}>
      <div className={styles.content}>{children}</div>
      {canExpand && <ArrowUp fill={"white"} style={{transform: `rotate(${isActive ? "180deg" : "0"})`}}/>}
    </div>
  )
}

const Details: React.FC<IDetails> = ({ children }) => {
  return (
    <div className={styles.Details}>
      {children}
    </div>
  )
}

const CollapsibleCard: React.FC<ICollapsibleCard> = ({
  children,
  expanded = false,
  type = 'gray',
}: ICollapsibleCard) => {

  const [isOpen, setIsOpen] = useState(expanded)

  const isHeaderOnly = children.length === 1 && children[0].type === Summary
  const summary = children.find((child) => child.type === Summary)

  if (isHeaderOnly) {
    return (
      <Card component="div" rounded={true} type={"gray"} className={styles.CollapsibleCard} >
        <Summary>
          {summary?.props.children}
        </Summary>
      </Card>
    )
  }

  const details = children.find((child) => child.type === Details)

  return (
    <Card component="div" rounded={true} type={type} className={styles.CollapsibleCard} >
      <Summary canExpand onClick={() => {setIsOpen(prev => !prev)}} isActive={isOpen}>
        {summary?.props.children}
      </Summary>
      <>
        {isOpen && (
          <Details>
            {details?.props.children}
          </Details>
        )}
      </>
    </Card>
  );
};

export default Object.assign(CollapsibleCard, { Summary, Details })
