import { FocusMonitor } from '@angular/cdk/a11y';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewEncapsulation,
  inject,
  input,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { injectNgControl } from './ng-control.inject';
import { NoopValueAccessorDirective } from './noop-value-accessor.directive';

let nextUniqueId = 0;

@Component({
  standalone: true,
  selector: 'bri-switch',
  templateUrl: './switch.component.html',
  styleUrl: './switch.component.scss',
  host: {
    '[id]': 'id()',
    '[class.bri-switch--disabled]': 'disabled',
  },
  imports: [ReactiveFormsModule],
  hostDirectives: [NoopValueAccessorDirective],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BriSwitchComponent {
  #elementRef = inject(ElementRef);

  #focusMonitor = inject(FocusMonitor);

  _ngControl = injectNgControl();

  get disabled() {
    return this._ngControl?.control?.disabled;
  }

  id = input(`bri-switch-${++nextUniqueId}`);
}
