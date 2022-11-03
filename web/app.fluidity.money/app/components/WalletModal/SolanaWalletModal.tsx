import { Text } from "@fluidity-money/surfing";
import { WalletName, WalletReadyState } from "@solana/wallet-adapter-base";
import { useWallet } from "@solana/wallet-adapter-react";
import { useCallback } from "react";

interface IPropsSolanaWalletModal {
  visible: boolean;
  close: () => void;
}

export const SolanaWalletModal = ({ visible, close}: IPropsSolanaWalletModal) => {

 const { wallets, select } = useWallet()

 const selectWallet = useCallback(
  (event: React.MouseEvent<HTMLLIElement, MouseEvent>, walletName: WalletName) => {
      select(walletName);
  },
  [select]
);
  return (
    <>
      <div className={`solana-wallet-modal-container  ${visible === true ? 'show-modal' : 'hide-modal'}`}>
        <Text prominent size="xxl" >Connect your wallet</Text>
        <span onClick={close}><Text prominent size="xl" className="solana-modal-cancel-btn">X</Text></span>
        <ul className="solana-modal-wallet-list">
          {
            wallets.map((wallet)=>
              <><li onClick={(event)=> 
                selectWallet(event, wallet.adapter.name)
              }>
                 <span>
                  <img src={wallet?.adapter.icon}
                      style={{
                        width: `30%`,
                      }}
                    />  
                    <Text size="xxl"
                      className="solana-modal-wallet-names" 
                      >
                      {wallet.adapter.name}
                    </Text>
                 </span>
                  <Text size="xs"
                    className="solana-modal-wallet-status" 
                  >
                    <i>
                      { wallet.readyState === WalletReadyState.Installed ?  'Installed' : 'Not Installed' }
                    </i>
                  </Text>
              </li> <hr /></>
            )
          }
        </ul>
      </div>
    </>
  )
};
