/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {
  booleanAttribute,
  Directive,
  EventEmitter,
  Inject,
  Input,
  isDevMode,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
} from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import {
  getSortDuplicateSortableIdError,
  getSortHeaderMissingIdError,
  getSortInvalidDirectionError,
} from './sort-errors';
import {
  BRI_SORT_DEFAULT_OPTIONS,
  BriSort,
  BriSortable,
  BriSortDefaultOptions,
  BriSortDirection,
} from './types';

/** Container for BriSortables to manage the sort state and provide default sort parameters. */
@Directive({
  standalone: true,
  selector: '[briSort]',
  exportAs: 'briSort',
  host: {
    class: 'bri-sort',
  },
})
export class BriSortDirective implements OnChanges, OnDestroy, OnInit {
  private _initializedStream = new ReplaySubject<void>(1);

  /** Collection of all registered sortables that this directive manages. */
  sortables = new Map<string, BriSortable>();

  /** Used to notify any child components listening to state changes. */
  readonly _stateChanges = new Subject<void>();

  /** The id of the most recently sorted BriSortable. */
  @Input('briSortActive') active!: string;

  /**
   * The direction to set when an BriSortable is initially sorted.
   * May be overridden by the BriSortable's sort start.
   */
  @Input('briSortStart') start: BriSortDirection = 'asc';

  /** The sort direction of the currently active BriSortable. */
  @Input('briSortDirection')
  get direction(): BriSortDirection {
    return this._direction;
  }
  set direction(direction: BriSortDirection) {
    if (
      direction &&
      direction !== 'asc' &&
      direction !== 'desc' &&
      isDevMode()
    ) {
      throw getSortInvalidDirectionError(direction);
    }
    this._direction = direction;
  }
  private _direction: BriSortDirection = '';

  /**
   * Whether to disable the user from clearing the sort by finishing the sort direction cycle.
   * May be overridden by the BriSortable's disable clear input.
   */
  @Input({ alias: 'briSortDisableClear', transform: booleanAttribute })
  disableClear!: boolean;

  /** Whether the sortable is disabled. */
  @Input({ alias: 'briSortDisabled', transform: booleanAttribute })
  disabled = false;

  /** Event emitted when the user changes either the active sort or sort direction. */
  @Output('briSortChange') readonly sortChange: EventEmitter<BriSort> =
    new EventEmitter<BriSort>();

  /** Emits when the paginator is initialized. */
  initialized: Observable<void> = this._initializedStream;

  constructor(
    @Optional()
    @Inject(BRI_SORT_DEFAULT_OPTIONS)
    private _defaultOptions?: BriSortDefaultOptions
  ) {}

  ngOnInit() {
    this._initializedStream.next();
  }

  /**
   * Register function to be used by the contained BriSortables. Adds the BriSortable to the
   * collection of BriSortables.
   */
  register(sortable: BriSortable): void {
    if (isDevMode()) {
      if (!sortable.id) {
        throw getSortHeaderMissingIdError();
      }

      if (this.sortables.has(sortable.id)) {
        throw getSortDuplicateSortableIdError(sortable.id);
      }
    }

    this.sortables.set(sortable.id, sortable);
  }

  /**
   * Unregister function to be used by the contained BriSortables. Removes the BriSortable from the
   * collection of contained BriSortables.
   */
  deregister(sortable: BriSortable): void {
    this.sortables.delete(sortable.id);
  }

  /** Sets the active sort id and determines the new sort direction. */
  sort(sortable: BriSortable): void {
    if (this.active != sortable.id) {
      this.active = sortable.id;
      this.direction = sortable.start ? sortable.start : this.start;
    } else {
      this.direction = this.getNextSortDirection(sortable);
    }

    this.sortChange.emit({ active: this.active, direction: this.direction });
  }

  /** Returns the next sort direction of the active sortable, checking for potential overrides. */
  getNextSortDirection(sortable: BriSortable): BriSortDirection {
    if (!sortable) {
      return '';
    }

    // Get the sort direction cycle with the potential sortable overrides.
    const disableClear =
      sortable?.disableClear ??
      this.disableClear ??
      !!this._defaultOptions?.disableClear;
    const sortDirectionCycle = getSortDirectionCycle(
      sortable.start || this.start,
      disableClear
    );

    // Get and return the next direction in the cycle
    let nextDirectionIndex = sortDirectionCycle.indexOf(this.direction) + 1;
    if (nextDirectionIndex >= sortDirectionCycle.length) {
      nextDirectionIndex = 0;
    }
    return sortDirectionCycle[nextDirectionIndex];
  }

  ngOnChanges() {
    this._stateChanges.next();
  }

  ngOnDestroy() {
    this._stateChanges.complete();
    this._initializedStream.complete();
  }
}

/** Returns the sort direction cycle to use given the provided parameters of order and clear. */
function getSortDirectionCycle(
  start: BriSortDirection,
  disableClear: boolean
): BriSortDirection[] {
  const sortOrder: BriSortDirection[] = ['asc', 'desc'];
  if (start == 'desc') {
    sortOrder.reverse();
  }
  if (!disableClear) {
    sortOrder.push('');
  }

  return sortOrder;
}
