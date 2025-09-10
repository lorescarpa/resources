/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { BriDatepickerBase, BriDatepickerControl } from './datepicker-base';
import { BRI_SINGLE_DATE_SELECTION_MODEL_PROVIDER } from './date-selection-model';

@Component({
  selector: 'bri-datepicker',
  template: '',
  exportAs: 'briDatepicker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    BRI_SINGLE_DATE_SELECTION_MODEL_PROVIDER,
    { provide: BriDatepickerBase, useExisting: BriDatepickerComponent },
  ],
  standalone: true,
})
export class BriDatepickerComponent<D> extends BriDatepickerBase<
  BriDatepickerControl<D>,
  D | null,
  D
> {}
