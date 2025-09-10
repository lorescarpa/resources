import {
  ENVIRONMENT_INITIALIZER,
  EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
} from '@angular/core';
import { BriIconRegistry } from './icon-registry';
import { BriIcon } from './types';

export const provideSvgIcons = (
  icons: BriIcon | BriIcon[]
): EnvironmentProviders => {
  return makeEnvironmentProviders([
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useValue() {
        inject(BriIconRegistry).register(icons);
      },
    },
  ]);
};
