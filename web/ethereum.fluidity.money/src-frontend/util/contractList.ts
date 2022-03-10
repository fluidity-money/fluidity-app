import {SupportedTokens} from 'components/types';

type Contract = {
    addr: string,
    abi: any, //TODO typing ABI/methods (typechain?)
};

type Token = {
  symbol: SupportedContracts
  address: string
};

export type SupportedContracts = "USDT" | "USDC" | "DAI";
export type SupportedFluidContracts = SupportedContracts | `f${SupportedContracts}`;

type SwapContractList = {
    [k in SupportedTokens]?: {
        [k in SupportedFluidContracts]?: Contract
    }
};

const tokensPath = process.env.REACT_APP_TOKEN_CONFIG_FILE;

if (!tokensPath) {
  console.error("REACT_APP_TOKEN_CONFIG_FILE not set!");
  process.exit(1);
}

const tokens: Array<Token> = require(`config/${tokensPath}`);

const ERC20_ABI = [
  "function approve(address spender, uint256 amount) public returns (bool success)",
  "function balanceOf(address account) public view returns (uint256)",
  "increaseAllowance(address spender, uint256 addedValue) public returns (bool success)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function transfer(address recipient, uint256 amount) public returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint256 val)",
]

const FLUID_TOKEN_ABI = [
  "function erc20In(uint amount) public returns (bool success)",
  "function erc20Out(uint amount) public returns (bool success)",
  "function balanceOf(address account) public view returns (uint256)",
  "function transfer(address recipient, uint256 amount) public returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint256 val)",
]

const contractList: SwapContractList = {
  ETH: tokens.reduce((previous, {symbol, address}) => ({
    ...previous,
    [symbol]: {
      addr: address,
      abi: symbol.startsWith('f') ?
        FLUID_TOKEN_ABI :
        ERC20_ABI
    }
  }), {}) //reduce on empty object to apply properly on first value
};
export default contractList;
