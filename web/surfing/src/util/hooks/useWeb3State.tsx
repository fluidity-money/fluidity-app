<<<<<<< HEAD
//import EthProvider, { useWallet as useEthWallet } from '../chainProviders/evm';
=======
// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import EthProvider, { useWallet as useEthWallet } from '../chainProviders/evm';
>>>>>>> develop

const Web3Provider = ({children, ...props}: any) => {
  return (
    <div {...props} >{children}</div>
    //<EthProvider chainId={1}>
    //  {children}
    //</EthProvider>
  )
}

//export const useWallet = () => {
//  return useEthWallet;
//}

export default Web3Provider;
