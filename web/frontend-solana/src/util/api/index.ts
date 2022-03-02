import fluidity, { headers } from "util/api/fluidity";
import Routes from './types';

export const root_url = (() => {
  const api_url = process.env.REACT_APP_API_URL;
  return api_url ?? "";
})();

export const root_websocket = (() => {
  const websocket = process.env.REACT_APP_WEBSOCKET;
  return websocket ?? "";
})();

export const apiPOST = async<T extends keyof Routes>(path: T) => {
  const response = await (fluidity.post<Routes[T]>(
    root_url+path,
    { headers: headers })
  );

  return response.data;
};

export const apiPOSTBody =
  async<T extends keyof Routes>(path: T,
    body: Record<string, string | number | string[]>) => {

    const response = await fluidity.post<Routes[T]>(root_url + path, body, {
    headers: headers
  });

  return response.data;
};
