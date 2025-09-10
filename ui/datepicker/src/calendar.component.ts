/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { CdkMonitorFocus } from '@angular/cdk/a11y';
import {
  CdkPortalOutlet,
  ComponentPortal,
  ComponentType,
  Portal,
} from '@angular/cdk/portal';
import {
  AfterContentInit,
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  Optional,
  Output,
  SimpleChange,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
  isDevMode,
} from '@angular/core';
import {
  BRI_DATE_FORMATS,
  BriDateFormats,
  DateAdapter,
} from '@wkp/bricks/core';
import { Subject } from 'rxjs';
import {
  BriCalendarCellClassFunction,
  BriCalendarUserEvent,
} from './calendar-body.component';
import { BriCalendarHeaderComponent } from './calendar-header.component';
import {
  BRI_SINGLE_DATE_SELECTION_MODEL_PROVIDER,
  DateRange,
} from './date-selection-model';
import { createMissingDateImplError } from './datepicker-errors';
import { BriMonthViewComponent } from './month-view.component';

/**
 * Possible views for the calendar.
 * @docs-private
 */
export type BriCalendarView = 'month' | 'year' | 'multi-year';

/** A calendar that is used as part of the datepicker. */
@Component({
  selector: 'bri-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
  host: {
    class: 'bri-calendar',
  },
  exportAs: 'briCalendar',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [BRI_SINGLE_DATE_SELECTION_MODEL_PROVIDER],
  standalone: true,
  imports: [CdkPortalOutlet, CdkMonitorFocus, BriMonthViewComponent],
})
export class BriCalendarComponent<D>
  implements AfterContentInit, AfterViewChecked, OnDestroy, OnChanges
{
  /** An input indicating the type of the header component, if set. */
  @Input() headerComponent!: ComponentType<any>;

  /** A portal containing the header component type for this calendar. */
  _calendarHeaderPortal!: Portal<any>;

  /**
   * Used for scheduling that focus should be moved to the active cell on the next tick.
   * We need to schedule it, rather than do it immediately, because we have to wait
   * for Angular to re-evaluate the view children.
   */
  private _moveFocusOnNextTick = false;

  /** A date representing the period (month or year) to start the calendar in. */
  @Input()
  get startAt(): D | null {
    return this._startAt;
  }
  set startAt(value: D | null) {
    this._startAt = this._dateAdapter.getValidDateOrNull(
      this._dateAdapter.deserialize(value)
    );
  }
  private _startAt!: D | null;

  /** The currently selected date. */
  @Input()
  get selected(): DateRange<D> | D | null {
    return this._selected;
  }
  set selected(value: DateRange<D> | D | null) {
    if (value instanceof DateRange) {
      this._selected = value;
    } else {
      this._selected = this._dateAdapter.getValidDateOrNull(
        this._dateAdapter.deserialize(value)
      );
    }
  }
  private _selected!: DateRange<D> | D | null;

  /** The minimum selectable date. */
  @Input()
  get minDate(): D | null {
    return this._minDate;
  }
  set minDate(value: D | null) {
    this._minDate = this._dateAdapter.getValidDateOrNull(
      this._dateAdapter.deserialize(value)
    );
  }
  private _minDate!: D | null;

  /** The maximum selectable date. */
  @Input()
  get maxDate(): D | null {
    return this._maxDate;
  }
  set maxDate(value: D | null) {
    this._maxDate = this._dateAdapter.getValidDateOrNull(
      this._dateAdapter.deserialize(value)
    );
  }
  private _maxDate!: D | null;

  /** Function used to filter which dates are selectable. */
  @Input() dateFilter!: (date: D) => boolean;

  /** Function that can be used to add custom CSS classes to dates. */
  @Input() dateClass!: BriCalendarCellClassFunction<D>;

  /** Start of the comparison range. */
  @Input() comparisonStart!: D | null;

  /** End of the comparison range. */
  @Input() comparisonEnd!: D | null;

  /** ARIA Accessible name of the `<input briStartDate/>` */
  @Input() startDateAccessibleName!: string | null;

  /** ARIA Accessible name of the `<input briEndDate/>` */
  @Input() endDateAccessibleName!: string | null;

  /** Emits when the currently selected date changes. */
  @Output() readonly selectedChange: EventEmitter<D | null> =
    new EventEmitter<D | null>();

  /**
   * Emits the year chosen in multiyear view.
   * This doesn't imply a change on the selected date.
   */
  @Output() readonly yearSelected: EventEmitter<D> = new EventEmitter<D>();

  /**
   * Emits the month chosen in year view.
   * This doesn't imply a change on the selected date.
   */
  @Output() readonly monthSelected: EventEmitter<D> = new EventEmitter<D>();

  /** Emits when any date is selected. */
  @Output() readonly _userSelection: EventEmitter<
    BriCalendarUserEvent<D | null>
  > = new EventEmitter<BriCalendarUserEvent<D | null>>();

  /** Emits a new date range value when the user completes a drag drop operation. */
  @Output() readonly _userDragDrop = new EventEmitter<
    BriCalendarUserEvent<DateRange<D>>
  >();

  /** Reference to the current month view component. */
  @ViewChild(BriMonthViewComponent) monthView!: BriMonthViewComponent<D>;

  /**
   * The current active date. This determines which time period is shown and which date is
   * highlighted when using keyboard navigation.
   */
  get activeDate(): D {
    return this._clampedActiveDate;
  }
  set activeDate(value: D) {
    this._clampedActiveDate = this._dateAdapter.clampDate(
      value,
      this.minDate,
      this.maxDate
    );
    this.stateChanges.next();
    this._changeDetectorRef.markForCheck();
  }
  private _clampedActiveDate!: D;

  /** Origin of active drag, or null when dragging is not active. */
  protected _activeDrag: BriCalendarUserEvent<D> | null = null;

  /**
   * Emits whenever there is a state change that the header may need to respond to.
   */
  readonly stateChanges = new Subject<void>();

  constructor(
    @Optional() private _dateAdapter: DateAdapter<D>,
    @Optional() @Inject(BRI_DATE_FORMATS) private _dateFormats: BriDateFormats,
    private _changeDetectorRef: ChangeDetectorRef
  ) {
    if (isDevMode()) {
      if (!this._dateAdapter) {
        throw createMissingDateImplError('DateAdapter');
      }

      if (!this._dateFormats) {
        throw createMissingDateImplError('BRI_DATE_FORMATS');
      }
    }
  }

  ngAfterContentInit() {
    this._calendarHeaderPortal = new ComponentPortal(
      this.headerComponent || BriCalendarHeaderComponent
    );
    this.activeDate = this.startAt || this._dateAdapter.today();
  }

  ngAfterViewChecked() {
    if (this._moveFocusOnNextTick) {
      this._moveFocusOnNextTick = false;
      this.focusActiveCell();
    }
  }

  ngOnDestroy() {
    this.stateChanges.complete();
  }

  ngOnChanges(changes: SimpleChanges) {
    // Ignore date changes that are at a different time on the same day. This fixes issues where
    // the calendar re-renders when there is no meaningful change to [minDate] or [maxDate]
    // (#24435).
    const minDateChange: SimpleChange | undefined =
      changes['minDate'] &&
      !this._dateAdapter.sameDate(
        changes['minDate'].previousValue,
        changes['minDate'].currentValue
      )
        ? changes['minDate']
        : undefined;
    const maxDateChange: SimpleChange | undefined =
      changes['maxDate'] &&
      !this._dateAdapter.sameDate(
        changes['maxDate'].previousValue,
        changes['maxDate'].currentValue
      )
        ? changes['maxDate']
        : undefined;

    const change = minDateChange || maxDateChange || changes['dateFilter'];

    if (change && !change.firstChange) {
      const view = this._getCurrentViewComponent();

      if (view) {
        // We need to `detectChanges` manually here, because the `minDate`, `maxDate` etc. are
        // passed down to the view via data bindings which won't be up-to-date when we call `_init`.
        this._changeDetectorRef.detectChanges();
        view._init();
      }
    }

    this.stateChanges.next();
  }

  /** Focuses the active date. */
  focusActiveCell() {
    this._getCurrentViewComponent()._focusActiveCell(false);
  }

  /** Updates today's date after an update of the active date */
  updateTodaysDate() {
    this._getCurrentViewComponent()._init();
  }

  /** Handles date selection in the month view. */
  _dateSelected(event: BriCalendarUserEvent<D | null>): void {
    const date = event.value;

    if (
      this.selected instanceof DateRange ||
      (date && !this._dateAdapter.sameDate(date, this.selected))
    ) {
      this.selectedChange.emit(date);
    }

    this._userSelection.emit(event);
  }

  /** Handles year selection in the multiyear view. */
  _yearSelectedInMultiYearView(normalizedYear: D) {
    this.yearSelected.emit(normalizedYear);
  }

  /** Handles month selection in the year view. */
  _monthSelectedInYearView(normalizedMonth: D) {
    this.monthSelected.emit(normalizedMonth);
  }

  /** Handles year/month selection in the multi-year/year views. */
  _goToDateInView(date: D, view: 'month' | 'year' | 'multi-year'): void {
    this.activeDate = date;
    // this.currentView = view;
  }

  /** Called when the user starts dragging to change a date range. */
  _dragStarted(event: BriCalendarUserEvent<D>) {
    this._activeDrag = event;
  }

  /**
   * Called when a drag completes. It may end in cancelation or in the selection
   * of a new range.
   */
  _dragEnded(event: BriCalendarUserEvent<DateRange<D> | null>) {
    if (!this._activeDrag) return;

    if (event.value) {
      this._userDragDrop.emit(event as BriCalendarUserEvent<DateRange<D>>);
    }

    this._activeDrag = null;
  }

  /** Returns the component instance that corresponds to the current calendar view. */
  private _getCurrentViewComponent(): BriMonthViewComponent<D> {
    // The return type is explicitly written as a union to ensure that the Closure compiler does
    // not optimize calls to _init(). Without the explicit return type, TypeScript narrows it to
    // only the first component type. See https://github.com/angular/components/issues/22996.
    return this.monthView;
  }
}
