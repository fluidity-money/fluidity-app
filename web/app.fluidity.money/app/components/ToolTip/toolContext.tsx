import { createContext, useContext } from 'react';

export const ToolContext = createContext<any>(null);
export const useToolTip = () => useContext(ToolContext);