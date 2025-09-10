/* eslint-disable @angular-eslint/no-host-metadata-property */
/* eslint-disable @angular-eslint/component-selector */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Platform} from '@angular/cdk/platform';
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

@Component({
  standalone: true,
  selector: `button[bri-icon-button]`,
  templateUrl: './button.html',
  styleUrls: ['./icon-button.component.scss'],
  host: BRI_BUTTON_HOST,
  exportAs: 'matButton',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BriIconButtonComponent extends BriButtonBaseDirective {
  constructor(
    elementRef: ElementRef,
    platform: Platform,
    ngZone: NgZone,
    @Optional() @Inject(ANIMATION_MODULE_TYPE) animationMode?: string,
  ) {
    super(elementRef, platform, ngZone, animationMode);
  }
}

@Component({
  standalone: true,
  selector: `a[bri-icon-button]`,
  templateUrl: './button.html',
  styleUrls: ['./icon-button.component.scss'],
  host: BRI_ANCHOR_HOST,
  exportAs: 'briButton, briAnchor',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BriIconAnchorComponent extends BriAnchorBaseDirective {
  constructor(
    elementRef: ElementRef,
    platform: Platform,
    ngZone: NgZone,
    @Optional() @Inject(ANIMATION_MODULE_TYPE) animationMode?: string,
  ) {
    super(elementRef, platform, ngZone, animationMode);
  }
}