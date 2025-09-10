/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Optional,
  Output,
  ViewEncapsulation,
  booleanAttribute,
  numberAttribute,
} from '@angular/core';
import { BriIconButtonComponent } from '@wkp/bricks/button';
import { BriIconComponent, injectIcons } from '@wkp/bricks/icon';
import { HasInitialized, mixinInitialized } from '@wkp/bricks/core';
import {
  BRI_PAGINATOR_DEFAULT_OPTIONS,
  BriPaginatorDefaultOptions,
} from './paginator-default-options';
import { generateRange } from './paginator.functions';
import {
  arrowBackIcon,
  arrowForthIcon,
} from '@wkp/bricks/svg/navigation-and-action';

/** The default page size if there is no page size and there are no provided page size options. */
const DEFAULT_PAGE_SIZE = 50;

/** Object that can used to configure the underlying `BriSelect` inside a `BriPaginator`. */
export interface BriPaginatorSelectConfig {
  /** Whether to center the active option over the trigger. */
  disableOptionCentering?: boolean;

  /** Classes to be passed to the select panel. */
  panelClass?: string | string[] | Set<string> | { [key: string]: any };
}

/**
 * Change event object that is emitted when the user selects a
 * different page size or navigates to another page.
 */
export class PageEvent {
  /** The current page index. */
  pageIndex!: number;

  /**
   * Index of the page that was selected previously.
   * @breaking-change 8.0.0 To be made into a required property.
   */
  previousPageIndex?: number;

  /** The current page size. */
  pageSize!: number;

  /** The current total number of items being paged. */
  length!: number;
}

// Boilerplate for applying mixins to _BriPaginatorBase.
/** @docs-private */
const _BriPaginatorMixinBase = mixinInitialized(class {});

let nextUniqueId = 0;

/**
 * Component to provide navigation between paged information. Displays the size of the current
 * page, user-selectable options to change that size, what items are being shown, and
 * navigational button to go to the previous or next page.
 */
