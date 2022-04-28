import ChainId, {chainIdFromEnv} from "./chainId";

type Contract = {
  addr: string;
  abi: any; //TODO typing ABI/methods (typechain?)
  decimals: number;
};

type Token = {
  symbol: SupportedContracts;
  address: string;
  colour: string;
  image: string;
  decimals: number;
};

export type SupportedContracts = "USDT" | "USDC" | "DAI" | "TUSD" | "Fei";
export type SupportedFluidContracts =
  | SupportedContracts
  | `f${SupportedContracts}`;

export type SupportedNetworks = "ETH";

type SwapContractList = {
  [k in SupportedNetworks]?: {
    [k in SupportedFluidContracts]?: Contract;
  };
};

const chainId = chainIdFromEnv();
let tokens: Array<Token> = [];

switch (chainId) {
  case ChainId.Hardhat:
    tokens = require("config/testing-tokens.json");
    break;
  case ChainId.Ropsten:
    tokens = require("config/ropsten-tokens.json");
    break;
  case ChainId.Kovan:
    tokens = require("config/kovan-tokens.json");
    break;
  default:
    throw new Error(`${chainId} is not a supported chain ID!`);
}

const ERC20_ABI = [
  "function approve(address spender, uint256 amount) public returns (bool success)",
  "function balanceOf(address account) public view returns (uint256)",
  "increaseAllowance(address spender, uint256 addedValue) public returns (bool success)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function transfer(address recipient, uint256 amount) public returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint256 val)",
];

const FLUID_TOKEN_ABI = [
  "function erc20In(uint amount) public returns (bool success)",
  "function erc20Out(uint amount) public returns (bool success)",
  "function balanceOf(address account) public view returns (uint256)",
  "function transfer(address recipient, uint256 amount) public returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint256 val)",
];

const contractList: SwapContractList = {
  ETH: tokens.reduce(
    (previous, { symbol, address, decimals }) => ({
      ...previous,
      [symbol]: {
        addr: address,
        decimals,
        abi: symbol?.startsWith("f") ? FLUID_TOKEN_ABI : ERC20_ABI,
      },
    }),
    {}
  ), //reduce on empty object to apply properly on first value
};

export default contractList;
