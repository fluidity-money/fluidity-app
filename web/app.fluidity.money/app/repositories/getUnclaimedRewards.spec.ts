/**
 * @jest-environment jsdom
 */
import { getUnclaimedRewards } from "./getUnclaimedRewards";
import { renderHook, waitFor } from "@testing-library/react";

jest.setTimeout(10000);

global.fetch = require("cross-fetch");

describe("getUnclaimedRewards", () => {
  it("should return a valid response", async () => {
    const res = renderHook(() =>
        getUnclaimedRewards(
            "0xeb6b882a295d316ac62c8cfcc81c3e37c084b7c5",
            "ethereum"
        )
    )

    await waitFor(() => {
        expect(res.result.current.loading).toBe(false);
    }, {
        timeout: 10000
    })

    const { unclaimedTxs, unclaimedTokens, userUnclaimedRewards } =
      res.result.current;

    expect(unclaimedTxs).toBeDefined();
    expect(unclaimedTokens).toBeDefined();
    expect(userUnclaimedRewards).toBeDefined();
  });
});
