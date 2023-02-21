import { ethers, JsonRpcProvider, Contract } from 'ethers';

type EthereumConnectorProps = {
    url: string;
    contract: string;
    abi: any;
}

const EthereumConnector = ({
    url,
    contract,
    abi,
}: EthereumConnectorProps) => {
    const provider = new JsonRpcProvider(process.env.ETHEREUM_URL);
    const EthereumContract = new Contract(contract, abi, provider);
}