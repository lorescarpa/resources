/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { NgModule } from '@angular/core';
import { BriButtonModule } from '@wkp/bricks/button';
import { BriCalendarBodyComponent } from './calendar-body.component';
import { BriCalendarHeaderComponent } from './calendar-header.component';
import { BriCalendarComponent } from './calendar.component';
import {
  BRI_DATEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER,
  BriDatepickerContentComponent,
} from './datepicker-base';
import { BriDatepickerInputDirective } from './datepicker-input.directive';
import { BriDatepickerComponent } from './datepicker.component';
import {
  BriDatepickerToggleComponent,
  BriDatepickerToggleIconDirective,
} from './datepicker-toggle.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BriMonthViewComponent } from './month-view.component';
import { BriIconModule } from '@wkp/bricks/icon';
/* import { MatDateRangeInput } from './date-range-input';
import { MatStartDate, MatEndDate } from './date-range-input-parts';
import { MatDateRangePicker } from './date-range-picker'; */
/* import {
  MatDatepickerActions,
  MatDatepickerApply,
  MatDatepickerCancel,
} from './datepicker-actions'; */

const DATEPICKER_DECLARATIONS = [
  BriCalendarComponent,
  BriCalendarBodyComponent,
  BriDatepickerComponent,
  BriDatepickerContentComponent,
  BriDatepickerInputDirective,
  BriMonthViewComponent,
  BriCalendarHeaderComponent,
  BriDatepickerToggleComponent,
  BriDatepickerToggleIconDirective,
];

@NgModule({
  imports: [
    BriButtonModule,
    BriIconModule,
    OverlayModule,
    A11yModule,
    PortalModule,
    ReactiveFormsModule,
    ...DATEPICKER_DECLARATIONS,
    /* MatDateRangeInput,
    MatStartDate,
    MatEndDate,
    MatDateRangePicker,
    MatDatepickerActions,
    MatDatepickerCancel,
    MatDatepickerApply, */
  ],
  exports: [CdkScrollableModule, ...DATEPICKER_DECLARATIONS],
  providers: [BRI_DATEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER],
})
export class BriDatepickerModule {}
