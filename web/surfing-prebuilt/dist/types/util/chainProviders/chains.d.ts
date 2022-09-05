interface Chain {
    short: SupportedChainsList;
    name: string;
}
interface ISupportedChains {
    ETH: Chain;
    SOL: Chain;
}
export declare type SupportedChainsList = keyof ISupportedChains;
export declare const SupportedChains: ISupportedChains;
export {};
