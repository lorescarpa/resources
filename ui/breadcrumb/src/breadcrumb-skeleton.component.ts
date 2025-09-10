import { AsyncPipe, NgFor } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  input,
} from '@angular/core';
import { BriSkeletonLoaderComponent } from '@wkp/bricks/skeleton-loader';

@Component({
  standalone: true,
  selector: 'bri-breadcrumb-skeleton',
  template: `<nav class="bri-breadcrumb" aria-label="Breadcrumb">
    <ol>
      @for(item of _items(); track item) {
      <li>
        <bri-skeleton-loader
          style="width: 120px; height: 20px"
        ></bri-skeleton-loader>
      </li>
      }
    </ol>
  </nav> `,
  styleUrls: ['./breadcrumb.component.scss'],
  imports: [AsyncPipe, BriSkeletonLoaderComponent, NgFor],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BriBreadcrumbSkeletonComponent {
  readonly repetitions = input(0);

  readonly _items = computed(() => {
    return Array.from({ length: this.repetitions() }, (_, index) => index);
  });
}
