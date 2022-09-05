import type { ReactComponentElement } from "react";

import { useRef } from "react";
import { useClickOutside } from "../Modal";
import { ReactComponent as Checkmark } from "~/assets/images/buttonIcons/Checkmark.svg";
import { Card, Heading, Row, Text } from "~/components";
import styles from "./BlockchainModal.module.scss";

interface IOption {
  key: string;
  name: string;
  icon: ReactComponentElement<any>;
}

interface IBlockchainModal {
  option: IOption;
  setOption: React.SetStateAction<any>;
  options: IOption[];
  handleModal: React.SetStateAction<any>;
}

const BlockchainModal = ({ handleModal, option: selected, options, setOption }: IBlockchainModal) => {
  // if page is alredy on resources href id only otherwise switch page and then id
  const handleOnClick = (i: number) => {
    setOption(options[i].name);
    handleModal(false);
  }
    
  const isSelected = (option: IOption) => option.name == selected.name;
  
  const SelectedCard = ({option, ...props}: any) => (
    <Card
      component="button"
      className={`${styles.card}`}
      type={"holobox"}
      rounded={true}
      {...props}
    >
      {option.icon}
      <Text size={"xl"} prominent={true}>
        <strong>
          {option.name}
        </strong>
      </Text>
      <Checkmark style={{marginLeft: "auto", marginRight: "24px"}}/>
    </Card>
  );

  const UnselectedCard = ({option, ...props}: any) => (
    <Card
      component="button"
      className={styles.card}
      type={"box"}
      rounded={true}
      {...props}
    >
      {option.icon}
      <Text size={"xl"}>
        {option.name}
      </Text>
    </Card>
  );
  
  const blockchainModal = useRef(null);
  
  useClickOutside(blockchainModal, () => handleModal(false));

  return (
    <div ref={blockchainModal} className={styles.container}>
      <div className={styles.heading}>
        <Heading
          as={"h4"}
        >
          Select a Blockchain
        </Heading>
        <button onClick={() => handleModal(false)}>X</button>
      </div>
      {options.map((option, i) => isSelected(option) 
        ? <SelectedCard key={`${option.name}-opt`} option={option} />
        : <UnselectedCard key={`${option.name}-opt`} option={option} onClick={() => handleOnClick(i)} />
      )}
    </div>
  );
};

export default BlockchainModal;
