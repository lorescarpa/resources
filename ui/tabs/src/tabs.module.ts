/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { NgModule } from '@angular/core';
import { BriTabContentDirective } from './tab-content.directive';
import { BriTabLabelDirective } from './tab-label.directive';
import { BriTabComponent } from './tab.component';
import { BriTabGroupComponent } from './tab-group.component';

@NgModule({
  imports: [
    BriTabContentDirective,
    BriTabLabelDirective,
    BriTabComponent,
    BriTabGroupComponent,
  ],
  exports: [
    BriTabContentDirective,
    BriTabLabelDirective,
    BriTabComponent,
    BriTabGroupComponent,
  ],
})
export class BriTabsModule {}
