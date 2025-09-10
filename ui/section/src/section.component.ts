import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  standalone: true,
  selector: 'bri-section',
  template: `<ng-content></ng-content>`,
  styleUrl: './section.component.scss',
  host: {
    class: 'bri-section',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BriSectionComponent {}
