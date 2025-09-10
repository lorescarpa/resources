import { NgModule } from '@angular/core';
import { BriRadioDirective } from './radio.directive';

@NgModule({
  imports: [BriRadioDirective],
  exports: [BriRadioDirective]
})
export class BriRadioModule {}
