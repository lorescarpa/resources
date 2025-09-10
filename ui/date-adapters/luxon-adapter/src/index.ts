/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { NgModule, Provider } from '@angular/core';
import {
  DateAdapter,
  BRI_DATE_FORMATS,
  BRI_DATE_LOCALE,
  BriDateFormats,
} from '@wkp/bricks/core';
import {
  BRI_LUXON_DATE_ADAPTER_OPTIONS,
  LuxonDateAdapter,
} from './luxon-date-adapter';
import { MAT_LUXON_DATE_FORMATS } from './luxon-date-formats';

export * from './luxon-date-adapter';
export * from './luxon-date-formats';

@NgModule({
  providers: [
    {
      provide: DateAdapter,
      useClass: LuxonDateAdapter,
      deps: [BRI_DATE_LOCALE, BRI_LUXON_DATE_ADAPTER_OPTIONS],
    },
  ],
})
export class LuxonDateModule {}

@NgModule({
  providers: [provideLuxonDateAdapter()],
})
export class MatLuxonDateModule {}

export function provideLuxonDateAdapter(
  formats: BriDateFormats = MAT_LUXON_DATE_FORMATS
): Provider[] {
  return [
    {
      provide: DateAdapter,
      useClass: LuxonDateAdapter,
      deps: [BRI_DATE_LOCALE, BRI_LUXON_DATE_ADAPTER_OPTIONS],
    },
    { provide: BRI_DATE_FORMATS, useValue: formats },
  ];
}
