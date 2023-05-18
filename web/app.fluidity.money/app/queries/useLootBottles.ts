import { gql, jsonPost } from "~/util";
import config from "~/webapp.config.server";
import { Rarity } from "@fluidity-money/surfing";

const QUERY_BY_TX_HASH = gql`
  query getLootboxesByTxHash($filterHashes: [String!] = []) {
    lootbox(where: { transaction_hash: { _in: $filterHashes } }) {
      txHash: transaction_hash
      lootboxCount: lootbox_count
      rewardTier: reward_tier
    }
  }
`;

export type Lootbox = {
  txHash?: string;
  lootboxCount: number;
  rewardTier: number;
};

type LootboxesByTxHashBody = {
  query: string;
  variables: {
    filterHashes: Array<string>;
  };
};

type LootboxesRes = {
  data?: {
    lootbox: Array<Lootbox>;
  };
  errors?: unknown;
};

const useLootboxesByTxHash = (filterHashes: string[]) => {
  const variables = {
    filterHashes,
  };

  const body = {
    query: QUERY_BY_TX_HASH,
    variables,
  };

  return jsonPost<LootboxesByTxHashBody, LootboxesRes>(
    config.drivers.hasura[0].rpc.http,
    body,
    {
      "x-hasura-admin-secret": config.drivers.hasura[0].secret ?? "",
    }
  );
};

const translateRewardTierToRarity = (rewardTier: number): Rarity => {
  switch (rewardTier) {
    case 5:
      return Rarity.Legendary;
    case 4:
      return Rarity.UltraRare;
    case 3:
      return Rarity.Rare;
    case 1:
      return Rarity.Uncommon;
    case 1:
    default:
      return Rarity.Common;
  }
};

export { useLootboxesByTxHash, translateRewardTierToRarity };
