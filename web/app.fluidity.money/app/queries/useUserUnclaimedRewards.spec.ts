import { installGlobals } from "@remix-run/node";
import useUserUnclaimedRewards from "./useUserUnclaimedRewards";

//beforeAll(() => {
//  installGlobals();
//});

describe("useUserUnclaimedRewards", () => {
  it("should return a valid response", async () => {
    const { data, error } = await useUserUnclaimedRewards(
      "ethereum",
      "0xeb6b882a295d316ac62c8cfcc81c3e37c084b7c5"
    );
    expect(data).toBeDefined();
    expect(data?.ethereum_pending_winners).toBeDefined();
    expect(error).toBeUndefined();
  });
});
