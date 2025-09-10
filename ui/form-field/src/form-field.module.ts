import { ObserversModule } from '@angular/cdk/observers';
import { NgModule } from '@angular/core';
import { BriErrorDirective } from './directives/error.directive';
import { BriHintDirective } from './directives/hint.directive';
import { BriLabelDirective } from './directives/label.directive';
import { BriPrefixDirective } from './directives/prefix.directive';
import { BriSuffixDirective } from './directives/suffix.directive';
import { BriFormFieldComponent } from './form-field.component';

const FORM_FIELD_DECLARATIONS = [
  BriFormFieldComponent,
  BriLabelDirective,
  BriErrorDirective,
  BriHintDirective,
  BriPrefixDirective,
  BriSuffixDirective,
];

@NgModule({
  imports: [ObserversModule, ...FORM_FIELD_DECLARATIONS],
  exports: FORM_FIELD_DECLARATIONS,
})
export class BriFormFieldModule {}
