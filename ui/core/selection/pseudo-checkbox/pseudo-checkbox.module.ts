import { NgModule } from '@angular/core';
import { BriPseudoCheckboxComponent } from './pseudo-checkbox.component';

const PSEUDO_CHECKBOX_DECLARATIONS = [BriPseudoCheckboxComponent];

@NgModule({
  imports: PSEUDO_CHECKBOX_DECLARATIONS,
  exports: PSEUDO_CHECKBOX_DECLARATIONS,
})
export class BriPseudoCheckboxModule {}
