import { jsonPost } from "~/util";

const BaseUrl = "https://tweixhrmbbft7t4yadd3dwklqq0etpxl.lambda-url.ap-southeast-2.on.aws";

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
  bottles: ResponseFLYOwedForAddressBottle[],
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
