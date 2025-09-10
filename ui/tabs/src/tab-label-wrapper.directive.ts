/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { Directive, ElementRef, Input, booleanAttribute } from '@angular/core';
import { InkBarItem } from './ink-bar.directive';

/**
 * Used in the `bri-tab-group` view to display tab labels.
 * @docs-private
 */
@Directive({
  selector: '[briTabLabelWrapper]',
  inputs: ['fitInkBarToContent'],
  host: {
    '[class.bri-tab-disabled]': 'disabled',
    '[attr.aria-disabled]': '!!disabled',
  },
  standalone: true,
})
export class BriTabLabelWrapperDirective extends InkBarItem {
  /** Whether the tab is disabled. */
  @Input({ transform: booleanAttribute })
  disabled = false;

  constructor(public elementRef: ElementRef) {
    super();
  }

  /** Sets focus on the wrapper element */
  focus(): void {
    this.elementRef.nativeElement.focus();
  }

  getOffsetLeft(): number {
    return this.elementRef.nativeElement.offsetLeft;
  }

  getOffsetWidth(): number {
    return this.elementRef.nativeElement.offsetWidth;
  }
}
