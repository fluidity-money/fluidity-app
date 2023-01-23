import { isArray, isObject } from "lodash";
import { SplitFactory } from "@splitsoftware/splitio";
import { Attributes } from "@splitsoftware/splitio/types/splitio";

/**
 * @description
 * Can return the input value if the experiment is active.
 * Otherwise it will return an empty array or an empty object.
*/
type TypeResult<T> = 
    T extends string ? string | undefined : 
    T extends number ? number | undefined : 
    T extends boolean ? boolean | undefined : 
    T extends Array<infer U> ? Array<U> : 
    T extends object ? object & Record<string, unknown> :
    never;

type ExperimentalValue<T> = string | number | boolean | Array<T> | object;

const sdk = SplitFactory({
    core: {
        authorizationKey: process.env.SPLIT_API_KEY ?? "",
        key: "server",
    },
});

const client = sdk.client();

/**
 * @param {string} experiment
 * @param {T} value
 * 
 * @description
 * Server only version of the split experiment hook
 * @returns {T} the value you passed in or an empty array, object or undefined
 */
function useSplitExperiment<T>(
    experiment: string, 
    value: ExperimentalValue<T>,
    args?: Attributes
): TypeResult<T> {
  if (process.env.NODE_ENV !== "production") {
    return value as TypeResult<T>;
  }

  const enabled = client.getTreatment(experiment, args) === "on";

  if (!enabled) {
    if (isArray(value)) {
        return [];
    }

    if (isObject(value)) {
        return {} as TypeResult<T>;
    }

    return undefined;
}

  return value as TypeResult<T>;
}

export { 
    useSplitExperiment
};