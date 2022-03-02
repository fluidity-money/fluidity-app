import {createContext} from "react";

export interface scrollContext {
  loaded: {
    index: number,
    length: number,
    offset: string
  },
  nowLeaving: {
    originIndex: number,
    destinationIndex: number,
  }
}

export const ScrollContext = createContext<scrollContext>({
  loaded: {
    index: 0,
    length: 0,
    offset: "",
  },
  nowLeaving: {
    originIndex: 0,
    destinationIndex: 0
  } 
})
