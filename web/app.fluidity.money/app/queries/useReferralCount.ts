import { gql, jsonPost } from "~/util";

const queryActiveByReferrerAddress = gql`
  query getClaimedReferrerReferralCount(
    $address: String!
    $epoch: lootbox_epoch!
  ) {
    lootbox_referrals_aggregate(
      where: {
        referrer: { _eq: $address }
        active: { _eq: true }
        epoch: { _eq: $epoch }
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

const queryActiveByRefereeAddress = gql`
  query getClaimedReferreeReferralCount(
    $address: String!
    $epoch: lootbox_epoch!
  ) {
    lootbox_referrals_aggregate(
      where: {
        referee: { _eq: $address }
        active: { _eq: true }
        epoch: { _eq: $epoch }
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

const queryInactiveByRefereeAddress = gql`
  query getClaimedReferrerReferralCount(
    $address: String!
    $epoch: lootbox_epoch!
  ) {
    lootbox_referrals_aggregate(
      where: {
        referee: { _eq: $address }
        active: { _eq: false }
        epoch: { _eq: $epoch }
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

type ReferralCountByAddressBody = {
  query: string;
  variables: {
    address: string;
    epoch: string;
  };
};

type ReferralCountRes = {
  data?: {
    lootbox_referrals_aggregate: {
      aggregate: {
        count: number;
      };
    };
  };
  errors?: unknown;
};

const useActiveReferralCountByReferrerAddress = (
  address: string,
  epoch: string
) => {
  const variables = {
    address,
    epoch,
  };

  const body = {
    query: queryActiveByReferrerAddress,
    variables,
  };

  const url = "https://fluidity.hasura.app/v1/graphql";

  return jsonPost<ReferralCountByAddressBody, ReferralCountRes>(
    url,
    body,
    process.env.FLU_HASURA_SECRET
      ? {
          "x-hasura-admin-secret": process.env.FLU_HASURA_SECRET,
        }
      : {}
  );
};

const useActiveReferralCountByRefereeAddress = (
  address: string,
  epoch: string
) => {
  const variables = {
    address,
    epoch,
  };

  const body = {
    query: queryActiveByRefereeAddress,
    variables,
  };

  const url = "https://fluidity.hasura.app/v1/graphql";

  return jsonPost<ReferralCountByAddressBody, ReferralCountRes>(
    url,
    body,
    process.env.FLU_HASURA_SECRET
      ? {
          "x-hasura-admin-secret": process.env.FLU_HASURA_SECRET,
        }
      : {}
  );
};

const useInactiveReferralCountByRefereeAddress = (
  address: string,
  epoch: string
) => {
  const variables = {
    address,
    epoch,
  };

  const body = {
    query: queryInactiveByRefereeAddress,
    variables,
  };

  const url = "https://fluidity.hasura.app/v1/graphql";

  return jsonPost<ReferralCountByAddressBody, ReferralCountRes>(
    url,
    body,
    process.env.FLU_HASURA_SECRET
      ? {
          "x-hasura-admin-secret": process.env.FLU_HASURA_SECRET,
        }
      : {}
  );
};

export {
  useActiveReferralCountByReferrerAddress,
  useActiveReferralCountByRefereeAddress,
  useInactiveReferralCountByRefereeAddress,
};
