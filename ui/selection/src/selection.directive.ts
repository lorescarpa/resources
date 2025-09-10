/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { CollectionViewer, DataSource, isDataSource, ListRange } from '@angular/cdk/collections';
import {
  AfterContentChecked,
  Directive,
  EventEmitter,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TrackByFunction,
  effect,
  inject,
  input,
  isDevMode,
  runInInjectionContext,
} from '@angular/core';
import { Observable, of as observableOf, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SelectableWithIndex, SelectionChange, SelectionSet } from '@angular/cdk-experimental/selection';

/**
 * Manages the selection states of the items and provides methods to check and update the selection
 * states.
 * It must be applied to the parent element if `cdkSelectionToggle`, `cdkSelectAll`,
 * `cdkRowSelection` and `cdkSelectionColumn` are applied.
 */
@Directive({
  standalone: true,
  selector: '[briSelection]',
  exportAs: 'briSelection',
})
export class BriSelectionDirective<T> implements OnInit, AfterContentChecked, CollectionViewer, OnDestroy {
  #injector = inject(Injector);

  viewChange!: Observable<ListRange>;

  @Input()
  get dataSource(): TableDataSource<T> {
    return this._dataSource;
  }
  set dataSource(dataSource: TableDataSource<T>) {
    if (this._dataSource !== dataSource) {
      this._switchDataSource(dataSource);
    }
  }
  private _dataSource!: TableDataSource<T>;

  @Input('trackBy') trackByFn!: TrackByFunction<T>;

  /** Whether to support multiple selection */
  @Input('briSelectionMultiple')
  get multiple(): boolean {
    return this._multiple;
  }
  set multiple(multiple: BooleanInput) {
    this._multiple = coerceBooleanProperty(multiple);
  }

  protected _multiple!: boolean;

  /*@Input('briSelectionSelected')
  set selected(value: T[] | null) {
    console.log('selecteddddddd');
    if (this.)
    this._clearAll();
    if (value != null && value.length > 0 && !!this._selection) {
      value.forEach((item, index) => this._selection.select({ value: item, index }));
    }

    this._selected = value;
  } */

  selected = input<T[] | null>(null, { alias: 'briSelectionSelected' });

  private _selected: T[] | null = null;

  /** Emits when selection changes. */
  @Output('briSelectionChange') readonly changed = new EventEmitter<SelectionChange<T>>();

  /** Latest data provided by the data source. */
  private _data!: T[] | readonly T[];

  /** Subscription that listens for the data provided by the data source.  */
  private _renderChangeSubscription!: Subscription | null;

  private _destroyed = new Subject<void>();

  private _selection!: SelectionSet<T>;

  private _switchDataSource(dataSource: TableDataSource<T>) {
    this._data = [];

    // TODO: Move this logic to a shared function in `cdk/collections`.
    if (isDataSource(this._dataSource)) {
      this._dataSource.disconnect(this);
    }

    if (this._renderChangeSubscription) {
      this._renderChangeSubscription.unsubscribe();
      this._renderChangeSubscription = null;
    }

    this._dataSource = dataSource;
  }

  private _observeRenderChanges() {
    if (!this._dataSource) {
      return;
    }

    let dataStream: Observable<readonly T[]> | undefined;

    if (isDataSource(this._dataSource)) {
      dataStream = this._dataSource.connect(this);
    } else if (this._dataSource instanceof Observable) {
      dataStream = this._dataSource;
    } else if (Array.isArray(this._dataSource)) {
      dataStream = observableOf(this._dataSource);
    }

    if (dataStream == null && isDevMode()) {
      throw Error('Unknown data source');
    }

    this._renderChangeSubscription = dataStream!.pipe(takeUntil(this._destroyed)).subscribe((data) => {
      this._data = data || [];
    });
  }

  ngOnInit() {
    this._selection = new SelectionSet<T>(this._multiple, this.trackByFn);
    this._selection.changed.pipe(takeUntil(this._destroyed)).subscribe((change) => {
      this._updateSelectAllState();
      this.changed.emit(change);
    });

    runInInjectionContext(this.#injector, () => {
      effect(() => {
        const selectedItems = this.selected();
        if (this._data) {
          this._clearAll();

          if (selectedItems != null && selectedItems.length > 0 && !!this._selection) {
            selectedItems.forEach((item, index) => this._selection.select({ value: item, index }));
          }
        }
      });
    });
  }

  ngAfterContentChecked() {
    if (this._dataSource && !this._renderChangeSubscription) {
      this._observeRenderChanges();
    }
  }

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();

    if (isDataSource(this._dataSource)) {
      this._dataSource.disconnect(this);
    }
  }

  /** Toggles selection for a given value. `index` is required if `trackBy` is used. */
  toggleSelection(value: T, index?: number) {
    if (!!this.trackByFn && index == null && isDevMode()) {
      throw Error('CdkSelection: index required when trackBy is used');
    }

    if (this.isSelected(value, index)) {
      this._selection.deselect({ value, index });
    } else {
      this._selection.select({ value, index });
    }
  }

  /**
   * Toggles select-all. If no value is selected, select all values. If all values or some of the
   * values are selected, de-select all values.
   */
  toggleSelectAll() {
    if (!this._multiple && isDevMode()) {
      throw Error('CdkSelection: multiple selection not enabled');
    }

    if (this.selectAllState === 'none') {
      this._selectAll();
    } else {
      this._clearAll();
    }
  }

  /** Checks whether a value is selected. `index` is required if `trackBy` is used. */
  isSelected(value: T, index?: number) {
    if (!!this.trackByFn && index == null && isDevMode()) {
      throw Error('CdkSelection: index required when trackBy is used');
    }

    return this._selection.isSelected({ value, index });
  }

  /** Checks whether all values are selected. */
  isAllSelected() {
    return this._data.every((value, index) => this._selection.isSelected({ value, index }));
  }

  /** Checks whether partially selected. */
  isPartialSelected() {
    return !this.isAllSelected() && this._data.some((value, index) => this._selection.isSelected({ value, index }));
  }

  private _selectAll() {
    const toSelect: SelectableWithIndex<T>[] = [];
    this._data.forEach((value, index) => {
      toSelect.push({ value, index });
    });

    this._selection.select(...toSelect);
  }

  private _clearAll() {
    const toDeselect: SelectableWithIndex<T>[] = [];
    this._data.forEach((value, index) => {
      toDeselect.push({ value, index });
    });

    this._selection.deselect(...toDeselect);
  }

  private _updateSelectAllState() {
    if (this.isAllSelected()) {
      this.selectAllState = 'all';
    } else if (this.isPartialSelected()) {
      this.selectAllState = 'partial';
    } else {
      this.selectAllState = 'none';
    }
  }

  selectAllState: SelectAllState = 'none';
}

type SelectAllState = 'all' | 'none' | 'partial';
type TableDataSource<T> = DataSource<T> | Observable<readonly T[]> | readonly T[];
