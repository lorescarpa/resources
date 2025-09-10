/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-interface */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import {
  ANIMATION_MODULE_TYPE,
  AfterContentChecked,
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  Inject,
  InjectionToken,
  Input,
  OnDestroy,
  Optional,
  QueryList,
  ViewChild,
  ViewEncapsulation,
  booleanAttribute,
  isDevMode,
} from '@angular/core';
import { AbstractControlDirective } from '@angular/forms';
import { Subject, merge } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BRI_ERROR, BriErrorDirective } from './directives/error.directive';
import { BriHintDirective } from './directives/hint.directive';
import { BriLabelDirective } from './directives/label.directive';
import { BRI_PREFIX, BriPrefixDirective } from './directives/prefix.directive';
import { BRI_SUFFIX, BriSuffixDirective } from './directives/suffix.directive';
import { BriFormFieldControl as _BriFormFieldControl } from './form-field-control';
import { briFormFieldAnimations } from './form-field.animations';
import {
  getBriFormFieldDuplicatedHintError,
  getBriFormFieldMissingControlError,
} from './form-field.errors';

/** Type for the available floatLabel values. */
export type FloatLabelType = 'always' | 'auto';

/** Possible appearance styles for the form field. */
export type MatFormFieldAppearance = 'fill' | 'outline';

/** Behaviors for how the subscript height is set. */
export type SubscriptSizing = 'fixed' | 'dynamic';

/**
 * Represents the default options for the form field that can be configured
 * using the `BRI_FORM_FIELD_DEFAULT_OPTIONS` injection token.
 */
export interface BriFormFieldDefaultOptions {
  /** Whether the required marker should be hidden by default. */
  hideRequiredMarker?: boolean;

  /** Whether the form field should reserve space for one line by default. */
  subscriptSizing?: SubscriptSizing;
}

/**
 * Injection token that can be used to inject an instances of `MatFormField`. It serves
 * as alternative token to the actual `MatFormField` class which would cause unnecessary
 * retention of the `MatFormField` class and its component metadata.
 */
export const BRI_FORM_FIELD = new InjectionToken<BriFormFieldComponent>(
  'BriFormField'
);

/**
 * Injection token that can be used to configure the
 * default options for all form field within an app.
 */
export const BRI_FORM_FIELD_DEFAULT_OPTIONS =
  new InjectionToken<BriFormFieldDefaultOptions>(
    'BRI_FORM_FIELD_DEFAULT_OPTIONS'
  );

let nextUniqueId = 0;

/** Default way that the subscript element height is set. */
const DEFAULT_SUBSCRIPT_SIZING: SubscriptSizing = 'fixed';

/**
 * Despite `BriFormFieldControl` being an abstract class, most of our usages enforce its shape
 * using `implements` instead of `extends`. This appears to be problematic when Closure compiler
 * is configured to use type information to rename properties, because it can't figure out which
 * class properties are coming from. This interface seems to work around the issue while preserving
 * our type safety (alternative being using `any` everywhere).
 * @docs-private
 */
interface BriFormFieldControl<T> extends _BriFormFieldControl<T> {}

