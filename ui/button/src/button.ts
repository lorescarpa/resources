/* eslint-disable @angular-eslint/no-host-metadata-property */
/* eslint-disable @angular-eslint/component-selector */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { Platform } from '@angular/cdk/platform';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  NgZone,
  Optional,
  ViewEncapsulation,
  ANIMATION_MODULE_TYPE,
} from '@angular/core';

import {
  BRI_ANCHOR_HOST,
  BRI_BUTTON_HOST,
  BriAnchorBaseDirective,
  BriButtonBaseDirective,
} from './button-base';

/**
 * The `BriButton` class applies to native button elements and captures the appearances for
 * "text button", "outlined button", and "contained button" per the Material Design
 * specification. `MatButton` additionally captures an additional "flat" appearance, which matches
 * "contained" but without elevation.
 */
@Component({
  standalone: true,
  selector: 'button[bri-button], button[bri-text-button]',
  templateUrl: './button.html',
  styleUrls: ['./button.scss'],
  host: BRI_BUTTON_HOST,
  exportAs: 'briButton',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BriButtonComponent extends BriButtonBaseDirective {
  constructor(
    elementRef: ElementRef,
    platform: Platform,
    ngZone: NgZone,
    @Optional() @Inject(ANIMATION_MODULE_TYPE) animationMode?: string
  ) {
    super(elementRef, platform, ngZone, animationMode);
  }
}

/**
 * The `BriAnchor` class applies to native anchor elements and captures the appearances for
 * "text button", "outlined button", and "contained button" per the Material Design
 * specification. `MatAnchor` additionally captures an additional "flat" appearance, which matches
 * "contained" but without elevation.
 */
@Component({
  standalone: true,
  selector: 'a[bri-button], a[bri-text-button]',
  exportAs: 'briButton, briAnchor',
  host: BRI_ANCHOR_HOST,
  templateUrl: './button.html',
  styleUrls: ['./button.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BriAnchorComponent extends BriAnchorBaseDirective {
  constructor(
    elementRef: ElementRef,
    platform: Platform,
    ngZone: NgZone,
    @Optional() @Inject(ANIMATION_MODULE_TYPE) animationMode?: string
  ) {
    super(elementRef, platform, ngZone, animationMode);
  }
}
