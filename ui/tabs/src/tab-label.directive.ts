/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {
  Directive,
  Inject,
  InjectionToken,
  Optional,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { CdkPortal } from '@angular/cdk/portal';

/**
 * Injection token that can be used to reference instances of `BriTabLabel`. It serves as
 * alternative token to the actual `BriTabLabel` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export const BRI_TAB_LABEL = new InjectionToken<BriTabLabelDirective>(
  'BriTabLabel'
);

/**
 * Used to provide a tab label to a tab without causing a circular dependency.
 * @docs-private
 */
export const BRI_TAB = new InjectionToken<any>('BRI_TAB');

/** Used to flag tab labels for use with the portal directive */
@Directive({
  selector: '[bri-tab-label], [briTabLabel]',
  providers: [{ provide: BRI_TAB_LABEL, useExisting: BriTabLabelDirective }],
  standalone: true,
})
export class BriTabLabelDirective extends CdkPortal {
  constructor(
    templateRef: TemplateRef<any>,
    viewContainerRef: ViewContainerRef,
    @Inject(BRI_TAB) @Optional() public _closestTab: any
  ) {
    super(templateRef, viewContainerRef);
  }
}
