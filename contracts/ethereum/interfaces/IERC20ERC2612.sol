// SPDX-License-Identifier: GPL

// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

pragma solidity 0.8.16;
pragma abicoder v2;

import "./IERC20.sol";
import "./IERC2612.sol";

interface IERC20ERC2612 is IERC20, IERC2612 {}
