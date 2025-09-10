/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { OverlayModule } from '@angular/cdk/overlay';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BriOptionModule } from '@wkp/bricks/core';
import { BriFormFieldModule } from '@wkp/bricks/form-field';
import {
  BriSelectComponent,
  BriSelectTriggerDirective,
  BRI_SELECT_SCROLL_STRATEGY_PROVIDER,
} from './select.component';

const SELECT_DECLARATIONS = [BriSelectComponent, BriSelectTriggerDirective];

@NgModule({
  imports: [
    CommonModule,
    OverlayModule,
    BriOptionModule,
    ...SELECT_DECLARATIONS,
  ],
  exports: [
    CdkScrollableModule,
    BriFormFieldModule,
    BriOptionModule,
    ...SELECT_DECLARATIONS,
  ],
  providers: [BRI_SELECT_SCROLL_STRATEGY_PROVIDER],
})
export class BriSelectModule {}
