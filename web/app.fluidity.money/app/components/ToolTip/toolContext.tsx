import React, { createContext, useContext } from "react";

export const ToolContext = createContext<any | void>(null);
export const useToolTip = () => useContext(ToolContext);
