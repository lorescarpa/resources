import { NgModule } from '@angular/core';
import { BriSelectionDirective } from './selection.directive';
import { BriSelectAllDirective } from './select-all.directive';
import { BriSelectionToggleDirective } from './selection-toggle.directive';

const SELECTION_DECLARATIONS = [
  BriSelectionDirective,
  BriSelectAllDirective,
  BriSelectionToggleDirective,
];

@NgModule({
  imports: SELECTION_DECLARATIONS,
  exports: SELECTION_DECLARATIONS,
})
export class BriSelectionModule {}
