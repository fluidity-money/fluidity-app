// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import type { ButtonHTMLAttributes, ReactComponentElement } from "react";

import { Text } from "~/components";
import { ReactComponent as ArrowDiag } from '~/assets/images/buttonIcons/arrowDiagWhite.svg';
import styles from "./ChainSelectorButton.module.scss";

interface ChainOption {
  name: string;
  icon: ReactComponentElement<any>;
}

interface IChainSelectorButton extends ButtonHTMLAttributes<HTMLButtonElement> {
  chain: ChainOption;
  onClick: () => void;
}

const ChainSelectorButton = ({
  chain,
  className,
  onClick,
  ...props
}: IChainSelectorButton) => {
  const classProps = className || "";
  
  return (
    <button onClick={onClick} className={`${styles.dropdown} ${classProps}`} {...props}>
      {chain.icon}
      <Text
        size={"lg"}
        prominent={true}
      >
        {chain.name}
      </Text>
      <ArrowDiag />
    </button>
  );
};

export default ChainSelectorButton;
