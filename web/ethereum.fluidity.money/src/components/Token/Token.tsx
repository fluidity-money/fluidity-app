import {TokenKind} from "components/types";
import Icon from "components/Icon";

const Token = ({ token, cname }: { token: TokenKind; cname?: string }) => {
  return (
    <div className={cname ?? ""}>
      <Icon src={`icon i-${token.type}`} />
      {" " + token!.type}
    </div>
  );
};

export default Token;
