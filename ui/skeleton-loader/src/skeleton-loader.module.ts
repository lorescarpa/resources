import { NgModule } from '@angular/core';
import { BriSkeletonLoaderComponent } from './skeleton-loader.component';

const SKELETON_LOADER_DECLACLRATIONS = [BriSkeletonLoaderComponent];

@NgModule({
  imports: SKELETON_LOADER_DECLACLRATIONS,
  exports: SKELETON_LOADER_DECLACLRATIONS,
})
export class BriSkeletonLoaderModule {}
