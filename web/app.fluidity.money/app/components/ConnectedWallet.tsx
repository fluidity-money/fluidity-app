import { Text, trimAddressShort, trimAddress } from "@fluidity-money/surfing";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";

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
      className={`connected-wallet ${className ?? ""}`}
    >
      <div className="holo">
        <Jazzicon diameter={36} seed={jsNumberForAddress(address)} />
      </div>
      <Text size="lg" prominent={true}>
        {"   "}
        {short ? trimAddressShort(address) : trimAddress(address)}
      </Text>
    </button>
  );
};

export default ConnectedWallet;
