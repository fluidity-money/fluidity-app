import localforage from "localforage";

// clear all token caches on window unload
export const removeOnUnload = () => {
    window.onbeforeunload = function () {
      localforage.keys()
        .then(keys =>
          keys.map(key =>
            key.startsWith("persist.tokenCache") && localforage.removeItem(key)
          )
        );
    };
    return () => {
      window.onbeforeunload = null;
    };
}
