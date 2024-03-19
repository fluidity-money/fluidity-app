import Image from "next/image";
import { Text, trimAddress, trimAddressShort } from "@fluidity-money/surfing";

import styles from "./ConnectedWallet.module.scss";

type IConnectedWallet = {
  address: string;
  callback: () => void;
  className?: string;
  short?: boolean;
};

const ConnectedWallet = ({
  address,
  callback,
  className,
  short = true,
}: IConnectedWallet) => {
  return (
    <button
      onClick={callback}
      className={`${styles.connected_btn} ${className ?? ""}`}
    >
      <div className={short ? `${styles.holo}` : " "}>
        <Image src="./user.svg" alt="user" width={36} height={36} />
      </div>
      <Text size="lg" prominent={true}>
        {"   "}
        {short ? trimAddressShort(address) : trimAddress(address)}
      </Text>
    </button>
  );
};

export default ConnectedWallet;
