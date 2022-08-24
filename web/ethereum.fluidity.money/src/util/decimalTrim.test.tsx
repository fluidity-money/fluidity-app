// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

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