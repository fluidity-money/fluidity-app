import { decimalTrim } from "./decimalTrim";

describe("decimalTrim", () => {
  it("0.22235233", () => {
    expect(decimalTrim("0.22235233", 3)).toBe("0.222");
  })
  it("218814.22235233", () => {
    expect(decimalTrim("218814.69235233", 1)).toBe("218814.6");
  })
  it("218814.22235233", () => {
    expect(decimalTrim("218814.69235233", 0)).toBe("218814.69235233");
  })
  it("3.141592653589793238", () => {
    expect(decimalTrim("3.141592653589793238", 6)).toBe("3.141592");
  })
})