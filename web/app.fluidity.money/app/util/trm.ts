import {jsonPost} from "./api/rpc";
import {Chain} from "./chainUtils/chains";


enum RiskScoreLevel {
  Unknown = 0,
  Low     = 1,
  Medium  = 5,
  High    = 10,
  Severe  = 15,
};

enum RiskType {
  COUNTERPARTY,
  INDIRECT,
  OWNERSHIP
};

type AddressRiskRequest = Array<{
  address: string;
  chain: Chain;
  // internal ID for the client - should be anonymous
  accountExternalId?: string;
}>;

type AddressRiskIndicator = {
  category: string;
  categoryId: string;
  categoryRiskScoreLevel: RiskScoreLevel;
  categoryRiskScoreLevelLabel: string;
  // e.g. "59891.073557359"
  incomingVolumeUsd: string;
  outgoingVolumeUsd: string;
  riskType: RiskType;
  totalVolumeUsd: string;
};

type Entity = {
  category: string;
  categoryId: string;
  entity?: string;
  riskScoreLevel: RiskScoreLevel;
  riskScoreLevelLabel: string;
  trmUrn: string;
  trmAppUrl: string;
}

type AddressRiskResponse = Array<{
  // internal ID for the client - should be anonymous
  accountExternalId: string;
  // lowercase for ethereum
  address: string
  addressRiskIndicators: Array<AddressRiskIndicator>;
  addressSubmitted: string;
  chain: Chain;
  entities: Array<Entity>;
  trmAppUrl: string;
}>;

const fetchAddressRisk = async (address: string, network: Chain) => {
  const body: AddressRiskRequest = [{address, chain: network}];
  const trmUrl = process.env.TRM_URL ?? "";
  return jsonPost<AddressRiskRequest, AddressRiskResponse>(trmUrl, body)
};

const getAddressRisk = async (address: string, network: Chain): Promise<RiskScoreLevel> => {
  const risks = await fetchAddressRisk(address, network)
  const [risk] = risks;
  const indicators = risk.addressRiskIndicators;
  const [indicator] = indicators;
  return indicator.categoryRiskScoreLevel;
};

const isAddressBanned = async (address: string, network: Chain): Promise<boolean> => {
  const risk = await getAddressRisk(address, network);
  return risk >= RiskScoreLevel.High;
};

export {getAddressRisk, isAddressBanned}
