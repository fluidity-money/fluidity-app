import { getEthTotalPrizePool } from "data/ethereum/prizePool";

export type IPropPools = {
  ethPool: number;
  solPool: number;
}

const handler = async (req, res) =>  {
  const ethPool: number = await getEthTotalPrizePool(process.env.FLU_ETH_RPC_HTTP)
  const solPool: number = 0

  res.status(200).json({ethPool, solPool})
}

export default handler