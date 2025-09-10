import { inject } from '@angular/core';
import { BriIconRegistry } from './icon-registry';

export const injectIcons = (
  ...params: Parameters<(typeof BriIconRegistry.prototype)['register']>
): void => {
  inject(BriIconRegistry).register(...params);
};
