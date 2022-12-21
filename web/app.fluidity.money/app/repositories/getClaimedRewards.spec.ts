/**
 * @jest-environment jsdom
 */
import { renderHook, waitFor } from "@testing-library/react";
import { getClaimedRewards } from "./getClaimedRewards";

jest.setTimeout(10000);

global.fetch = require("cross-fetch");

describe("getClaimedRewards", () => {
  it("should return a valid response", async () => {
    const response = renderHook(() =>
      getClaimedRewards(
        "ethereum",
        "0xeb6b882a295d316ac62c8cfcc81c3e37c084b7c5"
      )
    );

    await waitFor(() => {
        expect(response.result.current).toBeGreaterThan(0);
    },
    { timeout: 10000 })
  });
});
