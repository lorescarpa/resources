import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { BriSkeletonLoaderModule } from '@wkp/bricks/skeleton-loader';

@Component({
  standalone: true,
  selector: 'bri-status-indicator-skeleton',
  template: `<div class="bri-status-indicator-content">
    <div class="bri-status-indicator-icon">
      <bri-skeleton-loader
        style="width: 100px; height: 100px"
      ></bri-skeleton-loader>
    </div>
    <div class="bri-status-indicator-title">
      <bri-skeleton-loader
        style="width: 100px; height: 24px"
      ></bri-skeleton-loader>
      <bri-skeleton-loader
        style="width: 50px; height: 24px"
      ></bri-skeleton-loader>
      <bri-skeleton-loader
        style="width: 80px; height: 24px"
      ></bri-skeleton-loader>
    </div>
    <p class="bri-status-indicator-body">
      <bri-skeleton-loader
        style="width: 80px; height: 18px"
      ></bri-skeleton-loader>
      <bri-skeleton-loader
        style="width: 120px; height: 18px"
      ></bri-skeleton-loader>
      <bri-skeleton-loader
        style="width: 40px; height: 18px"
      ></bri-skeleton-loader>
      <bri-skeleton-loader
        style="width: 100px; height: 18px"
      ></bri-skeleton-loader>
      <bri-skeleton-loader
        style="width: 70px; height: 18px"
      ></bri-skeleton-loader>
      <bri-skeleton-loader
        style="width: 110px; height: 18px"
      ></bri-skeleton-loader>
      <bri-skeleton-loader
        style="width: 60px; height: 18px"
      ></bri-skeleton-loader>
      <bri-skeleton-loader
        style="width: 50px; height: 18px"
      ></bri-skeleton-loader>
      <bri-skeleton-loader
        style="width: 110px; height: 18px"
      ></bri-skeleton-loader>
    </p>
  </div>`,
  styleUrls: ['./status.indicator.component.scss'],
  host: { class: 'bri-status-indicator' },
  imports: [BriSkeletonLoaderModule],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BriStatusIndicatorSkeletonComponent {}
