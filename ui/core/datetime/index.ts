/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { NgModule, Provider } from '@angular/core';
import { DateAdapter } from './date-adapter';
import { BRI_DATE_FORMATS, BriDateFormats } from './date-formats';
import { NativeDateAdapter } from './native-date-adapter';
import { BRI_NATIVE_DATE_FORMATS } from './native-date-formats';

export * from './date-adapter';
export * from './date-formats';
export * from './native-date-adapter';
export * from './native-date-formats';

@NgModule({
  providers: [{ provide: DateAdapter, useClass: NativeDateAdapter }],
})
export class NativeDateModule {}

@NgModule({
  providers: [provideNativeDateAdapter()],
})
export class BriNativeDateModule {}

export function provideNativeDateAdapter(
  formats: BriDateFormats = BRI_NATIVE_DATE_FORMATS
): Provider[] {
  return [
    { provide: DateAdapter, useClass: NativeDateAdapter },
    { provide: BRI_DATE_FORMATS, useValue: formats },
  ];
}
