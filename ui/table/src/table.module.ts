/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { NgModule } from '@angular/core';
import { BriRecycleRowsDirective, BriTableComponent } from './table.component';
import { CdkTableModule } from '@angular/cdk/table';
import {
  BriCellDirective,
  BriCellDefDirective,
  BriColumnDefDirective,
  BriFooterCellDirective,
  BriFooterCellDefDirective,
  BriHeaderCellDirective,
  BriHeaderCellDefDirective,
} from './cell';
import {
  BriFooterRowComponent,
  BriFooterRowDefDirective,
  BriHeaderRowComponent,
  BriHeaderRowDefDirective,
  BriRowComponent,
  BriRowDefDirective,
  BriNoDataRowDirective,
} from './row';
import { BriTextColumnComponent } from './text-column.component';
import { BriSkeletonLoaderComponent } from '@wkp/bricks/skeleton-loader';
import { BriTableSkeletonComponent } from './table-skeleton.component';

export const EXPORTED_DECLARATIONS = [
  // Table
  BriTableComponent,
  BriRecycleRowsDirective,

  // Template defs
  BriHeaderCellDefDirective,
  BriHeaderRowDefDirective,
  BriColumnDefDirective,
  BriCellDefDirective,
  BriRowDefDirective,
  BriFooterCellDefDirective,
  BriFooterRowDefDirective,

  // Cell directives
  BriHeaderCellDirective,
  BriCellDirective,
  BriFooterCellDirective,

  // Row directives
  BriHeaderRowComponent,
  BriRowComponent,
  BriFooterRowComponent,
  BriNoDataRowDirective,

  BriTextColumnComponent,
  BriTableSkeletonComponent,
];

@NgModule({
  imports: [
    CdkTableModule,
    BriSkeletonLoaderComponent,
    ...EXPORTED_DECLARATIONS,
  ],
  exports: [EXPORTED_DECLARATIONS],
})
export class BriTableModule {}