@Component({
  selector: 'bri-paginator',
  exportAs: 'briPaginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
  host: {
    role: 'group',
    class: 'bri-paginator',
    '[class.bri-paginator-not-visible]': 'getNumberOfPages() <= 1',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [BriIconComponent, BriIconButtonComponent],
})
export class BriPaginatorComponent
  extends _BriPaginatorMixinBase
  implements OnInit, HasInitialized
{
  /** ID for the DOM node containing the paginator's items per page label. */
  readonly _pageSizeLabelId = `bri-paginator-page-size-label-${nextUniqueId++}`;

  private _initialized!: boolean;

  _pageRange: number[] = [];

  /** The zero-based page index of the displayed list of items. Defaulted to 0. */
  @Input({ transform: numberAttribute })
  get pageIndex(): number {
    return this._pageIndex;
  }

  set pageIndex(value: number) {
    this._pageIndex = Math.max(value || 0, 0);
    this._changeDetectorRef.markForCheck();
  }

  private _pageIndex = 0;

  /** The length of the total number of items that are being paginated. Defaulted to 0. */
  @Input({ transform: numberAttribute })
  get length(): number {
    return this._length;
  }

  set length(value: number) {
    this._length = value || 0;
    this._pageRange = generateRange(
      this.pageIndex,
      this.visiblePages,
      this.getNumberOfPages() - 1
    );

    this._changeDetectorRef.markForCheck();
  }

  private _length = 0;

  /** Number of items to display on a page. By default set to 50. */
  @Input({ transform: numberAttribute })
  get pageSize(): number {
    return this._pageSize;
  }
  set pageSize(value: number) {
    this._pageSize = Math.max(value || 0, 0);
    this._updateDisplayedPageSizeOptions();
  }
  private _pageSize!: number;

  @Input({ transform: numberAttribute })
  get visiblePages(): number {
    return this._visiblePages;
  }

  set visiblePages(value: number) {
    this._visiblePages = value || 0;
    this._pageRange = generateRange(
      this.pageIndex,
      this.visiblePages,
      this.getNumberOfPages() - 1
    );

    this._changeDetectorRef.markForCheck();
  }

  private _visiblePages = 0;

  /** The set of provided page size options to display to the user. */
  @Input()
  get pageSizeOptions(): number[] {
    return this._pageSizeOptions;
  }
  set pageSizeOptions(value: number[] | readonly number[]) {
    this._pageSizeOptions = (value || ([] as number[])).map((p) =>
      numberAttribute(p, 0)
    );
    this._updateDisplayedPageSizeOptions();
  }
  private _pageSizeOptions: number[] = [];

  /** Whether to hide the page size selection UI from the user. */
  @Input({ transform: booleanAttribute })
  hidePageSize = true;

  /** Whether the paginator is disabled. */
  @Input({ transform: booleanAttribute })
  disabled = false;

  /** Event emitted when the paginator changes the page size or page index. */
  @Output() readonly page: EventEmitter<PageEvent> =
    new EventEmitter<PageEvent>();

  /** Displayed set of page size options. Will be sorted and include current page size. */
  _displayedPageSizeOptions!: number[];

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    @Optional()
    @Inject(BRI_PAGINATOR_DEFAULT_OPTIONS)
    defaults?: BriPaginatorDefaultOptions
  ) {
    super();

    if (defaults) {
      const { pageSize, pageSizeOptions, hidePageSize, visiblePages } =
        defaults;

      if (pageSize != null) {
        this._pageSize = pageSize;
      }

      if (pageSizeOptions != null) {
        this._pageSizeOptions = pageSizeOptions;
      }

      if (hidePageSize != null) {
        this.hidePageSize = hidePageSize;
      }

      if (visiblePages != null) {
        this.visiblePages = visiblePages;
      }
    }

    injectIcons([arrowBackIcon, arrowForthIcon]);
  }

  ngOnInit() {
    this._initialized = true;
    this._updateDisplayedPageSizeOptions();
    this._pageRange = generateRange(
      this.pageIndex,
      this.visiblePages,
      this.getNumberOfPages() - 1
    );

    this._markInitialized();
  }

  /** Move back to the previous page if it exists. */
  previousPage(): void {
    if (!this.hasPreviousPage()) {
      return;
    }

    const previousPageIndex = this.pageIndex;
    this.pageIndex = this.pageIndex - 1;
    this._emitPageEvent(previousPageIndex);
  }

  /** Advances to the next page if it exists. */
  nextPage(): void {
    if (!this.hasNextPage()) {
      return;
    }

    const previousPageIndex = this.pageIndex;
    this.pageIndex = this.pageIndex + 1;
    this._emitPageEvent(previousPageIndex);
  }

  _showFirstChunk() {
    if (!this._pageRange || this._pageRange.length == 0) {
      return;
    }

    const pageIndex =
      (Math.round(this.pageIndex / this.visiblePages) - 1) * this.visiblePages;
    this.middlePage(pageIndex);
  }

  _showLastChunk() {
    if (!this._pageRange || this._pageRange.length == 0) {
      return;
    }

    const pageIndex = this._pageRange[this._pageRange.length - 1] + 1;
    this.middlePage(pageIndex);
  }

  middlePage(index: number): void {
    this.pageIndex = index;
    this._emitPageEvent(this.pageIndex - 1);

    this._pageRange = generateRange(
      this.pageIndex,
      this.visiblePages,
      this.getNumberOfPages() - 1
    );
  }

  /** Move to the first page if not already there. */
  firstPage(): void {
    // hasPreviousPage being false implies at the start
    if (!this.hasPreviousPage()) {
      return;
    }

    const previousPageIndex = this.pageIndex;
    this.pageIndex = 0;
    this._emitPageEvent(previousPageIndex);
  }

  /** Move to the last page if not already there. */
  lastPage(): void {
    // hasNextPage being false implies at the end
    if (!this.hasNextPage()) {
      return;
    }

    const previousPageIndex = this.pageIndex;
    this.pageIndex = this.getNumberOfPages() - 1;
    this._emitPageEvent(previousPageIndex);
  }

  _hasFirstChunk(): boolean {
    return (
      this.pageIndex < this.getNumberOfPages() - 1 &&
      this.pageIndex >= this.visiblePages
    );
  }

  _hasLastChunk(): boolean {
    return this.pageIndex + this.visiblePages < this.getNumberOfPages() - 1;
  }

  /** Whether there is a previous page. */
  hasPreviousPage(): boolean {
    return this.pageIndex >= 1 && this.pageSize != 0;
  }

  /** Whether there is a next page. */
  hasNextPage(): boolean {
    const maxPageIndex = this.getNumberOfPages() - 1;
    return this.pageIndex < maxPageIndex && this.pageSize != 0;
  }

  /** Calculate the number of pages */
  getNumberOfPages(): number {
    if (!this.pageSize) {
      return 0;
    }

    return Math.ceil(this.length / this.pageSize);
  }

  /**
   * Changes the page size so that the first item displayed on the page will still be
   * displayed using the new page size.
   *
   * For example, if the page size is 10 and on the second page (items indexed 10-19) then
   * switching so that the page size is 5 will set the third page as the current page so
   * that the 10th item will still be displayed.
   */
  _changePageSize(pageSize: number) {
    // Current page needs to be updated to reflect the new page size. Navigate to the page
    // containing the previous page's first item.
    const startIndex = this.pageIndex * this.pageSize;
    const previousPageIndex = this.pageIndex;

    this.pageIndex = Math.floor(startIndex / pageSize) || 0;
    this.pageSize = pageSize;
    this._emitPageEvent(previousPageIndex);
  }

  /** Checks whether the buttons for going forwards should be disabled. */
  _isNextButtonDisabled() {
    return this.disabled || !this.hasNextPage();
  }

  /** Checks whether the buttons for going backwards should be disabled. */
  _isPreviousButtonDisabled() {
    return this.disabled || !this.hasPreviousPage();
  }

  /**
   * Updates the list of page size options to display to the user. Includes making sure that
   * the page size is an option and that the list is sorted.
   */
  private _updateDisplayedPageSizeOptions() {
    if (!this._initialized) {
      return;
    }

    // If no page size is provided, use the first page size option or the default page size.
    if (!this.pageSize) {
      this._pageSize =
        this.pageSizeOptions.length != 0
          ? this.pageSizeOptions[0]
          : DEFAULT_PAGE_SIZE;
    }

    this._displayedPageSizeOptions = this.pageSizeOptions.slice();

    if (this._displayedPageSizeOptions.indexOf(this.pageSize) === -1) {
      this._displayedPageSizeOptions.push(this.pageSize);
    }

    // Sort the numbers using a number-specific sort function.
    this._displayedPageSizeOptions.sort((a, b) => a - b);
    this._changeDetectorRef.markForCheck();
  }

  /** Emits an event notifying that a change of the paginator's properties has been triggered. */
  private _emitPageEvent(previousPageIndex: number) {
    this.page.emit({
      previousPageIndex,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      length: this.length,
    });
  }
}
