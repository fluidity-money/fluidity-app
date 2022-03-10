import {formatCurrency, tokenAmountToDecimal} from "./amounts";

describe("tokenAmountToDecimal", () => {
  it("0", () => {
    expect(tokenAmountToDecimal("0")).toBe("0");
  })
  it("1, 10, 100, ...", () => {
    expect(tokenAmountToDecimal("1")).toBe("0.000001");
    expect(tokenAmountToDecimal("10")).toBe("0.00001");
    expect(tokenAmountToDecimal("100")).toBe("0.0001");
    expect(tokenAmountToDecimal("1000")).toBe("0.001");
    expect(tokenAmountToDecimal("10000")).toBe("0.01");
    expect(tokenAmountToDecimal("100000")).toBe("0.1");
    expect(tokenAmountToDecimal("1000000")).toBe("1");
    expect(tokenAmountToDecimal("10000000")).toBe("10");
  })
  it("1, 12, 123, ...", () => {
    expect(tokenAmountToDecimal("1")).toBe("0.000001");
    expect(tokenAmountToDecimal("12")).toBe("0.000012");
    expect(tokenAmountToDecimal("123")).toBe("0.000123");
    expect(tokenAmountToDecimal("1234")).toBe("0.001234");
    expect(tokenAmountToDecimal("12345")).toBe("0.012345");
    expect(tokenAmountToDecimal("123456")).toBe("0.123456");
    expect(tokenAmountToDecimal("1234567")).toBe("1.234567");
    expect(tokenAmountToDecimal("12345678")).toBe("12.345678");
  })
  it("large numbers", () => {
    expect(tokenAmountToDecimal("1000000000000")).toBe("1000000");
    expect(tokenAmountToDecimal("32829382398567000000")).toBe("32829382398567");
    expect(tokenAmountToDecimal("32829382398567123456")).toBe("32829382398567.123456");
  })
})

describe("formatCurrency", () => {
  it("1-3 digits", () => {
    expect(formatCurrency("0")).toBe("0");
    expect(formatCurrency("12")).toBe("12");
    expect(formatCurrency("123")).toBe("123");
    expect(formatCurrency("123.45")).toBe("123.45");
  })
  it("4-5 digits", () => {
    expect(formatCurrency("1234")).toBe("1,234");
    expect(formatCurrency("12345")).toBe("12,345");
    expect(formatCurrency("12345.67")).toBe("12,345.67");
  })
  it("6+ digits", () => {
    expect(formatCurrency("12345")).toBe("12,345");
    expect(formatCurrency("12345.67")).toBe("12,345.67");
    expect(formatCurrency("123456")).toBe("123,456");
    expect(formatCurrency("123456.78")).toBe("123,456.78");
  })
})
