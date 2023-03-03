import { Provider } from '~/types'
import { getProviderImgPath } from '~/util/liquidityProviders/providers';

import style from "./ProviderIcon.module.scss";

type IProviderIcon = Partial<HTMLImageElement> & {
  provider: Provider;
};

const ProviderIcon = ({ provider, className }: IProviderIcon) => (
  <img
    className={`${style.provider} ${className}`}
    src={getProviderImgPath(provider)}
    alt={provider}
  />
);

export default ProviderIcon;
