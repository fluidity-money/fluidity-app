import type {
  IClient as SplitClient,
  IBrowserSDK,
} from "@splitsoftware/splitio/types/splitio";

import { createContext, useEffect, useState } from "react";
import { SplitFactory } from "@splitsoftware/splitio";

type SplitWindow = Window & {
  split: IBrowserSDK | null;
};

declare let window: SplitWindow;

type SplitContextType = {
  showExperiment: (featName: string) => boolean;
  client: SplitClient | null;
};

const initContext = () => ({ showExperiment: () => false, client: null });

const SplitContext = createContext<SplitContextType>(initContext());

type ISplitContextProvider = React.PropsWithChildren<{
  splitBrowserKey: string;
  splitUser: string;
  splitClientFeatures: string[];
}>;

const SplitContextProvider = ({
  children,
  splitBrowserKey,
  splitUser,
  splitClientFeatures = [],
}: ISplitContextProvider) => {
  const [splitTreatment, setSplitTreatment] = useState<SplitContextType>(
    initContext()
  );

  useEffect(() => {
    if (!(splitBrowserKey && splitUser && splitClientFeatures.length)) return;

    window["split"] =
      window["split"] ||
      SplitFactory({
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

      const featureFlags = splitClientFeatures.reduce(
        (flags, featName) => ({
          ...flags,
          [featName]: splitClient.getTreatment(featName),
        }),
        {} as { [featName: string]: string }
      );

      setSplitTreatment({
        showExperiment: (featName: string) => featureFlags[featName] === "on",
        client: splitClient,
      });
    })();
  }, []);

  return (
    <SplitContext.Provider value={splitTreatment}>
      {children}
    </SplitContext.Provider>
  );
};

export { SplitContextProvider, SplitContext };
