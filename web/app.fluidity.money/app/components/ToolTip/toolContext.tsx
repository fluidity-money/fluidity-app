import { createContext, useContext } from "react";

export const ToolContext = createContext({});
export const useToolTip = () => useContext(ToolContext);
