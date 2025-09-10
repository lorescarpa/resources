import { NgModule } from '@angular/core';
import { BriSortDirective } from './sort.directive';
import { BriSortHeaderComponent } from './sort-header.component';

const SORT_DECLARATIONS = [BriSortDirective, BriSortHeaderComponent];

@NgModule({
  imports: SORT_DECLARATIONS,
  exports: SORT_DECLARATIONS
})
export class BriSortModule {}
