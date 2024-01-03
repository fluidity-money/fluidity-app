import { BottleTiers } from "~/routes/$network/query/dashboard/airdrop";
import { jsonPost, gql, fetchInternalEndpoint } from "~/util";

const queryGetConfig = gql`
  query getLootboxConfig() {
    lootboxConfig: lootbox_config(where: { is_current_program: true }) {
      program_begin,
      program_end,
      epoch_identifier,
      ethereum_application
    }
  }
`;

type LootboxConfigBody = {
  query: string;
};

type LootboxConfigResponse = {
  data?: {
    programBegin: Date;
    programEnd: Date;
    epochIdentifier: string;
    ethereumApplication: string;
  };
  errors?: unknown;
};

export const useLootboxConfig = () => {
  const { url, headers } = fetchInternalEndpoint();

  const body = {
    query: queryGetConfig,
  };

  return jsonPost<LootboxConfigBody, LootboxConfigResponse>(
    url,
    body,
    headers
  );
};
