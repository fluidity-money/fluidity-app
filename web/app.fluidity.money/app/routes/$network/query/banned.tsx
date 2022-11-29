import {LoaderFunction} from "@remix-run/node";
import {Chain} from "~/util/chainUtils/chains";
import {isAddressBanned} from "~/util/trm";

export type BannedLoader = {
  isBanned: boolean;
}

export const loader: LoaderFunction = async ({request, params}) => {
  const {network} = params;

  const url = new URL(request.url);
  const _address = url.searchParams.get("address");
  if (!_address || !network)
    return null;

  const isBanned = await isAddressBanned(_address, network as Chain);

  return {isBanned};
}
