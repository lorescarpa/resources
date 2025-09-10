import { NgModule } from '@angular/core';
import { BriPseudoCheckboxModule } from './../selection';
import { BriOptionGroupComponent } from './option-group.component';
import { BriOptionComponent } from './option.component';

const OPTION_DECLARATIONS = [BriOptionComponent, BriOptionGroupComponent];

@NgModule({
  imports: [BriPseudoCheckboxModule, ...OPTION_DECLARATIONS],
  exports: OPTION_DECLARATIONS,
})
export class BriOptionModule {}
