import { NgModule } from '@angular/core';
import { BriSwitchComponent } from './switch.component';

const SWITCH_DECLARATIONS = [BriSwitchComponent];

@NgModule({
  imports: SWITCH_DECLARATIONS,
  exports: SWITCH_DECLARATIONS,
})
export class BriSwitchModule {}
