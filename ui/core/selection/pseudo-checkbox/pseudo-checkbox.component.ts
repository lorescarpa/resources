/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';

/**
 * Possible states for a pseudo checkbox.
 * @docs-private
 */
export type BriPseudoCheckboxState = 'unchecked' | 'checked' | 'indeterminate';

/**
 * Component that shows a simplified checkbox without including any kind of "real" checkbox.
 * Meant to be used when the checkbox is purely decorative and a large number of them will be
 * included, such as for the options in a multi-select. Uses no SVGs or complex animations.
 * Note that this component will be completely invisible to screen-reader users. This is *not*
 * interchangeable with `<bri-checkbox>` and should *not* be used if the user would directly
 * interact with the checkbox. The pseudo-checkbox should only be used as an implementation detail
 * of more complex components that appropriately handle selected / checked state.
 * @docs-private
 */
@Component({
  standalone: true,
  selector: 'bri-pseudo-checkbox',
  template: '',
  styleUrl: './pseudo-checkbox.component.scss',
  host: {
    class: 'bri-pseudo-checkbox',
    '[class.bri-pseudo-checkbox-indeterminate]': 'state === "indeterminate"',
    '[class.bri-pseudo-checkbox-checked]': 'state === "checked"',
    '[class.bri-pseudo-checkbox-disabled]': 'disabled',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BriPseudoCheckboxComponent {
  /** Display state of the checkbox. */
  @Input() state: BriPseudoCheckboxState = 'unchecked';

  /** Whether the checkbox is disabled. */
  @Input() disabled = false;
}
