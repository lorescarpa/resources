import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  input,
} from '@angular/core';
import { BriIconModule, injectIcons } from '@wkp/bricks/icon';
import { navigationAndActionIcons } from '@wkp/bricks/svg/navigation-and-action';
import { BriStatusIndicatorType } from './interfaces';

@Component({
  standalone: true,
  selector: 'bri-status-indicator',
  templateUrl: './status.indicator.component.html',
  styleUrls: ['./status.indicator.component.scss'],
  host: { class: 'bri-status-indicator' },
  imports: [BriIconModule, NgClass],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BriStatusIndicatorComponent {
  private _iconsByType: Record<BriStatusIndicatorType, string> = {
    success: 'success-large',
    fail: 'fail-large',
  };

  type = input<BriStatusIndicatorType>('success');

  title = input<string | null>(null);

  message = input<string | null>(null);

  _typeIconName = computed(() => {
    return this._iconsByType[this.type()];
  });

  constructor() {
    injectIcons(navigationAndActionIcons);
  }
}
