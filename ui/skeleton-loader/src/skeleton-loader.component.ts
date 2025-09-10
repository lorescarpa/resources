import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'bri-skeleton-loader',
  template: '',
  styles: `
  @keyframes pulse {
  50% {
    opacity: 0.5;
  }
}
.bri-skeleton-loader {
  display: inline-block;
  width: 100%;
  height: 100%;
  min-height: 10px;
  margin-right: 5px;
  background: #e5e5e5;
  border-radius: 4px;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
`,
  host: {
    class: 'bri-skeleton-loader',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class BriSkeletonLoaderComponent {}
