import { jsonPost } from "~/util";

type RequestProofBody = {
  address: string;
  signature: string;
};

export type RequestProofRes = {
  updated: string;
  address: string;
  index: number;
  amount: string;
  proofs: string[];
  error: string;
};

export const requestProof = (address: string, signature: string) => {
  const body = { address, signature };

  const url =
    "https://lyqieipytnj32qqga7mpgdpn7q0pxmlw.lambda-url.ap-southeast-2.on.aws/";

  return jsonPost<RequestProofBody, RequestProofRes>(url, body, {});
};
