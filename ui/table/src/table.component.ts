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
  Directive,
  ViewEncapsulation,
} from '@angular/core';
import {
  CdkTable,
  _CoalescedStyleScheduler,
  _COALESCED_STYLE_SCHEDULER,
  CDK_TABLE,
  STICKY_POSITIONING_LISTENER,
  HeaderRowOutlet,
  DataRowOutlet,
  NoDataRowOutlet,
  FooterRowOutlet,
} from '@angular/cdk/table';
import {
  _DisposeViewRepeaterStrategy,
  _RecycleViewRepeaterStrategy,
  _VIEW_REPEATER_STRATEGY,
} from '@angular/cdk/collections';

/**
 * Enables the recycle view repeater strategy, which reduces rendering latency. Not compatible with
 * tables that animate rows.
 */
@Directive({
  selector: 'bri-table[recycleRows], table[bri-table][recycleRows]',
  providers: [
    {
      provide: _VIEW_REPEATER_STRATEGY,
      useClass: _RecycleViewRepeaterStrategy,
    },
  ],
  standalone: true,
})
export class BriRecycleRowsDirective {}

@Component({
  selector: 'bri-table, table[bri-table]',
  exportAs: 'briTable',
  // Note that according to MDN, the `caption` element has to be projected as the **first**
  // element in the table. See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/caption
  // We can't reuse `CDK_TABLE_TEMPLATE` because it's incompatible with local compilation mode.
  template: `
    <ng-content select="caption" />
    <ng-content select="colgroup, col" />

    @if (_isNativeHtmlTable) {
    <thead role="rowgroup">
      <ng-container headerRowOutlet />
    </thead>
    <tbody class="bri-data-table__content" role="rowgroup">
      <ng-container rowOutlet />
      <ng-container noDataRowOutlet />
    </tbody>
    <tfoot role="rowgroup">
      <ng-container footerRowOutlet />
    </tfoot>
    } @else {
    <ng-container headerRowOutlet />
    <ng-container rowOutlet />
    <ng-container noDataRowOutlet />
    <ng-container footerRowOutlet />
    }
  `,
  styleUrls: ['./table.component.scss'],
  host: {
    class: 'bri-table',
    '[class.table-fixed-layout]': 'fixedLayout',
  },
  providers: [
    { provide: CdkTable, useExisting: BriTableComponent },
    { provide: CDK_TABLE, useExisting: BriTableComponent },
    { provide: _COALESCED_STYLE_SCHEDULER, useClass: _CoalescedStyleScheduler },
    // TODO(michaeljamesparsons) Abstract the view repeater strategy to a directive API so this code
    //  is only included in the build if used.
    {
      provide: _VIEW_REPEATER_STRATEGY,
      useClass: _DisposeViewRepeaterStrategy,
    },
    // Prevent nested tables from seeing this table's StickyPositioningListener.
    { provide: STICKY_POSITIONING_LISTENER, useValue: null },
  ],
  encapsulation: ViewEncapsulation.None,
  // See note on CdkTable for explanation on why this uses the default change detection strategy.
  // tslint:disable-next-line:validate-decorators
  changeDetection: ChangeDetectionStrategy.Default,
  standalone: true,
  imports: [HeaderRowOutlet, DataRowOutlet, NoDataRowOutlet, FooterRowOutlet],
})
export class BriTableComponent<T> extends CdkTable<T> {
  /** Overrides the sticky CSS class set by the `CdkTable`. */
  protected override stickyCssClass = 'bri-table-sticky';

  /** Overrides the need to add position: sticky on every sticky cell element in `CdkTable`. */
  protected override needsPositionStickyOnElement = false;
}
