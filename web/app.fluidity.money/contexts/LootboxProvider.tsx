
import { createContext } from "react";

type LootboxType = {
  epochName: string
};

const LootboxContext = createContext<LootboxType>({ epochName: "" });

interface ILootboxProviderProps {
  children: React.ReactNode;
}

const LootboxProvider = ({ children }: ILootboxProviderProps) => {
  return (
    <>

    </>
  );
};

export default LootboxProvider;
