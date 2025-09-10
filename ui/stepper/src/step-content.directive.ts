/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { Directive, TemplateRef, inject } from '@angular/core';

@Directive({
  standalone: true,
  selector: 'ng-template[briStepContent]',
})
export class BriStepContentDirective {
  _template = inject(TemplateRef);
}
