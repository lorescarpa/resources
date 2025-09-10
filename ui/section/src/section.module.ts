import { NgModule } from '@angular/core';
import { BriSectionDataComponent } from './section-data.component';
import {
  BriSectionDataLabelDirective,
  BriSectionDataValueDirective,
} from './section-data.directives';
import { BriSectionComponent } from './section.component';
import {
  BriSectionDisclaimerDirective,
  BriSectionTitleDirective,
} from './section.directives';

const SECTION_DECLARATIONS = [
  BriSectionComponent,
  BriSectionDataComponent,
  BriSectionDataLabelDirective,
  BriSectionDataValueDirective,
  BriSectionDisclaimerDirective,
  BriSectionTitleDirective,
];

@NgModule({
  imports: SECTION_DECLARATIONS,
  exports: SECTION_DECLARATIONS,
})
export class BriSectionModule {}
