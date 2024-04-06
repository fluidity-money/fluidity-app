import { useUserRewardsByAddress } from "./useUserRewards";

describe("useUserRewards successfully runs", () => {
  it("should return a valid response", async () => {
    const response = await useUserRewardsByAddress(
      "arbitrum",
      "0xdb9df35a80f84971d561b57750a5b2237acca83c"
    );
    expect(response).toBeDefined();
    expect(response.data).toBeDefined();
    expect(response.data?.winners).toBeDefined();
    expect(response.data?.winners.length).toBeGreaterThan(0);

    expect(response.errors).toBeUndefined();
  });
});
