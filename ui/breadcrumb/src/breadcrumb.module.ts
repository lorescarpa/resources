import { NgModule } from '@angular/core';
import { BriBreadcrumbComponent } from './breadcrumb.component';
import { BriBreadcrumbItemDirective } from './breadcrumb-item.directive';
import { CommonModule } from '@angular/common';
import { BriSkeletonLoaderModule } from '@wkp/bricks/skeleton-loader';
import { BriBreadcrumbSkeletonComponent } from './breadcrumb-skeleton.component';
import { BriButtonModule } from '@wkp/bricks/button';

const BREADCRUMB_DECLARATIONS = [
  BriBreadcrumbComponent,
  BriBreadcrumbItemDirective,
  BriBreadcrumbSkeletonComponent,
];

@NgModule({
  imports: [
    CommonModule,
    BriButtonModule,
    BriSkeletonLoaderModule,
    ...BREADCRUMB_DECLARATIONS,
  ],
  exports: BREADCRUMB_DECLARATIONS,
})
export class BriBreadcrumbModule {}
