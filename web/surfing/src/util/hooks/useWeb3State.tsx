//import EthProvider, { useWallet as useEthWallet } from '../chainProviders/evm';

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
