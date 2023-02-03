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
}

const Summary: React.FC<ISummary> = ({ children, onClick, canExpand, isActive }) => {
  return (
    <div className={styles["collapsible-card-summary"]} onClick={onClick}>
      {children}
      {canExpand && <ArrowUp fill={"white"} style={{transform: `rotate(${isActive ? "180deg" : "0"})`}}/>}
    </div>
  )
}

const Details: React.FC<IDetails> = ({ children }) => {
  return (
    <div className={styles["collapsible-card-details"]}>
      {children}
    </div>
  )
}

const CollapsibleCard: React.FC<ICollapsibleCard> = ({
  children,
  expanded = false,
}: ICollapsibleCard) => {

  const [isOpen, setIsOpen] = useState(expanded)

  // If children is ReactElement<ISummary> then there is just a header
  // in which case the card should never expand

  const isHeaderOnly = children.length === 1 && children[0].type === Summary
  const summary = children.find((child) => child.type === Summary)

  if (isHeaderOnly) {
    return (
      <Card component="div" rounded={true} type={"gray"} className={styles["collapsible-card"]} >
        <Summary>
          {summary?.props.children}
        </Summary>
      </Card>
    )
  }

  const details = children.find((child) => child.type === Details)

  return (
    <Card component="div" rounded={true} type={"gray"} className={styles["collapsible-card"]} >
      <Summary>
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
