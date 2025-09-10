import { A11yModule } from '@angular/cdk/a11y';
import { NgModule } from '@angular/core';
import { BriBadgeDirective } from './badge.directive';

const BADGE_DECLARATIONS = [BriBadgeDirective];

@NgModule({
  imports: [A11yModule, ...BADGE_DECLARATIONS],
  exports: BADGE_DECLARATIONS,
})
export class BriBadgeModule {}
