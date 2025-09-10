import { NgModule } from '@angular/core';
import { BriChangeRingDirective } from './change-ring.directive';
import { BriChangeRingItemDirective } from './change-ring-item.directive';

const CHANGE_DECLARATIONS = [
  BriChangeRingDirective,
  BriChangeRingItemDirective,
];

@NgModule({
  imports: CHANGE_DECLARATIONS,
  exports: CHANGE_DECLARATIONS,
})
export class BriChangeModule {}
