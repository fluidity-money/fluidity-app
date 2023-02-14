import type { SWRResponse } from "swr";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

type UseCache = <Data = never>(key: string, suspense?: boolean) => SWRResponse<Data>;

const useCache: UseCache = (key: string, suspense?: boolean) => {
  return useSWR(key, fetcher, { suspense });
};

export { useCache };
