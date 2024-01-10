import { jsonPost, gql, fetchInternalEndpoint } from "~/util";

const queryGetConfigCurrentProgram = gql`
  query getLootboxConfig {
    lootboxConfig: lootbox_config(
      where: { is_current_program: { _eq: true }}
      limit: 1
    ) {
      programBegin: program_begin,
      programEnd: program_end,
      epochIdentifier: epoch_identifier,
      ethereumApplication: ethereum_application
    }
  }
`;

const queryGetConfigSpecific = gql`
  query getLootboxConfig($identifier: lootbox_epoch!) {
    lootboxConfig: lootbox_config(
      where: { epoch_identifier: { _eq: $identifier }}
      limit: 1
    ) {
      programBegin: program_begin,
      programEnd: program_end,
      epochIdentifier: epoch_identifier,
      ethereumApplication: ethereum_application
    }
  }
`;

type LootboxConfigBody = {
  query: string;
};

export type LootboxConfig = {
  programBegin: string;
  programEnd: string;
  epochIdentifier: string;
  ethereumApplication: string;
  found: boolean;
};

type LootboxConfigResponse = {
  data?: {
    lootboxConfig: Array<LootboxConfig>;
  };
  errors?: unknown;
};

type IUseLootboxConfig = {
  identifier: string | undefined;
  shouldFind: boolean | undefined;
};

export const useLootboxConfig = ({ identifier, shouldFind }: IUseLootboxConfig) => {
  const { url, headers } = fetchInternalEndpoint();

  const body = (() =>
    shouldFind ? {
      query: queryGetConfigCurrentProgram
    } : {
      query: queryGetConfigSpecific,
      variables: { identifier }
    }
  )();

  return jsonPost<LootboxConfigBody, LootboxConfigResponse>(
    url,
    body,
    headers
  );
};
