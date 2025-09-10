import { PortalModule } from '@angular/cdk/portal';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { NgModule } from '@angular/core';
import { BriStepComponent } from './step.component';
import { BriStepContentDirective } from './step-content.directive';
import { BriStepperComponent } from './stepper.component';
import { BriStepperPreviousDirective, BriStepperNextDirective } from './stepper-button.directives';

const STEPPER_DECLARATIONS = [
  BriStepComponent,
  BriStepContentDirective,
  BriStepperComponent,
  BriStepperPreviousDirective,
  BriStepperNextDirective,
];

@NgModule({
  imports: [CdkStepperModule, PortalModule, ...STEPPER_DECLARATIONS],
  exports: STEPPER_DECLARATIONS,
})
export class BriStepperModule {}
