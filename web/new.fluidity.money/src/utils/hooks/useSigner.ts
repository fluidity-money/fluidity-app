// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE.md file.

import {providers} from "ethers";
import {Web3Provider} from "ethers/providers";
import {useEffect, useState} from "react";
import {useWallet} from "use-wallet";

const useSigner = () => {
  const [provider, setProvider] = useState<providers.Web3Provider | null>(null);
  const {ethereum, account} = useWallet();

  useEffect(() => {
    if (account && ethereum)
      setProvider(new Web3Provider(ethereum));
  }, [account, ethereum])

  if (!account || !provider)
    return null;

  return provider.getSigner(account);
}

export default useSigner;

