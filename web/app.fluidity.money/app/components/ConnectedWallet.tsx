import {Text, trimAddressShort} from "@fluidity-money/surfing";
import Jazzicon, {jsNumberForAddress} from 'react-jazzicon';

type IConnectedWallet = {
  address: string
  callback: () => void
  className?: string
}

const ConnectedWallet = ({address, callback, className}: IConnectedWallet) => {
  return (
    <button onClick={callback} className={`connected-wallet ${className ?? ""}`}>
      <div className="holo">
        <Jazzicon diameter={36} seed={jsNumberForAddress(address)} />
      </div>
      <Text size="lg" prominent={true}>
        {"   "}{trimAddressShort(address)}
    </Text>
  </button>
  )
}

export default ConnectedWallet