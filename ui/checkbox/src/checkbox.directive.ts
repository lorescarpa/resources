import { Directive } from '@angular/core';

@Directive({
  standalone: true,
  selector: 'input[type="checkbox"][briCheckbox]',
  host: {
    class: 'bri-checkbox',
  },
})
export class BriCheckboxDirective {}
