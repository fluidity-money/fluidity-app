import { addons } from '@storybook/addons';
import { themes } from '@storybook/theming';

import whiteLabel from './whitelabel';

addons.setConfig({
  theme: whiteLabel,
});