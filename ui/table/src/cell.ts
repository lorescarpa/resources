/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { Directive, Input } from '@angular/core';
import {
  CdkCell,
  CdkCellDef,
  CdkColumnDef,
  CdkFooterCell,
  CdkFooterCellDef,
  CdkHeaderCell,
  CdkHeaderCellDef,
} from '@angular/cdk/table';

/**
 * Cell definition for the bri-table.
 * Captures the template of a column's data row cell as well as cell-specific properties.
 */
@Directive({
  selector: '[briCellDef]',
  providers: [{ provide: CdkCellDef, useExisting: BriCellDefDirective }],
  standalone: true,
})
export class BriCellDefDirective extends CdkCellDef {}

/**
 * Header cell definition for the bri-table.
 * Captures the template of a column's header cell and as well as cell-specific properties.
 */
@Directive({
  selector: '[briHeaderCellDef]',
  providers: [
    { provide: CdkHeaderCellDef, useExisting: BriHeaderCellDefDirective },
  ],
  standalone: true,
})
export class BriHeaderCellDefDirective extends CdkHeaderCellDef {}

/**
 * Footer cell definition for the bri-table.
 * Captures the template of a column's footer cell and as well as cell-specific properties.
 */
@Directive({
  selector: '[briFooterCellDef]',
  providers: [
    { provide: CdkFooterCellDef, useExisting: BriFooterCellDefDirective },
  ],
  standalone: true,
})
export class BriFooterCellDefDirective extends CdkFooterCellDef {}

/**
 * Column definition for the bri-table.
 * Defines a set of cells available for a table column.
 */
@Directive({
  selector: '[briColumnDef]',
  inputs: ['sticky'],
  providers: [
    { provide: CdkColumnDef, useExisting: BriColumnDefDirective },
    {
      provide: 'BRI_SORT_HEADER_COLUMN_DEF',
      useExisting: BriColumnDefDirective,
    },
  ],
  standalone: true,
})
export class BriColumnDefDirective extends CdkColumnDef {
  /** Unique name for this column. */
  @Input('briColumnDef')
  override get name(): string {
    return this._name;
  }
  override set name(name: string) {
    this._setNameInput(name);
  }

  /**
   * Add "bri-column-" prefix in addition to "cdk-column-" prefix.
   * In the future, this will only add "bri-column-" and columnCssClassName
   * will change from type string[] to string.
   * @docs-private
   */
  protected override _updateColumnCssClassName() {
    super._updateColumnCssClassName();
    this._columnCssClassName!.push(`bri-column-${this.cssClassFriendlyName}`);
  }
}

/** Header cell template container that adds the right classes and role. */
@Directive({
  selector: 'bri-header-cell, th[bri-header-cell]',
  host: {
    class: 'bri-header-cell',
    role: 'columnheader',
  },
  standalone: true,
})
export class BriHeaderCellDirective extends CdkHeaderCell {}

/** Footer cell template container that adds the right classes and role. */
@Directive({
  selector: 'bri-footer-cell, td[bri-footer-cell]',
  host: {
    class: 'bri-footer-cell',
  },
  standalone: true,
})
export class BriFooterCellDirective extends CdkFooterCell {}

/** Cell template container that adds the right classes and role. */
@Directive({
  selector: 'bri-cell, td[bri-cell]',
  host: {
    class: 'bri-cell',
  },
  standalone: true,
})
export class BriCellDirective extends CdkCell {}
