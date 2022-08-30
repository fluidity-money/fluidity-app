// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import ChainId, { chainIdFromEnv } from "./chainId";

export const appTheme =
  chainIdFromEnv() === ChainId.AuroraMainnet ? "--aurora" : "";
