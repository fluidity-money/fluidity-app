import { Provider } from '~/types'
import { getProviderImgPath } from '~/util/liquidityProviders/providers';

type IProviderIcon = {
  provider: Provider;
  style?: React.CSSProperties;
  className?: string;
};

const ProviderIcon = ({ provider, className='', style={}}: IProviderIcon) => (
  <img
    style={style}
    className={className}
    src={getProviderImgPath(provider)}
    alt={provider}
  />
);

export default ProviderIcon;
