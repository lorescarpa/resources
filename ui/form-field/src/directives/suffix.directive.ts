/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { Directive, InjectionToken, Input } from '@angular/core';

/**
 * Injection token that can be used to reference instances of `BriSuffix`. It serves as
 * alternative token to the actual `BriSuffix` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export const BRI_SUFFIX = new InjectionToken<BriSuffixDirective>('BriSuffix');

/** Suffix to be placed at the end of the form field. */
@Directive({
  selector: '[briSuffix], [briIconSuffix], [briTextSuffix]',
  providers: [{ provide: BRI_SUFFIX, useExisting: BriSuffixDirective }],
  standalone: true,
})
export class BriSuffixDirective {
  @Input('briTextSuffix')
  set _isTextSelector(value: '') {
    this._isText = true;
  }

  _isText = false;
}
