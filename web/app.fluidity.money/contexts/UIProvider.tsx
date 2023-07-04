import { createContext } from "react"

type UIContextShape = {
  toggleConnectWalletModal?: () => void
}

export const UIContext = createContext<UIContextShape>({})
