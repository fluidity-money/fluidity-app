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
