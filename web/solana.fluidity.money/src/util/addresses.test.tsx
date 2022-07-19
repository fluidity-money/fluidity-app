import { trimAddress } from "./addresses";

describe("trimAddress", () => {

  it("3EfxpR8Ud2G9WWtzZ31umyUvnSyhywHNRJuEXkFbnxc5", () => {
    expect(trimAddress("3EfxpR8Ud2G9WWtzZ31umyUvnSyhywHNRJuEXkFbnxc5")).toBe("3EfxpR..Fbnxc5");
  })
})