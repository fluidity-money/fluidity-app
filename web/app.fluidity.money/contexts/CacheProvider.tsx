import { ReactNode, useEffect, useState } from "react";

import { SWRConfig } from "swr";

function localStorageProvider(sha: string) {
  if (typeof window === "undefined") return new Map();

  const key = `app-cache-${sha}`;
  // When initializing, we restore the data from `localStorage` into a map.
  const map = new Map(JSON.parse(localStorage.getItem(key) || "[]"));

  // Before unloading the app, we write back all the data into `localStorage`.
  window.addEventListener("beforeunload", () => {
    if (localStorage.getItem("purge-cache") === "true") {
      localStorage.removeItem(key);
      return;
    }
    const appCache = JSON.stringify(Array.from(map.entries()));
    localStorage.setItem(key, appCache);
  });

  // We still use the map for write & read for performance.
  return map;
}

const CacheProvider = ({
  children,
  sha,
}: {
  children: ReactNode;
  sha: string;
}) => {
  const [useCacheProvider, setCacheProvider] = useState<Map<string, string>>();

  useEffect(() => {
    try {
      setCacheProvider(localStorageProvider(sha));
    } catch (e) {
      console.warn(e);
    }
  }, []);

  return (
    <>
      {useCacheProvider ? (
        <SWRConfig value={{ provider: () => useCacheProvider, suspense: true }}>
          {children}
        </SWRConfig>
      ) : (
        children
      )}
    </>
  );
};

export default CacheProvider;
