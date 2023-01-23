import Moralis from "moralis";
import MoralisUtils from "@moralisweb3/common-evm-utils";

export type VolumeTxsResponse = {
  data: {
    ethereum: {
      transfers: Array<{
        amount: string;
        currency: {
          symbol: string;
        };
        sender: {
          address: string;
        };
        receiver: {
          address: string;
        };
        block: {
          timestamp: {
            unixtime: number;
          };
        };
      }>;
    };
  };
};

const useVolumeTxByAddressTimestamp = async (
  // address: token symbol
  fluidAssets: { [address: string]: string },
  address: string,
  iso8601Timestamp: string
): Promise<VolumeTxsResponse> => {
  let cursor: string | undefined;
  const transfers: MoralisUtils.Erc20Transfer[] = [];
  do {
    const response = await Moralis.EvmApi.token.getWalletTokenTransfers({
      address,
      cursor,
    });
    transfers.push(...response.result);
    cursor = response.pagination.cursor;
  } while (cursor);

  const filteredTransactions: VolumeTxsResponse = {
    data: {
      ethereum: {
        transfers: transfers
          .filter(
            (t) =>
              // is a fluid token
              Object.keys(fluidAssets).includes(t.address.format()) &&
              // address is sender or receiver
              (t.fromAddress.equals(address) || t.toAddress.equals(address)) &&
              // is after timestamp
              new Date(t.blockTimestamp) > new Date(iso8601Timestamp)
            // sort descending by block timestamp
          )
          .sort(
            (a, b) =>
              new Date(b.blockTimestamp).getTime() -
              new Date(a.blockTimestamp).getTime()
          )
          .map((t) => ({
            sender: { address: t.fromAddress.format() },
            receiver: { address: t.toAddress.format() },
            block: {
              timestamp: { unixtime: new Date(t.blockTimestamp).getTime() },
            },
            amount: t.value.toString(),
            currency: { symbol: fluidAssets[t.address.checksum] },
          })),
      },
    },
  };
  return filteredTransactions;
};

const useVolumeTxByTimestamp = async (
  // address: token symbol
  fluidAssets: { [address: string]: string },
  iso8601Timestamp: string
) => {
  const transfers = (
    await Promise.all(
      Object.keys(fluidAssets).flatMap(async (address) => {
        let cursor: string | undefined;
        const transfers: MoralisUtils.Erc20Transfer[] = [];
        do {
          const response = await Moralis.EvmApi.token.getTokenTransfers({
            address,
            cursor,
          });
          transfers.push(...response.result);
          cursor = response.pagination.cursor;
        } while (cursor);
        return transfers;
      })
    )
  )
    .filter((t) => !!t)
    .flat() as MoralisUtils.Erc20Transfer[];

  const filteredTransactions: VolumeTxsResponse = {
    data: {
      ethereum: {
        transfers: transfers
          .filter(
            (t) =>
              // is after timestamp
              new Date(t.blockTimestamp) > new Date(iso8601Timestamp)
            // sort descending by block timestamp
          )
          .sort(
            (a, b) =>
              new Date(b.blockTimestamp).getTime() -
              new Date(a.blockTimestamp).getTime()
          )
          .map((t) => ({
            sender: { address: t.fromAddress.format() },
            receiver: { address: t.toAddress.format() || "" },
            block: {
              timestamp: { unixtime: new Date(t.blockTimestamp).getTime() },
            },
            transaction: { hash: t.transactionHash },
            amount: t.value.toString(),
            currency: { symbol: fluidAssets[t.address.checksum] },
          })),
      },
    },
  };
  return filteredTransactions;
};

export { useVolumeTxByTimestamp, useVolumeTxByAddressTimestamp };
