/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { FocusMonitor, FocusOrigin } from '@angular/cdk/a11y';
import { Platform } from '@angular/cdk/platform';
import {
  AfterViewInit,
  booleanAttribute,
  Directive,
  ElementRef,
  inject,
  InjectionToken,
  Input,
  NgZone,
  numberAttribute,
  OnDestroy,
  OnInit,
} from '@angular/core';

/** Object that can be used to configure the default options for the button component. */
export interface BriButtonConfig {
  /** Whether disabled buttons should be interactive. */
  disabledInteractive?: boolean;
}

/** Injection token that can be used to provide the default options the button component. */
export const BRI_BUTTON_CONFIG = new InjectionToken<BriButtonConfig>(
  'BRI_BUTTON_CONFIG'
);

/** Shared host configuration for all buttons */
export const BRI_BUTTON_HOST = {
  '[attr.disabled]': '_getDisabledAttribute()',
  '[attr.aria-disabled]': '_getAriaDisabled()',
  '[class.bri-button-disabled]': 'disabled',
  '[class.bri-button-disabled-interactive]': 'disabledInteractive',
  '[class._bri-animation-noopable]': '_animationMode === "NoopAnimations"',
  '[class]': 'color ? "bri-" + color : ""',
};

/** List of classes to add to buttons instances based on host attribute selector. */
const HOST_SELECTOR_BRI_CLASS_PAIR: {
  attribute: string;
  briClasses: string[];
}[] = [
  {
    attribute: 'bri-button',
    briClasses: ['bri-button'],
  },
  {
    attribute: 'bri-text-button',
    briClasses: ['bri-text-button'],
  },
  {
    attribute: 'bri-icon-button',
    briClasses: ['bri-icon-button'],
  },
];

/** Base class for all buttons.  */
@Directive()
export class BriButtonBaseDirective implements AfterViewInit, OnDestroy {
  private readonly _focusMonitor = inject(FocusMonitor);

  /** Theme color palette of the button */
  @Input() color?: 'primary' | 'secondary' | 'negative' | '' = '';

  /** Whether the button is disabled. */
  @Input({ transform: booleanAttribute })
  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value: any) {
    this._disabled = value;
  }

  private _disabled = false;

  /** `aria-disabled` value of the button. */
  @Input({ transform: booleanAttribute, alias: 'aria-disabled' })
  ariaDisabled: boolean | undefined;

  /**
   * Natively disabled buttons prevent focus and any pointer events from reaching the button.
   * In some scenarios this might not be desirable, because it can prevent users from finding out
   * why the button is disabled (e.g. via tooltip).
   *
   * Enabling this input will change the button so that it is styled to be disabled and will be
   * marked as `aria-disabled`, but it will allow the button to receive events and focus.
   *
   * Note that by enabling this, you need to set the `tabindex` yourself if the button isn't
   * meant to be tabbable and you have to prevent the button action (e.g. form submissions).
   */
  @Input({ transform: booleanAttribute })
  disabledInteractive: boolean;

  constructor(
    public _elementRef: ElementRef,
    public _platform: Platform,
    public _ngZone: NgZone,
    public _animationMode?: string
  ) {
    const config = inject(BRI_BUTTON_CONFIG, { optional: true });
    const element = _elementRef.nativeElement;
    const classList = (element as HTMLElement).classList;

    this.disabledInteractive = config?.disabledInteractive ?? false;

    // For each of the variant selectors that is present in the button's host
    // attributes, add the correct corresponding BRI classes.
    for (const { attribute, briClasses } of HOST_SELECTOR_BRI_CLASS_PAIR) {
      if (element.hasAttribute(attribute)) {
        classList.add(...briClasses);
      }
    }
  }

  ngAfterViewInit() {
    this._focusMonitor.monitor(this._elementRef, true);
  }

  /** Focuses the button. */
  focus(origin: FocusOrigin = 'program', options?: FocusOptions): void {
    if (origin) {
      this._focusMonitor.focusVia(
        this._elementRef.nativeElement,
        origin,
        options
      );
    } else {
      this._elementRef.nativeElement.focus(options);
    }
  }

  protected _getAriaDisabled() {
    if (this.ariaDisabled != null) {
      return this.ariaDisabled;
    }

    return this.disabled && this.disabledInteractive ? true : null;
  }

  protected _getDisabledAttribute() {
    return this.disabledInteractive || !this.disabled ? null : true;
  }

  ngOnDestroy() {
    this._focusMonitor.stopMonitoring(this._elementRef);
  }
}

/** Shared host configuration for buttons using the `<a>` tag. */
export const BRI_ANCHOR_HOST = {
  '[attr.disabled]': '_getDisabledAttribute()',
  '[class.bri-button-disabled]': 'disabled',
  '[class.bri-button-disabled-interactive]': 'disabledInteractive',
  '[class._bri-animation-noopable]': '_animationMode === "NoopAnimations"',

  // Note that we ignore the user-specified tabindex when it's disabled for
  // consistency with the `bri-button` applied on native buttons where even
  // though they have an index, they're not tabbable.
  '[attr.tabindex]': 'disabled && !disabledInteractive ? -1 : tabIndex',
  '[attr.aria-disabled]': '_getDisabledAttribute()',
  // BRI automatically applies the primary theme color to the button, but we want to support
  // an unthemed version. If color is undefined, apply a CSS class that makes it easy to
  // select and style this "theme".
  '[class.bri-unthemed]': '!color',
  '[class]': 'color ? "bri-" + color : ""',
};

/**
 * Anchor button base.
 */
@Directive()
export class BriAnchorBaseDirective
  extends BriButtonBaseDirective
  implements OnInit, OnDestroy
{
  @Input({
    transform: (value: unknown) => {
      return value == null ? undefined : numberAttribute(value);
    },
  })
  tabIndex: number | undefined;

  constructor(
    elementRef: ElementRef,
    platform: Platform,
    ngZone: NgZone,
    animationMode?: string
  ) {
    super(elementRef, platform, ngZone, animationMode);
  }

  ngOnInit(): void {
    this._ngZone.runOutsideAngular(() => {
      this._elementRef.nativeElement.addEventListener(
        'click',
        this._haltDisabledEvents
      );
    });
  }

  _haltDisabledEvents = (event: Event): void => {
    // A disabled button shouldn't apply any actions
    if (this.disabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  };

  protected override _getAriaDisabled() {
    return this.ariaDisabled == null ? this.disabled : this.ariaDisabled;
  }
  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this._elementRef.nativeElement.removeEventListener(
      'click',
      this._haltDisabledEvents
    );
  }
}
