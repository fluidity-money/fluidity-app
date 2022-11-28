import { ReactFragment, ReactElement, ReactNode, useEffect, useState, Fragment } from "react";

import { SWRConfig } from "swr"

function localStorageProvider() {
    if (typeof window === "undefined")
        return new Map()

    // When initializing, we restore the data from `localStorage` into a map.
    const map = new Map(JSON.parse(localStorage.getItem('app-cache') || '[]'))
  
    // Before unloading the app, we write back all the data into `localStorage`.
    window.addEventListener('beforeunload', () => {
      const appCache = JSON.stringify(Array.from(map.entries()))
      localStorage.setItem('app-cache', appCache)
    })
  
    // We still use the map for write & read for performance.
    return map
}

const CacheProvider = ({ children }: { children: ReactNode }) => {
    const [useCacheProvider, setCacheProvider] = useState<Map<string, string>>()

    useEffect(() => {
        setCacheProvider(localStorageProvider())
    }, [])

    return <>
        { useCacheProvider ?
        <SWRConfig value={{provider: () => useCacheProvider,}}>
            {children}
        </SWRConfig> : children
        }
    </>
}

export default CacheProvider;