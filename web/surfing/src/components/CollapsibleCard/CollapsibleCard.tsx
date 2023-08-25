// Copyright 2023 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import { AnimatePresence, motion } from "framer-motion";
import { ReactElement, useState } from "react";

import { Card, TriangleDown } from "~/components";

import styles from "./CollapsibleCard.module.scss";
import { ICard } from "../Container/Card/Card";

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
  enabled: boolean;
};

interface ISummary {
  children: React.ReactNode
  onClick?: () => void
  canExpand?: boolean
  isActive?: boolean
}

interface IDetails {
  children: React.ReactNode
}

interface ICollapsibleCard extends ICard {
  children: ReactElement<ISummary> | (ReactElement<ISummary> | ReactElement<IDetails>)[]
  expanded: boolean
}

const Summary: React.FC<ISummary> = ({ children, onClick, canExpand, isActive }) => {
  return (
    <div className={`${styles.Summary} ${canExpand ? styles.pointer : ''}`} onClick={onClick}>
      <div className={styles.content}>{children}</div>
      {canExpand && <TriangleDown className={styles.caret} style={{ transform: `rotate(${isActive ? "180deg" : "0"})` }} />}
    </div>
  )
}

const Details: React.FC<IDetails> = ({ children }) => {
  return (
    <motion.div
      className={styles.Details}
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  )
}

const CollapsibleCard: React.FC<ICollapsibleCard> = ({
  children,
  expanded = false,
  ...props
}: ICollapsibleCard) => {

  const [isOpen, setIsOpen] = useState(expanded)

  const isHeaderOnly = typeof (children) === 'object' && !Array.isArray(children) && children.type === Summary

  const summary: ReactElement<ISummary> = isHeaderOnly ? children : ((children as ReactElement[]).find((child) => child.type === Summary) as ReactElement<ISummary>)
  const details: ReactElement<IDetails> | null = isHeaderOnly ? null : ((children as ReactElement[]).find((child) => child.type === Details) as ReactElement<IDetails>)

  if (isHeaderOnly) {
    return (
      <Card component="div" rounded={true} className={styles.CollapsibleCard} {...props}>
        <Summary>
          {summary.props.children}
        </Summary>
      </Card>
    )
  }

  if (!details) return null

  return (
    <Card component="div" rounded={true} className={styles.CollapsibleCard} {...props}>
      <Summary canExpand onClick={() => { setIsOpen(prev => !prev) }} isActive={isOpen}>
        {summary.props.children}
      </Summary>
      <AnimatePresence>
        {isOpen && (
          <Details>
            {details.props.children}
          </Details>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default Object.assign(CollapsibleCard, { Summary, Details })
