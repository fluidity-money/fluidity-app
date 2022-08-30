// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import {SupportedTokens} from ".";

export const formatTweet = (uniqueCode: string, network: string, token: SupportedTokens): string => {
  return `https://twitter.com/intent/tweet?text=Requesting%20%23${token}%20on%20the%20%40fluiditymoney%20%23${network}%20faucet!%20${uniqueCode}%20%23fluiditymoney&original_referer=https://faucet.fluidity.money`;
};
