/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { Directive, InjectionToken, TemplateRef } from '@angular/core';

/**
 * Injection token that can be used to reference instances of `BriTabContent`. It serves as
 * alternative token to the actual `BriTabContent` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export const BRI_TAB_CONTENT = new InjectionToken<BriTabContentDirective>(
  'BriTabContent'
);

/** Decorates the `ng-template` tags and reads out the template from it. */
@Directive({
  selector: '[briTabContent]',
  providers: [
    { provide: BRI_TAB_CONTENT, useExisting: BriTabContentDirective },
  ],
  standalone: true,
})
export class BriTabContentDirective {
  constructor(
    /** Content for the tab. */ public template: TemplateRef<never>
  ) {}
}
