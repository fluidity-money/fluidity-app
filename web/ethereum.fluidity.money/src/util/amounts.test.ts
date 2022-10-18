// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import {formatCurrency, tokenAmountToDecimal, shorthandAmountFormatter} from "./amounts";

describe("tokenAmountToDecimal", () => {
  it("0", () => {
    expect(tokenAmountToDecimal("0", 6)).toBe("0");
  })
  it("1, 10, 100, ...", () => {
    expect(tokenAmountToDecimal("1", 6)).toBe("0.000001");
    expect(tokenAmountToDecimal("10", 6)).toBe("0.00001");
    expect(tokenAmountToDecimal("100", 6)).toBe("0.0001");
    expect(tokenAmountToDecimal("1000", 6)).toBe("0.001");
    expect(tokenAmountToDecimal("10000", 6)).toBe("0.01");
    expect(tokenAmountToDecimal("100000", 6)).toBe("0.1");
    expect(tokenAmountToDecimal("1000000", 6)).toBe("1");
    expect(tokenAmountToDecimal("10000000", 6)).toBe("10");
  })
  it("1, 12, 123, ...", () => {
    expect(tokenAmountToDecimal("1", 6)).toBe("0.000001");
    expect(tokenAmountToDecimal("12", 6)).toBe("0.000012");
    expect(tokenAmountToDecimal("123", 6)).toBe("0.000123");
    expect(tokenAmountToDecimal("1234", 6)).toBe("0.001234");
    expect(tokenAmountToDecimal("12345", 6)).toBe("0.012345");
    expect(tokenAmountToDecimal("123456", 6)).toBe("0.123456");
    expect(tokenAmountToDecimal("1234567", 6)).toBe("1.234567");
    expect(tokenAmountToDecimal("12345678", 6)).toBe("12.345678");
  })
  it("large numbers", () => {
    expect(tokenAmountToDecimal("1000000000000", 6)).toBe("1000000");
    expect(tokenAmountToDecimal("32829382398567000000", 6)).toBe("32829382398567");
    expect(tokenAmountToDecimal("32829382398567123456", 6)).toBe("32829382398567.123456");
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

describe("shorthandAmountFormatter", () => {
  it("Amount: 0, Decimal: 1", () => {
    expect(shorthandAmountFormatter("0", 1)).toBe("0");
  })
  it("Amount: 12, Decimal: 1", () => {
    expect(shorthandAmountFormatter("12", 1)).toBe("12");
  })
  it("Amount: 1234, Decimal: 1", () => {
    expect(shorthandAmountFormatter("1234", 1)).toBe("1.2K");
  })
  it("Amount: 100000000, Decimal: 1", () => {
    expect(shorthandAmountFormatter("100000000", 1)).toBe("100M");
  })
  it("Amount: 299792458, Decimal: 1", () => {
    expect(shorthandAmountFormatter("299792458", 1)).toBe("299.8M");
  })
  it("Amount: 759878, Decimal: 1", () => {
    expect(shorthandAmountFormatter("759878", 1)).toBe("759.9K");
  })
  it("Amount: 759878, Decimal: 0", () => {
    expect(shorthandAmountFormatter("759878", 0)).toBe("760K");
  })
})
