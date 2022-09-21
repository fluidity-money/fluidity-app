import {BaseToken} from "../types";

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
  "function manualReward(address winner, uint256 amount, uint256 firstBlock, uint256 lastBlock, bytes sig)",
  "event Transfer(address indexed from, address indexed to, uint256 val)",
];

export type EthereumTokenConfig = {
    symbol: string,
    name: string,
    address: string,
    decimals: number,
    colour: string,
    image: string,
}[]

export abstract class EthereumToken extends BaseToken {
  isFluid(): this is FluidEthereumToken {
    return this instanceof FluidEthereumToken;
  };

  isUnwrapped(): this is UnwrappedEthereumToken {
    return this instanceof UnwrappedEthereumToken;
  };

  abstract ABI: string[];
}

export class FluidEthereumToken extends EthereumToken {
  readonly ABI = FLUID_TOKEN_ABI;
}

export class UnwrappedEthereumToken extends EthereumToken {
  readonly ABI = ERC20_ABI;
}
