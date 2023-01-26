// Copyright 2023 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import { useState } from "react";

import { Card, TokenCard, ArrowUp, TokenDetails } from "~/components";

import styles from "./CollapsibleCard.module.scss";

type ICollapsibleCard = HTMLDivElement & {
  header: React.ReactNode,
  children: React.ReactNode,
}

const CollapsibleCard = ({
  header,
  children,
}: ICollapsibleCard) => {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <Card component="div" rounded={true} type={"gray"} className={styles["collapsible-card"]} >
      <button className={styles["collapsible-card-header"]} onClick={() => setIsOpen(isOpen => !isOpen)} >
        <TokenCard token="USDC" fluidAmt={10} regAmt={10} value={1} />
        <ArrowUp fill={"white"} style={{transform: `rotate(${isOpen ? "180deg" : "0"})`}}/>
      </button>
      <>
      {isOpen && (
          <TokenDetails token="USDC" topPrize={0} avgPrize={0} topAssetPrize={0} activity={[]} />
      )}
</>
    </Card>
  );
};

export default CollapsibleCard;
