import { Directive } from '@angular/core';

@Directive({
  standalone: true,
  selector: 'input[type="radio"][briRadio]',
  host: {
    class: 'bri-radio'
  }
})
export class BriRadioDirective {}
