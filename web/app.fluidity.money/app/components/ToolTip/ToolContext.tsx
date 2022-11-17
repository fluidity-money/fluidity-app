import { createContext, useContext } from "react";

type ToolContextType =
  | {
      open: (bgColor: string, content: React.ReactNode) => void;
    }
  | Record<string, never>;

export const ToolContext = createContext<ToolContextType>({});
export const useToolTip = () => useContext(ToolContext);
