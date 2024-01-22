import { installGlobals } from "@remix-run/node";
import { useUserRewardsByAddress } from "./useUserRewards";

beforeAll(() => {
  installGlobals();
});

describe("useUserRewards successfully runs", () => {
  it("should return a valid response", async () => {
    const response = await useUserRewardsByAddress(
      "ethereum",
      "0xeb6b882a295d316ac62c8cfcc81c3e37c084b7c5"
    );
    expect(response).toBeDefined();
    expect(response.data).toBeDefined();
    expect(response.data?.winners).toBeDefined();
    expect(response.data?.winners.length).toBeGreaterThan(0);

    expect(response.errors).toBeUndefined();
  });
});
