import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  standalone: true,
  selector: 'bri-section-data',
  templateUrl: './section-data.component.html',
  styleUrl: './section-data.component.scss',
  host: {
    class: 'bri-section-data',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BriSectionDataComponent {}
