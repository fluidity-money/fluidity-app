import { padNumStart } from "./numberPadder";

describe("amountToDecimalString", () => {

  it("num: 344, padLen: 5, padding: 00", () => {
    expect(padNumStart(344, 5, "00")).toBe("0000344");
  })

  it("num: 65555, padLen: 9, padding: 7", () => {
    expect(padNumStart(65555, 9, "7")).toBe("777765555");
  })

  it("num: 134, padLen: 2, padding: 1", () => {
    expect(padNumStart(134, 2, "1")).toBe("134");
  })
})