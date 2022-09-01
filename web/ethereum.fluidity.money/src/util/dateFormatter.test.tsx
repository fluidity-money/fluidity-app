// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import dateFormatter from "./dateFormatter";

describe("dateFormatter", () => {
  it("2009-10-15 04:30", () => {
    expect(dateFormatter("2009-10-15 04:30")).toBe("04:30:00 AM, 15 October 2009");
  })
  it("2022-1-10 00:00", () => {
    expect(dateFormatter("2022-1-10 00:00")).toBe("12:00:00 AM, 10 January 2022");
  })
  it("2069-06-10 14:59:30", () => {
    expect(dateFormatter("2069-06-10 14:59:30")).toBe("02:59:30 PM, 10 June 2069");
  })
  it("2048-04-15 18:00", () => {
    expect(dateFormatter("2048-04-15 18:00")).toBe("06:00:00 PM, 15 April 2048");
  })
  it("2037-02-15 15:00", () => {
    expect(dateFormatter("2037-02-15 15:00")).toBe("03:00:00 PM, 15 February 2037");
  })
  it("2033-03-15 20:15", () => {
    expect(dateFormatter("2033-03-15 20:15")).toBe("08:15:00 PM, 15 March 2033");
  })
  it("2030-05-1 17:15", () => {
    expect(dateFormatter("2030-05-1 17:15")).toBe("05:15:00 PM, 1 May 2030");
  })
  it("2030-07-12 23:59", () => {
    expect(dateFormatter("2030-07-12 23:59")).toBe("11:59:00 PM, 12 July 2030");
  })
  it("2030-08-12 03:30", () => {
    expect(dateFormatter("2030-08-12 03:30")).toBe("03:30:00 AM, 12 August 2030");
  })
  it("2075-10-12 08:45", () => {
    expect(dateFormatter("2075-10-12 08:45")).toBe("08:45:00 AM, 12 October 2075");
  })
  it("2011-11-11 11:11", () => {
    expect(dateFormatter("2011-11-11 11:11")).toBe("11:11:00 AM, 11 November 2011");
  })
  it("2024-12-01 11:11", () => {
    expect(dateFormatter("2024-12-01 11:11")).toBe("11:11:00 AM, 1 December 2024");
  })
  it("", () => {
    expect(dateFormatter("")).toBe("-");
  })
})