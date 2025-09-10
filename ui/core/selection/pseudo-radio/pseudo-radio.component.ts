import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';

/**
 * Possible states for a pseudo radio.
 * @docs-private
 */
export type BriPseudoRadioState = 'unchecked' | 'checked';

/**
 * Component that shows a simplified radio without including any kind of "real" radio.
 * Meant to be used when the radio is purely decorative and a large number of them will be
 * included, such as for the options in a multi-select. Uses no SVGs or complex animations.
 * Note that this component will be completely invisible to screen-reader users. This is *not*
 * interchangeable with `<bri-radio>` and should *not* be used if the user would directly
 * interact with the radio. The pseudo-radio should only be used as an implementation detail
 * of more complex components that appropriately handle selected / checked state.
 * @docs-private
 */

@Component({
  standalone: true,
  selector: 'bri-pseudo-radio',
  template: '',
  styleUrl: './pseudo-radio.component.scss',
  host: {
    class: 'bri-pseudo-radio',
    '[class.bri-pseudo-radio-indeterminate]': 'state === "indeterminate"',
    '[class.bri-pseudo-radio-checked]': 'state === "checked"',
    '[class.bri-pseudo-radio-disabled]': 'disabled',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BriPseudoRadioComponent {
  /** Display state of the radio. */
  @Input() state: BriPseudoRadioState = 'unchecked';

  /** Whether the radio is disabled. */
  @Input() disabled = false;
}
