import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { CdkOption } from '@angular/cdk/listbox';
import { BriPseudoRadioModule } from '@wkp/bricks/core';

@Component({
  standalone: true,
  selector: 'bri-selection-box-item, [briSelectionBoxItem]',
  templateUrl: './selection-box-item.component.html',
  styleUrls: ['./selection-box-item.component.scss'],
  host: {
    class: 'bri-selection-box-item bri-selection-box-item-default',
    '[class.bri-selection-box-item-vertical]':
      'listbox.orientation === "vertical"',
    '[class.bri-selection-box-item-horizontal]':
      'listbox.orientation === "horizontal"',
    '[class.bri-selection-box-item-selected]': 'isSelected()',
  },
  inputs: ['disabled'],
  imports: [BriPseudoRadioModule],
  providers: [
    { provide: CdkOption, useExisting: BriSelectionBoxItemComponent },
  ],
  encapsulation: ViewEncapsulation.None,
})
export class BriSelectionBoxItemComponent<T = unknown> extends CdkOption<T> {}
