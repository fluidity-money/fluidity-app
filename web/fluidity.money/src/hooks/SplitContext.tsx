import type {
  IClient as SplitClient,
  IBrowserSDK,
} from "@splitsoftware/splitio/types/splitio";

import { createContext, useContext, useEffect, useState } from "react";
import { SplitFactory } from "@splitsoftware/splitio";

export const SPLIT_BROWSER_KEY =
  process.env["NEXT_PUBLIC_FLU_SPLIT_BROWSER_KEY"];

type SplitWindow = Window & {
  split: IBrowserSDK | null;
};

declare let window: SplitWindow;

type SplitContextType = {
  showExperiment: (featName: string) => boolean;
  client: SplitClient | null;
  splitUser: string;
  setSplitUser: React.Dispatch<React.SetStateAction<string>>;
};

const initContext = () => ({
  showExperiment: () => false,
  client: null,
  splitUser: "",
  setSplitUser: () => {
    return;
  },
});

const SplitContext = createContext<SplitContextType>(initContext());

type ISplitContextProvider = React.PropsWithChildren<{
  splitBrowserKey: string;
  splitUser: string;
}>;

const SplitContextProvider = ({
  children,
  splitBrowserKey,
  splitUser,
}: ISplitContextProvider) => {
  const [splitUserKey, setSplitUserKey] = useState("user");

  const [splitTreatment, setSplitTreatment] = useState<SplitContextType>({
    showExperiment: () => false,
    client: null,
    splitUser: splitUserKey,
    setSplitUser: setSplitUserKey,
  });

  useEffect(() => {
    if (!splitBrowserKey || !splitUser) return;

    window["split"] = SplitFactory({
      core: {
        authorizationKey: splitBrowserKey,
        key: splitUser,
      },
      debug: false,
    });

    // This branch runs only on the client-side
    const splitClient = window["split"].client();

    (async () => {
      await splitClient.ready();

      setSplitTreatment({
        showExperiment: (featName: string) =>
          splitClient.getTreatment(featName) === "on",
        client: splitClient,
        splitUser: splitUserKey,
        setSplitUser: setSplitUserKey,
      });
    })();
  }, [splitUser]);

  return (
    <SplitContext.Provider value={splitTreatment}>
      {children}
    </SplitContext.Provider>
  );
};

const useSplitContext = () => useContext(SplitContext);

export { SplitContextProvider, useSplitContext };
