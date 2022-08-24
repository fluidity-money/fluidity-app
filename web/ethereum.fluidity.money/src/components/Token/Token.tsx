// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import { TokenKind } from "components/types";
import Icon from "components/Icon";

const Token = ({ token, cname }: { token: TokenKind; cname?: string }) => {
  return (
    <div className={cname ?? ""}>
      <Icon src={`icon i-${token.symbol}`} />
      {" " + token!.symbol}
    </div>
  );
};

export default Token;
