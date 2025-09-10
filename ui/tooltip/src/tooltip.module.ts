import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { NgModule } from '@angular/core';
import { BriTooltipComponent } from './tooltip.component';
import { BriTooltipDirective } from './tooltip.directive';

const TOOLTIP_DECLARATIONS = [BriTooltipDirective, BriTooltipComponent];

@NgModule({
  imports: [OverlayModule, PortalModule, ...TOOLTIP_DECLARATIONS],
  exports: TOOLTIP_DECLARATIONS,
})
export class BriTooltipModule {}
