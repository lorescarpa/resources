import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { CdkListbox } from '@angular/cdk/listbox';

@Component({
  standalone: true,
  selector: 'bri-selection-box',
  template: `<ng-content></ng-content>`,
  styleUrls: ['./selection-box.component.scss'],
  host: {
    class: 'bri-selection-box',
  },
  providers: [{ provide: CdkListbox, useExisting: BriSelectionBoxComponent }],
  inputs: ['disabled', 'orientation'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BriSelectionBoxComponent<T> extends CdkListbox<T> {}
