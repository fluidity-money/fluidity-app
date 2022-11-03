import { GeneralButton } from "@fluidity-money/surfing";
import { useOutletContext } from "@remix-run/react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { es } from "date-fns/locale";
import { useCallback, useEffect, useState } from "react";
import { ContextType } from "~/routes/$network";

export const SolanaWalletModal = ({}) => {
  //const { wallets } = useOutletContext<ContextType>();
  //const { connection } = useConnection();
  const { wallets } = useWallet();
  //connection.getGenesisHash()

  return (
    <>
      <div className="solana-wallet-modal-container">{wallets.length}</div>,
    </>
  );
};
