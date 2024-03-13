// SPDX-License-Identifier: GPL

// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

pragma solidity 0.8.16;
pragma abicoder v2;

import "./BaseNativeToken.sol";

contract FlyToken is BaseNativeToken {
    constructor() BaseNativeToken("Fluidity", "FLY", 6) {
      _mint(0x6aB1fe6dF702C8b3C62F16a34E00CbE215d91345, 1_000_000_000 * 1e6);
    }
}
