import { NgModule } from '@angular/core';
import { BriStatusIndicatorComponent } from './status.indicator.component';
import { BriIconModule } from '@wkp/bricks/icon';
import { BriSkeletonLoaderModule } from '@wkp/bricks/skeleton-loader';
import { BriStatusIndicatorSkeletonComponent } from './status-indicator-skeleton.component';
import { CommonModule } from '@angular/common';

const STATUS_INDICATOR_DECLARATIONS = [
  BriStatusIndicatorComponent,
  BriStatusIndicatorSkeletonComponent,
];

@NgModule({
  imports: [
    CommonModule,
    BriIconModule,
    BriSkeletonLoaderModule,
    ...STATUS_INDICATOR_DECLARATIONS,
  ],
  exports: STATUS_INDICATOR_DECLARATIONS,
})
export class BriStatusIndicatorModule {}
