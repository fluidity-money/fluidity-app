export type IFluidityDataProvider = {
    getHistory: () => Promise<any>;
}