// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import { trimAddress } from "./addresses";

describe("trimAddress", () => {

  it("3EfxpR8Ud2G9WWtzZ31umyUvnSyhywHNRJuEXkFbnxc5", () => {
    expect(trimAddress("3EfxpR8Ud2G9WWtzZ31umyUvnSyhywHNRJuEXkFbnxc5")).toBe("3EfxpR..Fbnxc5");
  })
})