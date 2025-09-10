import { InjectionToken } from '@angular/core';

export type BriSortDirection = 'asc' | 'desc' | '';

/** Position of the arrow that displays when sorted. */
export type SortHeaderArrowPosition = 'before' | 'after';

/** Interface for a directive that holds sorting state consumed by `BriSortHeader`. */
export type BriSortable = {
  /** The id of the column being sorted. */
  id: string;

  /** Starting sort direction. */
  start: BriSortDirection;

  /** Whether to disable clearing the sorting state. */
  disableClear: boolean;
};

/** The current sort state. */
export type BriSort = {
  /** The id of the column being sorted. */
  active: string;

  /** The sort direction. */
  direction: BriSortDirection;
};

/** Default options for `mat-sort`.  */
export type BriSortDefaultOptions = {
  /** Whether to disable clearing the sorting state. */
  disableClear?: boolean;
  /** Position of the arrow that displays when sorted. */
  arrowPosition?: SortHeaderArrowPosition;
};

/** Injection token to be used to override the default options for `bri-sort`. */
export const BRI_SORT_DEFAULT_OPTIONS =
  new InjectionToken<BriSortDefaultOptions>('BRI_SORT_DEFAULT_OPTIONS');
