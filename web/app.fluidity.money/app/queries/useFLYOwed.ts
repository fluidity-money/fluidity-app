import { jsonPost } from "~/util";

const BaseUrl =
  "https://z9zrt4j6ri.execute-api.ap-southeast-2.amazonaws.com/default/flu-airdrop-amounts-owed-and-validate-signature-2";

type RequestFLYOwedForAddressBody = {
  address: string;
};

type ResponseFLYOwedForAddressBottle = {
  rewardTier: number;
  bottleCount: number;
};

type ResponseFLYOwedForAddress = {
  address: string;
  amount: number;
  updated: string;
  bottles: ResponseFLYOwedForAddressBottle[];
  allocated: boolean;
  error: string;
};

export const useFLYOwedForAddress = (address: string) => {
  const body = { address };
  return jsonPost<RequestFLYOwedForAddressBody, ResponseFLYOwedForAddress>(
    BaseUrl,
    body,
    {}
  );
};
