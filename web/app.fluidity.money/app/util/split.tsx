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
  features: { [featName: string]: string };
  client: SplitClient | null;
};

const initContext = () => ({ features: {}, client: null });

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
        {}
      );

      setSplitTreatment({ features: featureFlags, client: splitClient });
    })();
  }, []);

  return (
    <SplitContext.Provider value={splitTreatment}>
      {children}
    </SplitContext.Provider>
  );
};

export { SplitContextProvider, SplitContext };
