import {providers} from "ethers";
import {Web3Provider} from "ethers/providers";
import { useEffect, useState } from "react";
import {useWallet} from "use-wallet";

const useSigner = () => {
    const [provider, setProvider] = useState<providers.Web3Provider | null>(null);
    const {ethereum, account} = useWallet<providers.Web3Provider>();
    useEffect(() => {
        if (account && ethereum)
        setProvider(new Web3Provider(ethereum));
    },[account, ethereum])
    if (!account || !provider) return null;

    return provider.getSigner(account);
}

export default useSigner
