import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  input,
} from '@angular/core';

@Component({
  standalone: true,
  selector: 'bri-tag',
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.scss',
  host: {
    class: 'bri-tag',
    '[style.background-color]': 'color()',
    '[class.bri-tag-border]': 'color() === "transparent"',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BriTagComponent {
  color = input<string>();
}
