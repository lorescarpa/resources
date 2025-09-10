import { NgModule } from '@angular/core';
import { BriAnchorComponent, BriButtonComponent } from './button';
import {
  BriIconAnchorComponent,
  BriIconButtonComponent,
} from './icon-button.component';

const BUTTON_DECLARATIONS = [
  BriButtonComponent,
  BriAnchorComponent,
  BriIconAnchorComponent,
  BriIconButtonComponent,
];

@NgModule({
  imports: BUTTON_DECLARATIONS,
  exports: BUTTON_DECLARATIONS,
})
export class BriButtonModule {}
