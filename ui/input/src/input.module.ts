import { NgModule } from '@angular/core';
import { BriInputDirective } from './input.directive';
import { BriFormFieldModule } from '@wkp/bricks/form-field';
import { TextFieldModule } from '@angular/cdk/text-field';

const INPUT_DECLERATIONS = [BriInputDirective, BriFormFieldModule];

@NgModule({
  imports: INPUT_DECLERATIONS,
  exports: [...INPUT_DECLERATIONS, TextFieldModule],
})
export class BriInputModule {}
