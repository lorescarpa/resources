import { NgModule } from '@angular/core';
import { BriTagComponent } from './tag.component';

const TAG_DECLARATIONS = [BriTagComponent];

@NgModule({
  imports: TAG_DECLARATIONS,
  exports: TAG_DECLARATIONS,
})
export class BriTagModule {}
