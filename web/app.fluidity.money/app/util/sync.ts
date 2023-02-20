import { useState, useEffect } from "react";
import localforage from "localforage";


export const useSync = <T>(key: string, initial: T | undefined): [
    T | undefined,
    (value: T | undefined) => void
] => {
    const [sync, setSync] = useState<T | undefined>(localforage.getItem(key) as T || initial);

    useEffect(() => {
        localforage.setItem(key, sync)
    }, [key, sync]);

    return [sync, setSync];
}