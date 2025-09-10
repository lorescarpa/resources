/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {
  Attribute,
  Directive,
  ElementRef,
  InjectionToken,
  Input,
} from '@angular/core';

let nextUniqueId = 0;

/**
 * Injection token that can be used to reference instances of `MatError`. It serves as
 * alternative token to the actual `MatError` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export const BRI_ERROR = new InjectionToken<BriErrorDirective>('BriError');

/** Single error message to be shown underneath the form-field. */
@Directive({
  selector: 'bri-error, [briError]',
  host: {
    class: 'bri-form-field-error bri-form-field-bottom-align',
    'aria-atomic': 'true',
    '[id]': 'id',
  },
  providers: [{ provide: BRI_ERROR, useExisting: BriErrorDirective }],
  standalone: true,
})
export class BriErrorDirective {
  @Input() id = `bri-error-${nextUniqueId++}`;

  constructor(
    @Attribute('aria-live') ariaLive: string,
    elementRef: ElementRef
  ) {
    // If no aria-live value is set add 'polite' as a default. This is preferred over setting
    // role='alert' so that screen readers do not interrupt the current task to read this aloud.
    if (!ariaLive) {
      elementRef.nativeElement.setAttribute('aria-live', 'polite');
    }
  }
}
