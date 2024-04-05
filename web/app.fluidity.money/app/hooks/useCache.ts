import type { SWRResponse, SWRConfiguration } from "swr";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

type UseCache = <Data = never>(
  key: string,
  suspense?: boolean,
  config?: SWRConfiguration
) => SWRResponse<Data>;

const useCache: UseCache = (key: string, suspense?: boolean, config = {}) => {
  return useSWR(key, fetcher, {
    ...config,
    errorRetryCount: 0,
    refreshInterval: 10000, // 10 seconds
    suspense,
  });
};

export { useCache };
