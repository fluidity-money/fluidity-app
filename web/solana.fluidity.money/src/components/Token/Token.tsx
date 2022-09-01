// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import {TokenKind} from "components/types";
import Icon from "components/Icon";

const Token = ({ symbol, cname }: { symbol: TokenKind["symbol"]; cname?: string }) => {
  return (
    <div className={cname ?? ""}>
      <Icon src={`icon i-${symbol}`} />
      {" " + symbol}
    </div>
  );
};

export default Token;
