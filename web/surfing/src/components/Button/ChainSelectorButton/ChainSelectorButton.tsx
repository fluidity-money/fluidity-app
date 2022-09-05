// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import type { ButtonHTMLAttributes, ReactComponentElement } from "react";

import { Text } from "~/components";
import { ReactComponent as ArrowDiag } from '~/assets/images/buttonIcons/arrowDiagWhite.svg';
import styles from "./ChainSelectorButton.module.scss";

interface IOption {
  name: string;
  icon: ReactComponentElement<any>;
}

interface IDropDownButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  option: IOption;
  setOptions: React.SetStateAction<any>;
  options: IOption[];
}

const ChainSelectorButton = ({
  option,
  setOptions,
  options,
  disabled,
  className,
  ...props
}: IDropDownButtonProps) => {
  const classProps = className || "";
  
  return (
    <button onClick={() => setOptions(true)} className={`${styles.dropdown} ${classProps}`} {...props}>
      {option.icon}
      <Text
        size={"lg"}
        prominent={true}
      >
        {option.name}
      </Text>
      <ArrowDiag />
    </button>
  );
};

export default ChainSelectorButton;
