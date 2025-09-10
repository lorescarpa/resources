import { Directive, input } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[briChangeRing]',
  exportAs: 'briChangeRing',
})
export class BriChangeRingDirective {
  value = input<string[] | null>(null, { alias: 'briChangeRing' });
}
