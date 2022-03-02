import {createContext} from "react";

export interface redemptionContext {
  value: string,
  setValue: React.Dispatch<React.SetStateAction<string>>
  submit: () => void
}

export const RedemptionContext = createContext<redemptionContext>({
  value: "",
  setValue: () => 0,
  submit: () => 0,
})
