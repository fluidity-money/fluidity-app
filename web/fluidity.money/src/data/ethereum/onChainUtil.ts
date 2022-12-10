import { AbiItem } from "web3-utils";
import IERC20 from "@openzeppelin/contracts/build/contracts/IERC20.json";
import Web3 from "web3";

const fluidEthTokens = [
	'0xADc234a4e90E2045f353F5d4fCdE66144d23b458',
	'0x9d1089802eE608BA84C5c98211afE5f37F96B36C',
	'0x244517Dc59943E8CdFbD424Bdb3262c5f04a1387',
	'0x0B319dB00d07C8fAdfaAEf13C910141a5dA0aa8F',
	'0x2bE1e42BF263AaB47D27Ba92E72c14823e101D7C'];

export const getTotalTransactions = async ()=>{
  var web3 = new Web3(process.env.FLU_ETH_RPC_HTTP);

	let total = 0;
	for(let i =0; i < fluidEthTokens.length; i++) {

		const txs = await new web3.eth.Contract(
      IERC20.abi as unknown as AbiItem,
      fluidEthTokens[i]
    ).getPastEvents('Transfer',
		{
			fromBlock: 0,
			toBlock: "latest"
		});

		total+= txs.length;
	}

	return total;
};
