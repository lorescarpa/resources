import { NgModule } from '@angular/core';
import { BriIconComponent } from './icon.component';

const ICON_DECLARATIONS = [BriIconComponent];

@NgModule({
  imports: ICON_DECLARATIONS,
  exports: ICON_DECLARATIONS,
})
export class BriIconModule {}
