import { Provider } from '~/types'
import { getProviderImgPath } from '~/util/liquidityProviders/providers';

type IProviderIcon = Partial<HTMLImageElement> & {
  provider: Provider;
  style?: React.CSSProperties;
};

const ProviderIcon = ({ provider, className, style}: IProviderIcon) => (
  <img
    style={style}
    className={className}
    src={getProviderImgPath(provider)}
    alt={provider}
  />
);

export default ProviderIcon;
