import {SupportedTokens} from 'components/types';

type Contract = {
    addr: string,
    abi: any, //TODO typing ABI/methods (typechain?)
}

export type SupportedContracts = "USDT" | "CUSDT";
export type SupportedFluidContracts = SupportedContracts | `f${SupportedContracts}`;
type SwapContractList = {
    [k in SupportedTokens]?: {
        [k in SupportedFluidContracts]?: Contract
    }
}

const contractList: SwapContractList = {}

export default contractList;
