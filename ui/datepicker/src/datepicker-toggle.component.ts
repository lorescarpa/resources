/* eslint-disable @angular-eslint/no-input-rename */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {
  AfterContentInit,
  Attribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Directive,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewEncapsulation,
  booleanAttribute,
} from '@angular/core';
import { BriIconButtonComponent } from '@wkp/bricks/button';
import { BriIconModule, injectIcons } from '@wkp/bricks/icon';
import { calendarHolidayIcon } from '@wkp/bricks/svg/navigation-and-action';
import { Observable, Subscription, merge, of as observableOf } from 'rxjs';
import { BriDatepickerControl, BriDatepickerPanel } from './datepicker-base';

/** Can be used to override the icon of a `matDatepickerToggle`. */
@Directive({
  selector: '[briDatepickerToggleIcon]',
  standalone: true,
})
export class BriDatepickerToggleIconDirective {}

@Component({
  selector: 'bri-datepicker-toggle',
  templateUrl: './datepicker-toggle.component.html',
  styleUrl: './datepicker-toggle.component.scss',
  host: {
    class: 'bri-datepicker-toggle',
    '[attr.tabindex]': 'null',
    '[class.bri-datepicker-toggle-active]': 'datepicker && datepicker.opened',
    '[class.bri-warn]': 'datepicker && datepicker.color === "warn"',
    // Used by the test harness to tie this toggle to its datepicker.
    '[attr.data-bri-calendar]': 'datepicker ? datepicker.id : null',
    // Bind the `click` on the host, rather than the inner `button`, so that we can call
    // `stopPropagation` on it without affecting the user's `click` handlers. We need to stop
    // it so that the input doesn't get focused automatically by the form field (See #21836).
    '(click)': '_open($event)',
  },
  exportAs: 'briDatepickerToggle',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [BriIconButtonComponent, BriIconModule],
})
export class BriDatepickerToggleComponent<D>
  implements AfterContentInit, OnChanges, OnDestroy
{
  private _stateChanges = Subscription.EMPTY;

  /** Datepicker instance that the button will toggle. */
  @Input('for') datepicker!: BriDatepickerPanel<BriDatepickerControl<any>, D>;

  /** Tabindex for the toggle. */
  @Input() tabIndex: number | null;

  /** Screen-reader label for the button. */
  @Input('aria-label') ariaLabel!: string;

  /** Whether the toggle button is disabled. */
  @Input({ transform: booleanAttribute })
  get disabled(): boolean {
    if (this._disabled === undefined && this.datepicker) {
      return this.datepicker.disabled;
    }

    return !!this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = value;
  }

  private _disabled!: boolean;

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    @Attribute('tabindex') defaultTabIndex: string
  ) {
    const parsedTabIndex = Number(defaultTabIndex);
    this.tabIndex =
      parsedTabIndex || parsedTabIndex === 0 ? parsedTabIndex : null;

    injectIcons(calendarHolidayIcon);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['datepicker']) {
      this._watchStateChanges();
    }
  }

  ngOnDestroy() {
    this._stateChanges.unsubscribe();
  }

  ngAfterContentInit() {
    this._watchStateChanges();
  }

  _open(event: Event): void {
    if (this.datepicker && !this.disabled) {
      this.datepicker.open();
      event.stopPropagation();
    }
  }

  private _watchStateChanges() {
    const datepickerStateChanged = this.datepicker
      ? this.datepicker.stateChanges
      : observableOf();
    const inputStateChanged =
      this.datepicker && this.datepicker.datepickerInput
        ? this.datepicker.datepickerInput.stateChanges
        : observableOf();
    const datepickerToggled = this.datepicker
      ? merge(this.datepicker.openedStream, this.datepicker.closedStream)
      : observableOf();

    this._stateChanges.unsubscribe();
    this._stateChanges = merge(
      datepickerStateChanged as Observable<void>,
      inputStateChanged,
      datepickerToggled
    ).subscribe(() => this._changeDetectorRef.markForCheck());
  }
}
