import { gql, jsonPost } from "~/util";
import {Chain} from "~/util/chainUtils/chains";

const query = gql`
  fragment appFields on app_performance_return {
      network
      application
      count
      average_reward
      highest_reward
  }
  query ApplicationPerformance($network: network_blockchain!) {
    week: application_performance(
      where: { network: { _eq: $network } }
      args: {i: "1 week"}
    ) {
      ...appFields
    }
    month: application_performance(
      where: { network: { _eq: $network } }
      args: {i: "1 month"}
    ) {
      ...appFields
    }
    year: application_performance(
      where: { network: { _eq: $network } }
      args: {i: "1 year"}
    ) {
      ...appFields
    }
    all: application_performance(
      where: { network: { _eq: $network } }
      args: {}
    ) {
      ...appFields
    }
  }
`;

const useApplicationRewardStatistics = async <T extends Chain>(network: T | string) => {
  const variables = { network };
  const url = "https://fluidity.hasura.app/v1/graphql";
  const body = {
    variables,
    query: query,
  };

  return jsonPost<ApplicationRewardBody, ApplicationRewardResponse<T>>(url, body);
};

type ApplicationRewardBody = {
  variables: {
    network: string;
  };
  query: string;
};

export type EthereumApplication = |
  "none"              |
  "uniswap_v2"        |
  "balancer_v2"       |
  "oneinch_v2"        |
  "oneinch_v1"        |
  "mooniswap"         |
  "oneinch_fixedrate" |
  "dodo_v2"           |
  "curve"             |
  "multichain"        |
  "xy_finance" 
    
export type SolanaApplication = |
  "spl"       |
  "saber"     |
  "orca"      |
  "raydium"   |
  "aldrinv1"  |
  "aldrinv2"  |
  "lifinity"  |
  "mercurial"

export type Application = EthereumApplication | SolanaApplication;

export type ApplicationReward<T extends Chain> = {
      network: T;
      application: T extends "ethereum" ? 
        EthereumApplication : 
        SolanaApplication;
      count: number;
      average_reward: number;
      highest_reward: number;
    }

export type ApplicationRewardResponse<T extends Chain> = {
  data?: {
    week: Array<ApplicationReward<T>>;
    month: Array<ApplicationReward<T>>;
    year: Array<ApplicationReward<T>>;
    all: Array<ApplicationReward<T>>;
  };

  errors?: unknown;
};

export default useApplicationRewardStatistics;