/** Container for form controls that applies Material Design styling and behavior. */
@Component({
  selector: 'bri-form-field',
  exportAs: 'briFormField',
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field-input.scss', './form-field.component.scss'],
  host: {
    class: 'bri-form-field',
    '[class.bri-form-field-has-icon-prefix]': '_hasIconPrefix',
    '[class.bri-form-field-has-icon-suffix]': '_hasIconSuffix',
    // Note that these classes reuse the same names as the non-MDC version, because they can be
    // considered a public API since custom form controls may use them to style themselves.
    // See https://github.com/angular/components/pull/20502#discussion_r486124901.
    '[class.bri-form-field-invalid]': '_control.errorState',
    '[class.bri-form-field-disabled]': '_control.disabled',
    '[class.bri-form-field-autofilled]': '_control.autofilled',
    '[class.bri-form-field-no-animations]':
      '_animationMode === "NoopAnimations"',
    '[class.bri-focused]': '_control.focused',
    '[class.ng-untouched]': '_shouldForward("untouched")',
    '[class.ng-touched]': '_shouldForward("touched")',
    '[class.ng-pristine]': '_shouldForward("pristine")',
    '[class.ng-dirty]': '_shouldForward("dirty")',
    '[class.ng-valid]': '_shouldForward("valid")',
    '[class.ng-invalid]': '_shouldForward("invalid")',
    '[class.ng-pending]': '_shouldForward("pending")',
  },
  animations: [briFormFieldAnimations.transitionMessages],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: BRI_FORM_FIELD, useExisting: BriFormFieldComponent }],
  standalone: true,
  imports: [BriHintDirective, NgClass, NgTemplateOutlet],
})
export class BriFormFieldComponent
  implements AfterContentInit, AfterContentChecked, AfterViewInit, OnDestroy
{
  @ViewChild('textField') _textField!: ElementRef<HTMLElement>;

  @ViewChild('iconPrefixContainer')
  _iconPrefixContainer!: ElementRef<HTMLElement>;

  @ViewChild('textPrefixContainer')
  _textPrefixContainer!: ElementRef<HTMLElement>;

  @ContentChild(BriLabelDirective) _labelChildNonStatic:
    | BriLabelDirective
    | undefined;
  @ContentChild(BriLabelDirective, { static: true }) _labelChildStatic:
    | BriLabelDirective
    | undefined;

  @ContentChild(_BriFormFieldControl)
  _formFieldControl!: BriFormFieldControl<any>;

  @ContentChildren(BRI_PREFIX, { descendants: true })
  _prefixChildren!: QueryList<BriPrefixDirective>;

  @ContentChildren(BRI_SUFFIX, { descendants: true })
  _suffixChildren!: QueryList<BriSuffixDirective>;

  @ContentChildren(BRI_ERROR, { descendants: true })
  _errorChildren!: QueryList<BriErrorDirective>;

  @ContentChildren(BriHintDirective, { descendants: true })
  _hintChildren!: QueryList<BriHintDirective>;

  /** Whether the required marker should be hidden. */
  @Input()
  get hideRequiredMarker(): boolean {
    return this._hideRequiredMarker;
  }
  set hideRequiredMarker(value: BooleanInput) {
    this._hideRequiredMarker = coerceBooleanProperty(value);
  }
  private _hideRequiredMarker = false;

  /**
   * Whether the form field should reserve space for one line of hint/error text (default)
   * or to have the spacing grow from 0px as needed based on the size of the hint/error content.
   * Note that when using dynamic sizing, layout shifts will occur when hint/error text changes.
   */
  @Input()
  get subscriptSizing(): SubscriptSizing {
    return (
      this._subscriptSizing ||
      this._defaults?.subscriptSizing ||
      DEFAULT_SUBSCRIPT_SIZING
    );
  }
  set subscriptSizing(value: SubscriptSizing) {
    this._subscriptSizing =
      value || this._defaults?.subscriptSizing || DEFAULT_SUBSCRIPT_SIZING;
  }
  private _subscriptSizing: SubscriptSizing | null = null;

  /** Text for the form field hint. */
  @Input()
  get hintLabel(): string {
    return this._hintLabel;
  }

  set hintLabel(value: string) {
    this._hintLabel = value;
    this._processHints();
  }

  private _hintLabel = '';

  @Input({ transform: booleanAttribute })
  isTransparent = false;

  _hasIconPrefix = false;
  _hasTextPrefix = false;
  _hasIconSuffix = false;
  _hasTextSuffix = false;

  // Unique id for the internal form field label.
  readonly _labelId = `bri-form-field-label-${nextUniqueId++}`;

  // Unique id for the hint label.
  readonly _hintLabelId = `bri-hint-${nextUniqueId++}`;

  /** State of the bri-hint and bri-error animations. */
  _subscriptAnimationState = '';

  /** Gets the current form field control */
  get _control(): BriFormFieldControl<any> {
    return this._explicitFormFieldControl || this._formFieldControl;
  }
  set _control(value) {
    this._explicitFormFieldControl = value;
  }

  private _destroyed = new Subject<void>();
  private _isFocused: boolean | null = null;
  private _explicitFormFieldControl!: BriFormFieldControl<any>;

  constructor(
    public _elementRef: ElementRef,
    private _changeDetectorRef: ChangeDetectorRef,
    @Optional()
    @Inject(BRI_FORM_FIELD_DEFAULT_OPTIONS)
    private _defaults?: BriFormFieldDefaultOptions,
    @Optional() @Inject(ANIMATION_MODULE_TYPE) public _animationMode?: string
  ) {
    if (_defaults) {
      this._hideRequiredMarker = Boolean(_defaults?.hideRequiredMarker);
    }
  }

  ngAfterViewInit() {
    // Initial focus state sync. This happens rarely, but we want to account for
    // it in case the form field control has "focused" set to true on init.
    this._updateFocusState();
    // Enable animations now. This ensures we don't animate on initial render.
    this._subscriptAnimationState = 'enter';
    // Because the above changes a value used in the template after it was checked, we need
    // to trigger CD or the change might not be reflected if there is no other CD scheduled.
    this._changeDetectorRef.detectChanges();
  }

  ngAfterContentInit() {
    this._assertFormFieldControl();
    this._initializeControl();
    this._initializeSubscript();
    this._initializePrefixAndSuffix();
  }

  ngAfterContentChecked() {
    this._assertFormFieldControl();
  }

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }

  /**
   * Gets the id of the label element. If no label is present, returns `null`.
   */
  getLabelId(): string | null {
    return this._labelId;
  }

  /**
   * Gets an ElementRef for the element that a overlay attached to the form field
   * should be positioned relative to.
   */
  getConnectedOverlayOrigin(): ElementRef {
    return this._textField || this._elementRef;
  }

  /** Initializes the registered form field control. */
  private _initializeControl() {
    const control = this._control;

    if (control.controlType) {
      this._elementRef.nativeElement.classList.add(
        `bri-form-field-type-${control.controlType}`
      );
    }

    // Subscribe to changes in the child control state in order to update the form field UI.
    control.stateChanges.subscribe(() => {
      this._updateFocusState();
      this._syncDescribedByIds();
      this._changeDetectorRef.markForCheck();
    });

    // Run change detection if the value changes.
    if (control.ngControl && control.ngControl.valueChanges) {
      control.ngControl.valueChanges
        .pipe(takeUntil(this._destroyed))
        .subscribe(() => this._changeDetectorRef.markForCheck());
    }
  }

  private _checkPrefixAndSuffixTypes() {
    this._hasIconPrefix = !!this._prefixChildren.find((p) => !p._isText);
    this._hasTextPrefix = !!this._prefixChildren.find((p) => p._isText);
    this._hasIconSuffix = !!this._suffixChildren.find((s) => !s._isText);
    this._hasTextSuffix = !!this._suffixChildren.find((s) => s._isText);
  }

  /** Initializes the prefix and suffix containers. */
  private _initializePrefixAndSuffix() {
    this._checkPrefixAndSuffixTypes();
    // Mark the form field as dirty whenever the prefix or suffix children change. This
    // is necessary because we conditionally display the prefix/suffix containers based
    // on whether there is projected content.
    merge(this._prefixChildren.changes, this._suffixChildren.changes).subscribe(
      () => {
        this._checkPrefixAndSuffixTypes();
        this._changeDetectorRef.markForCheck();
      }
    );
  }

  /**
   * Initializes the subscript by validating hints and synchronizing "aria-describedby" ids
   * with the custom form field control. Also subscribes to hint and error changes in order
   * to be able to validate and synchronize ids on change.
   */
  private _initializeSubscript() {
    // Re-validate when the number of hints changes.
    this._hintChildren.changes.subscribe(() => {
      this._processHints();
      this._changeDetectorRef.markForCheck();
    });

    // Update the aria-described by when the number of errors changes.
    this._errorChildren.changes.subscribe(() => {
      this._syncDescribedByIds();
      this._changeDetectorRef.markForCheck();
    });

    // Initial bri-hint validation and subscript describedByIds sync.
    this._validateHints();
    this._syncDescribedByIds();
  }

  /** Throws an error if the form field's control is missing. */
  private _assertFormFieldControl() {
    if (!this._control && isDevMode()) {
      throw getBriFormFieldMissingControlError();
    }
  }

  private _updateFocusState() {
    // Usually the MDC foundation would call "activateFocus" and "deactivateFocus" whenever
    // certain DOM events are emitted. This is not possible in our implementation of the
    // form field because we support abstract form field controls which are not necessarily
    // of type input, nor do we have a reference to a native form field control element. Instead
    // we handle the focus by checking if the abstract form field control focused state changes.
    if (this._control.focused && !this._isFocused) {
      this._isFocused = true;
    } else if (
      !this._control.focused &&
      (this._isFocused || this._isFocused === null)
    ) {
      this._isFocused = false;
    }

    this._textField?.nativeElement.classList.toggle(
      'bri-text-field--focused',
      this._control.focused
    );
  }

  /**
   * Determines whether a class from the AbstractControlDirective
   * should be forwarded to the host element.
   */
  _shouldForward(prop: keyof AbstractControlDirective): boolean {
    const control = this._control ? this._control.ngControl : null;
    return control && control[prop];
  }

  /** Determines whether to display hints or errors. */
  _getDisplayedMessages(): 'error' | 'hint' {
    return this._errorChildren &&
      this._errorChildren.length > 0 &&
      this._control.errorState
      ? 'error'
      : 'hint';
  }

  /** Does any extra processing that is required when handling the hints. */
  private _processHints() {
    this._validateHints();
    this._syncDescribedByIds();
  }

  /**
   * Ensure that there is a maximum of one of each "bri-hint" alignment specified. The hint
   * label specified set through the input is being considered as "start" aligned.
   *
   * This method is a noop if Angular runs in production mode.
   */
  private _validateHints() {
    if (this._hintChildren && isDevMode()) {
      let startHint: BriHintDirective;
      let endHint: BriHintDirective;
      this._hintChildren.forEach((hint: BriHintDirective) => {
        if (hint.align === 'start') {
          if (startHint || this.hintLabel) {
            throw getBriFormFieldDuplicatedHintError('start');
          }
          startHint = hint;
        } else if (hint.align === 'end') {
          if (endHint) {
            throw getBriFormFieldDuplicatedHintError('end');
          }
          endHint = hint;
        }
      });
    }
  }

  /**
   * Sets the list of element IDs that describe the child control. This allows the control to update
   * its `aria-describedby` attribute accordingly.
   */
  private _syncDescribedByIds() {
    if (this._control) {
      const ids: string[] = [];

      // TODO(wagnermaciel): Remove the type check when we find the root cause of this bug.
      if (
        this._control.userAriaDescribedBy &&
        typeof this._control.userAriaDescribedBy === 'string'
      ) {
        ids.push(...this._control.userAriaDescribedBy.split(' '));
      }

      if (this._getDisplayedMessages() === 'hint') {
        const startHint = this._hintChildren
          ? this._hintChildren.find((hint) => hint.align === 'start')
          : null;
        const endHint = this._hintChildren
          ? this._hintChildren.find((hint) => hint.align === 'end')
          : null;

        if (startHint) {
          ids.push(startHint.id);
        } else if (this._hintLabel) {
          ids.push(this._hintLabelId);
        }

        if (endHint) {
          ids.push(endHint.id);
        }
      } else if (this._errorChildren) {
        ids.push(...this._errorChildren.map((error) => error.id));
      }

      this._control.setDescribedByIds(ids);
    }
  }
}
