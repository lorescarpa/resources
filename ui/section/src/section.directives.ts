import { Directive } from '@angular/core';

@Directive({
  standalone: true,
  selector: 'bri-section-title, [briSectionTitle]',
  host: {
    class: 'bri-section-title',
  },
})
export class BriSectionTitleDirective {}

@Directive({
  standalone: true,
  selector: 'bri-section-disclaimer, [briSectionDisclaimer]',
  host: {
    class: 'bri-section-disclaimer',
  },
})
export class BriSectionDisclaimerDirective {}
