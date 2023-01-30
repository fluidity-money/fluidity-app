import type { SWRResponse } from "swr";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

type UseCache = <Data = never>(key: string) => SWRResponse<Data>;

const useCache: UseCache = (key) => useSWR(key, fetcher);

export { useCache };
