import { NgModule } from '@angular/core';
import { BriCheckboxDirective } from './checkbox.directive';

@NgModule({
  imports: [BriCheckboxDirective],
  exports: [BriCheckboxDirective]
})
export class BriCheckboxModule {}
