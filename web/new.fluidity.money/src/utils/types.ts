import {Dispatch, SetStateAction} from "react";

export type ReactSetter<T> = Dispatch<SetStateAction<T>>

// isInArray if a ReadonlyArray includes item
// https://github.com/microsoft/TypeScript/issues/31018
export const isInArray = <T, A extends T>(
  item: T,
  array: ReadonlyArray<A>
): item is A => array.includes(item as A);

// BaseToken is the base for any token on any network
export class BaseToken {
  constructor(
    readonly symbol: string,
    readonly name: string,
    readonly address: string,
    readonly decimals: number,
    readonly colour: string,
    readonly image: string,
  ) {};
}
