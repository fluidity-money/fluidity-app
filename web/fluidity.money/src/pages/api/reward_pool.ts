import { getEthTotalPrizePool, getTotalTransactions } from "data/ethereum";

export type IPropPools = {
  totalTransactions: number;
  ethPool: number;
  solPool: number;
};

const handler = async (req, res) => {
  const totalTransactions = await getTotalTransactions();
  const ethPool: number = await getEthTotalPrizePool();
  const solPool: number = 0;

  res.status(200).json({ totalTransactions, ethPool, solPool });
};

export default handler;
