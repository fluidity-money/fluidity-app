import { gql, jsonPost } from "~/util";
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

  const url = process.env.FLU_HASURA_URL;

  if (!url) throw new Error("FLU_HASURA_URL not set!");

  return jsonPost<LootboxesByTxHashBody, LootboxesRes>(
    url,
    body,
    process.env.FLU_HASURA_SECRET
      ? {
          "x-hasura-admin-secret": process.env.FLU_HASURA_SECRET,
        }
      : {}
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
    case 2:
      return Rarity.Uncommon;
    case 1:
    default:
      return Rarity.Common;
  }
};

export { useLootboxesByTxHash, translateRewardTierToRarity };
