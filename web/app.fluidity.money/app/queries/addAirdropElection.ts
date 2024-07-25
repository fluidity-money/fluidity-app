import { jsonPost } from "~/util";

const BaseUrl =
  "https://duvlwhscy2.execute-api.ap-southeast-2.amazonaws.com/default/flu-create-airdrop-elections";

type RequestAirdropElection = {
  address: string;
  option: number;
  sig: string;
};

type ResponseAirdropElection = {
  address: string;
  updated: string;
  error: string;
};

export const addAirdropElection = (address: string, option: number, sig: string) => {
  const body = { address, option, sig };
  return jsonPost<RequestAirdropElection, ResponseAirdropElection>(
    BaseUrl,
    body,
    {}
  );
};
