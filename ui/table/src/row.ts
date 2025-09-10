/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {
  CdkFooterRow,
  CdkFooterRowDef,
  CdkHeaderRow,
  CdkHeaderRowDef,
  CdkRow,
  CdkRowDef,
  CdkNoDataRow,
  CdkCellOutlet,
} from '@angular/cdk/table';
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ViewEncapsulation,
} from '@angular/core';

// We can't reuse `CDK_ROW_TEMPLATE` because it's incompatible with local compilation mode.
const ROW_TEMPLATE = `<ng-container cdkCellOutlet></ng-container>`;

/**
 * Header row definition for the bri-table.
 * Captures the header row's template and other header properties such as the columns to display.
 */
@Directive({
  selector: '[briHeaderRowDef]',
  providers: [
    { provide: CdkHeaderRowDef, useExisting: BriHeaderRowDefDirective },
  ],
  inputs: ['columns: briHeaderRowDef', 'sticky: briHeaderRowDefSticky'],
  standalone: true,
})
export class BriHeaderRowDefDirective extends CdkHeaderRowDef {}

/**
 * Footer row definition for the bri-table.
 * Captures the footer row's template and other footer properties such as the columns to display.
 */
@Directive({
  selector: '[briFooterRowDef]',
  providers: [
    { provide: CdkFooterRowDef, useExisting: BriFooterRowDefDirective },
  ],
  inputs: ['columns: briFooterRowDef', 'sticky: briFooterRowDefSticky'],
  standalone: true,
})
export class BriFooterRowDefDirective extends CdkFooterRowDef {}

/**
 * Data row definition for the bri-table.
 * Captures the data row's template and other properties such as the columns to display and
 * a when predicate that describes when this row should be used.
 */
@Directive({
  selector: '[briRowDef]',
  providers: [{ provide: CdkRowDef, useExisting: BriRowDefDirective }],
  inputs: ['columns: briRowDefColumns', 'when: briRowDefWhen'],
  standalone: true,
})
export class BriRowDefDirective<T> extends CdkRowDef<T> {}

/** Header template container that contains the cell outlet. Adds the right class and role. */
@Component({
  selector: 'bri-header-row, tr[bri-header-row]',
  template: ROW_TEMPLATE,
  host: {
    class: 'bri-header-row',
    role: 'row',
  },
  // See note on CdkTable for explanation on why this uses the default change detection strategy.
  // tslint:disable-next-line:validate-decorators
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'briHeaderRow',
  providers: [{ provide: CdkHeaderRow, useExisting: BriHeaderRowComponent }],
  standalone: true,
  imports: [CdkCellOutlet],
})
export class BriHeaderRowComponent extends CdkHeaderRow {}

/** Footer template container that contains the cell outlet. Adds the right class and role. */
@Component({
  selector: 'bri-footer-row, tr[bri-footer-row]',
  template: ROW_TEMPLATE,
  host: {
    class: 'bri-footer-row',
    role: 'row',
  },
  // See note on CdkTable for explanation on why this uses the default change detection strategy.
  // tslint:disable-next-line:validate-decorators
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'briFooterRow',
  providers: [{ provide: CdkFooterRow, useExisting: BriFooterRowComponent }],
  standalone: true,
  imports: [CdkCellOutlet],
})
export class BriFooterRowComponent extends CdkFooterRow {}

/** Data row template container that contains the cell outlet. Adds the right class and role. */
@Component({
  selector: 'bri-row, tr[bri-row]',
  template: ROW_TEMPLATE,
  host: {
    class: 'bri-row',
    role: 'row',
  },
  exportAs: 'briRow',
  providers: [{ provide: CdkRow, useExisting: BriRowComponent }],
  // See note on CdkTable for explanation on why this uses the default change detection strategy.
  // tslint:disable-next-line:validate-decorators
  imports: [CdkCellOutlet],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default,
  standalone: true,
})
export class BriRowComponent extends CdkRow {}

/** Row that can be used to display a message when no data is shown in the table. */
@Directive({
  selector: 'ng-template[briNoDataRow]',
  providers: [{ provide: CdkNoDataRow, useExisting: BriNoDataRowDirective }],
  standalone: true,
})
export class BriNoDataRowDirective extends CdkNoDataRow {
  override _contentClassName = 'bri-no-data-row';
}
