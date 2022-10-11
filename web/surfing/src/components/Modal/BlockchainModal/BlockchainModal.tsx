// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import type { ReactComponentElement } from "react";
import type { SupportedChainsList } from "~/util/chainProviders/chains";

import { useRef } from "react";
import { SupportedChains } from "~/util";
import { useClickOutside } from "../Modal";
import { ReactComponent as Checkmark } from "~/assets/images/buttonIcons/Checkmark.svg";
import { Card, Heading, Text } from "~/components";
import styles from "./BlockchainModal.module.scss";

export interface IOption {
  name: SupportedChainsList;
  icon: ReactComponentElement<any>;
}

export interface IBlockchainModal {
  option: IOption;
  setOption: React.SetStateAction<any>;
  options: IOption[];
  handleModal: React.SetStateAction<any>;
  mobile: boolean;
  className?: string;
}

const BlockchainModal = ({ handleModal, option: selected, options, setOption, mobile, className }: IBlockchainModal) => {
  // if page is alredy on resources href id only otherwise switch page and then id
  const handleOnClick = (i: number) => {
    setOption(options[i].name);
    handleModal(false);
  }
    
  const isSelected = (option: IOption) => option.name == selected.name;
  
  const blockchainModal = useRef(null);
  
  useClickOutside(blockchainModal, () => handleModal(false));
  
  const mobileProps = mobile && styles.mobile;
  
  const classProps = `${styles.container} ${mobileProps} ${className || ""}`

  return (
    <div ref={blockchainModal} className={classProps}>
      <div className={styles.heading}>
        <Heading
          as={"h4"}
        >
          Select a Blockchain
        </Heading>
        <button onClick={() => handleModal(false)}>X</button>
      </div>
      {options.map((option, i) => isSelected(option) 
        ? (
          <Card
            component="button"
            className={`${styles.card}`}
            type={"holobox"}
            rounded={true}
          >
            {option.icon}{"  "}
            <Text size={"xl"} prominent={true}>
              <strong>
                {SupportedChains[option.name].name}
              </strong>
            </Text>
            <Checkmark style={{marginLeft: "auto", marginRight: "24px"}}/>
          </Card>
        ) : (
          <Card
            component="button"
            className={styles.card}
            type={"box"}
            rounded={true}
            onClick={() => handleOnClick(i)}
          >
            {option.icon}{"  "}
            <Text size={"xl"}>
              {SupportedChains[option.name].name}
            </Text>
          </Card>
        )
      )}
    </div>
  );
};

export default BlockchainModal;
