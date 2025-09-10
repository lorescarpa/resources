/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { Directive, InjectionToken, Input } from '@angular/core';

/**
 * Injection token that can be used to reference instances of `BriPrefix`. It serves as
 * alternative token to the actual `BriPrefix` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export const BRI_PREFIX = new InjectionToken<BriPrefixDirective>('BriPrefix');

/** Prefix to be placed in front of the form field. */
@Directive({
  selector: '[briPrefix], [briIconPrefix], [briTextPrefix]',
  providers: [{ provide: BRI_PREFIX, useExisting: BriPrefixDirective }],
  standalone: true,
})
export class BriPrefixDirective {
  @Input('briTextPrefix')
  set _isTextSelector(value: '') {
    this._isText = true;
  }

  _isText = false;
}
