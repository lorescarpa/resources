import { NgFor } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  Optional,
  ViewEncapsulation,
  forwardRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {
  BRI_DATE_FORMATS,
  BriDateFormats,
  DateAdapter,
} from '@wkp/bricks/core';
import { BriSelectModule } from '@wkp/bricks/select';
import { map, tap } from 'rxjs';
import { BriCalendarComponent } from './calendar.component';

@Component({
  standalone: true,
  selector: 'bri-calendar-header',
  templateUrl: './calendar-header.component.html',
  styleUrl: './calendar-header.component.scss',
  imports: [BriSelectModule, NgFor, ReactiveFormsModule],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BriCalendarHeaderComponent<D> {
  _formBuilder = inject(FormBuilder);

  _months = signal<{ index: number; name: string }[]>([]);

  _years = signal<number[]>([]);

  _formGroup = this._formBuilder.group({
    month: this._formBuilder.control<number | null>(null),
    year: this._formBuilder.control<number | null>(null),
  });

  constructor(
    @Inject(forwardRef(() => BriCalendarComponent))
    public calendar: BriCalendarComponent<D>,
    @Optional() private _dateAdapter: DateAdapter<D>,
    @Optional() @Inject(BRI_DATE_FORMATS) private _dateFormats: BriDateFormats,
    changeDetectorRef: ChangeDetectorRef
  ) {
    this.calendar.stateChanges.subscribe(() =>
      changeDetectorRef.markForCheck()
    );

    this._years.set(this._generateYears());
    this._months.set(this._generateMonths());

    const activeMonth = this._dateAdapter.getMonth(this.calendar.activeDate);
    const activeYear = this._dateAdapter.getYear(this.calendar.activeDate);

    this._formGroup.patchValue({ month: activeMonth, year: activeYear });

    this._formGroup.valueChanges
      .pipe(
        takeUntilDestroyed(),
        map(({ month, year }) =>
          this._dateAdapter.createDate(year!, month!, 1)
        ),
        tap((date) => (this.calendar.activeDate = date as D))
      )
      .subscribe();
  }

  private _generateYears(): number[] {
    const minDate =
      this.calendar.minDate || this._dateAdapter.createDate(1900, 1, 1); // TODO set default min year
    const maxDate =
      this.calendar.maxDate || this._dateAdapter.createDate(2080, 1, 1); // TODO set default max year

    const minYear = this._dateAdapter.getYear(minDate);
    const maxYear = this._dateAdapter.getYear(maxDate);

    const range = (start: number, end: number) =>
      Array.from({ length: end - start }, (v, k) => k + start);

    return range(minYear, maxYear + 1);
  }

  private _generateMonths(): { index: number; name: string }[] {
    const minDate =
      this.calendar.minDate || this._dateAdapter.createDate(1900, 1, 1); // TODO set default min year
    const maxDate =
      this.calendar.maxDate || this._dateAdapter.createDate(2080, 1, 1); // TODO set default max year

    return this._dateAdapter.getMonthsBetwweenDates(minDate, maxDate);
  }
}
