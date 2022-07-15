import * as numbers from "./numbers";

describe("amountToDecimalString", () => {
  it("Amount: 299, Decimal: 2", () => {
    expect(numbers.amountToDecimalString("299", 2)).toBe("2.99");
  })
  it("Amount: 5000, Decimal: 5", () => {
    expect(numbers.amountToDecimalString("5000", 5)).toBe("0.05");
  })
  it("Amount: 15000, Decimal: 3", () => {
    expect(numbers.amountToDecimalString("5000", 3)).toBe("5");
  })
  it("Amount: 70, Decimal: 0", () => {
    expect(numbers.amountToDecimalString("70", 0)).toBe(".7");
  })
  it("Amount: 3141592653589793238, Decimal: 10", () => {
    expect(numbers.amountToDecimalString("3141592653589793238", 18)).toBe("3.141592653589793238");
  })
  it("Amount: 3141592653589793238, Decimal: 10", () => {
    expect(numbers.amountToDecimalString("3141592653589793238", 10)).toBe("314159265.3589793238");
  })
})

describe("clearTrailingZeros", () => {
    it("2000.000", () => {
      expect(numbers.clearTrailingZeros("2000.000")).toBe("2000");
    })

    it("1234.001", () => {
        expect(numbers.clearTrailingZeros("1234.001")).toBe("1234.001");
    })

    it("10.000", () => {
        expect(numbers.clearTrailingZeros("10.000")).toBe("10");
    })
})