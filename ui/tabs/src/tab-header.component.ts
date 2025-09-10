/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { Directionality } from '@angular/cdk/bidi';
import { CdkObserveContent } from '@angular/cdk/observers';
import { Platform } from '@angular/cdk/platform';
import { ViewportRuler } from '@angular/cdk/scrolling';
import {
  ANIMATION_MODULE_TYPE,
  AfterContentChecked,
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  Optional,
  QueryList,
  ViewChild,
  ViewEncapsulation,
  booleanAttribute,
} from '@angular/core';
import { BriInkBar } from './ink-bar.directive';
import { BriPaginatedTabHeaderDirective } from './paginated-tab-header.directive';
import { BriTabLabelWrapperDirective } from './tab-label-wrapper.directive';

/**
 * The header of the tab group which displays a list of all the tabs in the tab group. Includes
 * an ink bar that follows the currently selected tab. When the tabs list's width exceeds the
 * width of the header container, then arrows will be displayed to allow the user to scroll
 * left and right across the header.
 * @docs-private
 */
@Component({
  selector: 'bri-tab-header',
  templateUrl: './tab-header.component.html',
  styleUrl: './tab-header.component.scss',
  encapsulation: ViewEncapsulation.None,
  // tslint:disable-next-line:validate-decorators
  changeDetection: ChangeDetectionStrategy.Default,
  host: {
    class: 'bri-tab-header',
    '[class.bri-tab-header-pagination-controls-enabled]':
      '_showPaginationControls',
    '[class.bri-tab-header-rtl]': "_getLayoutDirection() == 'rtl'",
  },
  standalone: true,
  imports: [CdkObserveContent],
})
export class BriTabHeaderComponent
  extends BriPaginatedTabHeaderDirective
  implements AfterContentChecked, AfterContentInit, AfterViewInit, OnDestroy
{
  @ContentChildren(BriTabLabelWrapperDirective, { descendants: false })
  _items!: QueryList<BriTabLabelWrapperDirective>;
  @ViewChild('tabListContainer', { static: true })
  _tabListContainer!: ElementRef;
  @ViewChild('tabList', { static: true }) _tabList!: ElementRef;
  @ViewChild('tabListInner', { static: true }) _tabListInner!: ElementRef;
  @ViewChild('nextPaginator') _nextPaginator!: ElementRef<HTMLElement>;
  @ViewChild('previousPaginator') _previousPaginator!: ElementRef<HTMLElement>;
  _inkBar!: BriInkBar;

  /** Whether the ripple effect is disabled or not. */
  @Input({ transform: booleanAttribute })
  disableRipple = false;

  constructor(
    elementRef: ElementRef,
    changeDetectorRef: ChangeDetectorRef,
    viewportRuler: ViewportRuler,
    @Optional() dir: Directionality,
    ngZone: NgZone,
    platform: Platform,
    @Optional() @Inject(ANIMATION_MODULE_TYPE) animationMode?: string
  ) {
    super(
      elementRef,
      changeDetectorRef,
      viewportRuler,
      dir,
      ngZone,
      platform,
      animationMode
    );
  }

  override ngAfterContentInit() {
    this._inkBar = new BriInkBar(this._items);
    super.ngAfterContentInit();
  }

  protected _itemSelected(event: KeyboardEvent) {
    event.preventDefault();
  }
}
