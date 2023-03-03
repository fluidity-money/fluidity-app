import { useState, useEffect } from "react";
import localforage from "localforage";

export const useSync = <T>(
  key: string,
  initial: T | undefined
): [T | undefined, (value: T | undefined) => void] => {
  const [loaded, setLoaded] = useState(false);
  const [sync, setSync] = useState<T | undefined>(initial);

  useEffect(() => {
    if (!loaded) {
      localforage.getItem(key).then((value) => {
        setSync(value as T);
        setLoaded(true);
      });
      return;
    }
    localforage.setItem(key, sync);
  }, [key, sync]);

  return [sync, setSync];
};
