import { Directive } from '@angular/core';

@Directive({
  standalone: true,
  selector: 'bri-section-data-label, [briSectionDataLabel]',
  host: {
    class: 'bri-section-data-label',
  },
})
export class BriSectionDataLabelDirective {}

@Directive({
  standalone: true,
  selector: 'bri-section-data-value, [briSectionDataValue]',
  host: {
    class: 'bri-section-data-value',
  },
})
export class BriSectionDataValueDirective {}
