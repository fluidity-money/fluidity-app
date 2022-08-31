// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

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
    {},
    { headers: headers })
  );

  return response.data;
};

export const apiPOSTBody =
  async<T extends keyof Routes>(path: T,
    body: Record<string, string | number>) => {

  const response = await fluidity.post<Routes[T]>(root_url+path, body, {
    headers: headers
  });

  return response.data;
};
