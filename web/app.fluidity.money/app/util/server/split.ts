import { isArray, isFunction, isObject } from "lodash";
import { SplitFactory } from "@splitsoftware/splitio";
import { Attributes } from "@splitsoftware/splitio/types/splitio";

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
 * @returns {T} the value you passed in or an empty array, function, object or undefined
 */

function useSplitExperiment<T extends (...vargs: unknown[]) => unknown>(
  experiment: string,
  value: T,
  args?: Attributes
): T | (() => void);
function useSplitExperiment<T>(
  experiment: string,
  value: T[],
  args?: Attributes
): T[];
function useSplitExperiment<T extends object>(
  experiment: string,
  value: object,
  args?: Attributes
): T & { [key: string]: unknown };
function useSplitExperiment<T>(
  experiment: string,
  value: T,
  args?: Attributes
): T | undefined;
function useSplitExperiment(
  experiment: string,
  value: unknown,
  args?: Attributes
): unknown | undefined {
  if (process.env.NODE_ENV !== "production") {
    return value;
  }

  const enabled = client.getTreatment(experiment, args) === "on";

  if (!enabled) {
    if (isFunction(value)) {
      console.log("Returning empty function");
      return () => {
        return;
      };
    }

    if (isArray(value)) {
      return [];
    }

    if (isObject(value)) {
      return {};
    }

    return undefined;
  }

  return value;
}

export { useSplitExperiment };
