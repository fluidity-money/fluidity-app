import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const useCache = (key: string) =>
  process.env.NODE_ENV === "production"
    ? fetcher(key)
    : useSWR(key, fetcher);

export { useCache };
