import { NgModule } from '@angular/core';
import { BriPseudoRadioComponent } from './pseudo-radio.component';

const PSEUDO_RADIO_DECLARATIONS = [BriPseudoRadioComponent];

@NgModule({
  imports: PSEUDO_RADIO_DECLARATIONS,
  exports: PSEUDO_RADIO_DECLARATIONS,
})
export class BriPseudoRadioModule {}
